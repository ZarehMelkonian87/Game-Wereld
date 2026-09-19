import { useCallback, useEffect, useRef, useState } from "react";
import { useDutchSpeechRecognition } from "../../hooks/useDutchSpeechRecognition";
import type { VoiceRecognitionStatus } from "../../logic/speech-recognition";
import { filterUnwantedCandidates, UNWANTED_WORD_NUDGE } from "../../logic/word-safety";
import type { VoiceSideScrollerTarget } from "./voiceSideScrollerModel";
import { matchVoiceSideScrollerWord } from "./voiceSideScrollerWords";

export type VoiceSideScrollerWordRecognitionStatus =
  "idle" | "listening" | "matched" | "missed" | "unsupported" | "error";

export interface VoiceSideScrollerWordRecognitionState {
  confidence?: number;
  errorMessage?: string;
  feedbackText: string;
  isListening: boolean;
  lastHeard?: string;
  matchedAlias?: string;
  status: VoiceSideScrollerWordRecognitionStatus;
  supportMessage: string;
  targetWord?: string;
}

export interface VoiceSideScrollerWordRecognitionController {
  wordRecognition: VoiceSideScrollerWordRecognitionState;
}

interface UseVoiceSideScrollerWordRecognitionOptions {
  isRunning: boolean;
  onWordMissed: (target: VoiceSideScrollerTarget | undefined, transcript: string) => void;
  onWordMatched: (target: VoiceSideScrollerTarget, transcript: string) => void;
  visibleTargets: VoiceSideScrollerTarget[];
}

interface HeardWordMemoryEntry {
  atMs: number;
  token: string;
}

const createIdleWordRecognitionState = (
  supportMessage = "Noem een plaatje wanneer het in beeld komt.",
): VoiceSideScrollerWordRecognitionState => ({
  feedbackText: "Noem een plaatje wanneer het in beeld komt.",
  isListening: false,
  status: "idle",
  supportMessage,
});

const getListeningFeedbackText = () => "Noem een plaatje dat je ziet.";

const getSpeechStatusFeedback = (speechStatus: VoiceRecognitionStatus) => {
  if (speechStatus === "listening") {
    return getListeningFeedbackText();
  }

  if (speechStatus === "processing") {
    return "Ik luister mee...";
  }

  return "Noem snel een plaatje.";
};

const getTranscriptCandidates = (
  transcript: string | undefined,
  alternatives: { transcript: string }[],
) => {
  const rawList = [transcript, ...alternatives.map((alternative) => alternative.transcript)]
    .filter((candidate): candidate is string => Boolean(candidate?.trim()))
    .map((candidate) => candidate.trim());

  const tokens = rawList.flatMap((cand) => cand.split(/\s+/).filter(Boolean));

  return [...new Set([...rawList, ...tokens])];
};

const getHasBlockingSpeechError = (errorMessage: string | undefined) =>
  Boolean(errorMessage?.includes("microfoon") || errorMessage?.includes("toestemming"));

const VOICE_SCROLLER_FEEDBACK_VISIBLE_MS = 360;
// Hoe lang een gehoord woord "onthouden" wordt. Zo hoeft het kind het plaatje
// niet exact op het juiste moment te benoemen: als het woord kort daarvoor is
// gezegd en het plaatje scrolt daarna het venster in, wordt het alsnog opgepakt
// (vergevingsgezind, past bij de logopedische doelen — T-32).
const VOICE_SCROLLER_HEARD_MEMORY_MS = 1800;
// Debounce voor de herstel-watchdog: als de herkenning tijdens een lopende ronde
// uit "luisteren" valt (einde/fout/stilte) armt hij na deze tijd opnieuw.
const VOICE_SCROLLER_RECOVERY_DELAY_MS = 700;

export const useVoiceSideScrollerWordRecognition = ({
  isRunning,
  onWordMissed,
  onWordMatched,
  visibleTargets,
}: UseVoiceSideScrollerWordRecognitionOptions): VoiceSideScrollerWordRecognitionController => {
  const {
    alternatives,
    confidence,
    errorMessage,
    isFinal,
    resetTranscript,
    resultId,
    startListening,
    status,
    stopListening,
    supportMessage,
    transcript,
  } = useDutchSpeechRecognition({
    autoStopMs: 0,
    continuous: true,
    interimResults: true,
    // Eén doorlopende sessie: we lezen alleen het laatst gewijzigde segment, zodat
    // eerder benoemde woorden niet blijven opstapelen. Daardoor hoeft de mic NIET
    // na elke match herstart te worden — die snelle herstart-cyclus liet de
    // browser-spraakherkenning na een paar objecten vastlopen (DT-02 / T-48).
    latestSegmentOnly: true,
    maxAlternatives: 8,
    restartOnEnd: true,
  });
  const visibleTargetsRef = useRef<VoiceSideScrollerTarget[]>(visibleTargets);
  const confidenceRef = useRef<number | undefined>(confidence);
  const lastProcessedResultIdRef = useRef(0);
  // Kort geheugen van recent gehoorde woorden, zodat een plaatje dat net het
  // herkenningsvenster in scrolt alsnog gepakt wordt als het kind het woord
  // kort daarvoor zei (kernfix van de "terugkerend plaatje wordt niet meer
  // opgepakt"-bug — T-32).
  const recentHeardRef = useRef<HeardWordMemoryEntry[]>([]);
  const [wordRecognition, setWordRecognition] = useState<VoiceSideScrollerWordRecognitionState>(
    () => createIdleWordRecognitionState(),
  );

  confidenceRef.current = confidence;

  useEffect(() => {
    visibleTargetsRef.current = visibleTargets;
  }, [visibleTargets]);

  const stopWordRecognition = useCallback(() => {
    stopListening();
    recentHeardRef.current = [];
    setWordRecognition(createIdleWordRecognitionState(supportMessage));
  }, [stopListening, supportMessage]);

  const startWordPrompt = useCallback(() => {
    resetTranscript();
    lastProcessedResultIdRef.current = 0;
    recentHeardRef.current = [];

    setWordRecognition({
      feedbackText: getListeningFeedbackText(),
      isListening: true,
      status: "listening",
      supportMessage,
    });

    return startListening();
  }, [resetTranscript, startListening, supportMessage]);

  const rememberHeardWords = useCallback((candidates: string[]) => {
    const now = Date.now();
    const stillFresh = recentHeardRef.current.filter(
      (entry) => now - entry.atMs <= VOICE_SCROLLER_HEARD_MEMORY_MS,
    );

    for (const candidate of candidates) {
      stillFresh.push({ atMs: now, token: candidate });
    }

    recentHeardRef.current = stillFresh;
  }, []);

  // Probeer een zichtbaar, nog niet gepakt plaatje te matchen met een recent
  // gehoord woord. Dit draait zowel bij een nieuw spraakresultaat als wanneer er
  // een nieuw plaatje in beeld scrolt, zodat "goed gezegd" altijd oppakt. De
  // luister-sessie blijft daarbij gewoon doorlopen (geen herstart per match).
  const tryCollectRememberedWord = useCallback(() => {
    if (!isRunning) {
      return false;
    }

    const now = Date.now();
    const freshHeard = recentHeardRef.current.filter(
      (entry) => now - entry.atMs <= VOICE_SCROLLER_HEARD_MEMORY_MS,
    );
    recentHeardRef.current = freshHeard;

    if (freshHeard.length === 0) {
      return false;
    }

    for (const target of visibleTargetsRef.current) {
      const heardMatch = freshHeard.find(
        (entry) =>
          matchVoiceSideScrollerWord({ targetWord: target.word, transcript: entry.token }).isMatch,
      );

      if (!heardMatch) {
        continue;
      }

      const matchResult = matchVoiceSideScrollerWord({
        targetWord: target.word,
        transcript: heardMatch.token,
      });

      setWordRecognition({
        confidence: confidenceRef.current,
        feedbackText: `Goed gehoord: ${target.word}. +1 Tempo!`,
        isListening: true,
        lastHeard: heardMatch.token,
        matchedAlias: matchResult.matchedAlias,
        status: "matched",
        supportMessage,
        targetWord: target.word,
      });
      // Verbruik het gebruikte woord zodat hetzelfde "bal" niet per ongeluk twee
      // plaatjes tegelijk pakt.
      recentHeardRef.current = recentHeardRef.current.filter((entry) => entry !== heardMatch);
      onWordMatched(target, heardMatch.token);
      return true;
    }

    return false;
  }, [isRunning, onWordMatched, supportMessage]);

  useEffect(() => {
    if (!isRunning) {
      stopWordRecognition();
      return;
    }

    startWordPrompt();
  }, [isRunning, startWordPrompt, stopWordRecognition]);

  // Verwerk een nieuw spraakresultaat: onthoud de gehoorde woorden, probeer een
  // zichtbaar plaatje te pakken en tel anders (bij een afgeronde zin) een zachte
  // "nog oefenen"-poging. Dankzij `latestSegmentOnly` bevat het resultaat alleen
  // het net gezegde woord, dus eerdere woorden komen niet opnieuw voorbij.
  useEffect(() => {
    if (!isRunning || resultId === 0) {
      return;
    }

    const rawCandidates = getTranscriptCandidates(transcript, alternatives);

    if (rawCandidates.length === 0 || lastProcessedResultIdRef.current === resultId) {
      return;
    }

    lastProcessedResultIdRef.current = resultId;

    // Vriendelijke bescherming: ongewenste woorden worden uit de kandidaten
    // gefilterd (een gemengde uiting als "stomme bal" pakt "bal" dus tóch op),
    // en als er alleen iets ongewensts klonk tonen we een zachte nudge (T-28).
    const { clean: transcriptCandidates, hadUnwanted } = filterUnwantedCandidates(rawCandidates);
    rememberHeardWords(transcriptCandidates);

    if (tryCollectRememberedWord()) {
      return;
    }

    if (!isFinal) {
      return;
    }

    if (hadUnwanted) {
      setWordRecognition({
        feedbackText: UNWANTED_WORD_NUDGE,
        isListening: true,
        status: "missed",
        supportMessage,
      });
      return;
    }

    const practiceTarget = visibleTargetsRef.current[0];
    const heardText = transcriptCandidates[0];

    if (!heardText) {
      return;
    }

    setWordRecognition({
      confidence,
      feedbackText: `Ik hoorde "${heardText}". Noem een plaatje in beeld.`,
      isListening: true,
      lastHeard: heardText,
      status: "missed",
      supportMessage,
      targetWord: practiceTarget?.word,
    });
    onWordMissed(practiceTarget, heardText);
  }, [
    alternatives,
    confidence,
    isFinal,
    isRunning,
    onWordMissed,
    rememberHeardWords,
    resultId,
    supportMessage,
    transcript,
    tryCollectRememberedWord,
  ]);

  // Wanneer de zichtbare plaatjes veranderen (een nieuw of teruggekeerd plaatje
  // scrolt in beeld) checken we het geheugen opnieuw. Zo pakt een net verschenen
  // plaatje alsnog het kort daarvoor gezegde woord op — de kern van de fix.
  const visibleTargetSignature = visibleTargets.map((target) => target.id).join("|");

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    tryCollectRememberedWord();
  }, [isRunning, tryCollectRememberedWord, visibleTargetSignature]);

  useEffect(() => {
    if (
      !isRunning ||
      (wordRecognition.status !== "matched" && wordRecognition.status !== "missed")
    ) {
      return undefined;
    }

    const feedbackTimer = window.setTimeout(() => {
      setWordRecognition((currentState) => {
        if (currentState.status !== "matched" && currentState.status !== "missed") {
          return currentState;
        }

        return {
          ...currentState,
          feedbackText: getListeningFeedbackText(),
          isListening: true,
          status: "listening",
        };
      });
    }, VOICE_SCROLLER_FEEDBACK_VISIBLE_MS);

    return () => {
      window.clearTimeout(feedbackTimer);
    };
  }, [isRunning, wordRecognition.status]);

  // Robuuste herstel-watchdog (DT-02). Zolang de ronde loopt hoort de mic altijd
  // te luisteren. Valt de herkenning uit die staat — door een fout óf doordat de
  // mobiele spraakservice de sessie stil afkapt (`onend` → idle/heard, geen
  // error) — dan armen we na een korte debounce opnieuw. Dit voorkomt dat het
  // spel "dood" blijft nadat de speler al een paar objecten heeft benoemd.
  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const isActivelyListening = status === "listening" || status === "processing";
    const isShowingFeedback =
      wordRecognition.status === "matched" || wordRecognition.status === "missed";
    const isBlocked = status === "unsupported" || getHasBlockingSpeechError(errorMessage);

    if (isActivelyListening || isShowingFeedback || isBlocked) {
      return undefined;
    }

    // status is hier idle/heard/error terwijl de ronde loopt → opnieuw luisteren.
    const recoverTimer = window.setTimeout(() => {
      if (isRunning) {
        startWordPrompt();
      }
    }, VOICE_SCROLLER_RECOVERY_DELAY_MS);

    return () => {
      window.clearTimeout(recoverTimer);
    };
  }, [errorMessage, isRunning, startWordPrompt, status, wordRecognition.status]);

  useEffect(() => {
    if (status === "unsupported") {
      setWordRecognition((currentState) => ({
        ...currentState,
        errorMessage,
        feedbackText: errorMessage ?? supportMessage,
        isListening: false,
        status: "unsupported",
        supportMessage,
      }));
      return;
    }

    if (status === "error") {
      setWordRecognition((currentState) => ({
        ...currentState,
        errorMessage,
        feedbackText: errorMessage ?? "Probeer nog eens rustig een plaatje te noemen.",
        isListening: false,
        status: "error",
        supportMessage,
      }));
      return;
    }

    if (status !== "listening" && status !== "processing") {
      return;
    }

    setWordRecognition((currentState) => {
      if (currentState.status === "matched" || currentState.status === "missed") {
        return currentState;
      }

      return {
        ...currentState,
        feedbackText: getSpeechStatusFeedback(status),
        isListening: status === "listening",
        status: status === "listening" ? "listening" : currentState.status,
        supportMessage,
      };
    });
  }, [errorMessage, status, supportMessage]);

  return {
    wordRecognition,
  };
};
