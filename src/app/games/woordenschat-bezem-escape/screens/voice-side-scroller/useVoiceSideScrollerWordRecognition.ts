import { useCallback, useEffect, useRef, useState } from "react";
import { useDutchSpeechRecognition } from "../../hooks/useDutchSpeechRecognition";
import type { VoiceRecognitionStatus } from "../../logic/speech-recognition";
import type { VoiceSideScrollerTarget } from "./voiceSideScrollerModel";
import { matchVoiceSideScrollerWord } from "./voiceSideScrollerWords";

export type VoiceSideScrollerWordRecognitionStatus =
  | "idle"
  | "listening"
  | "matched"
  | "missed"
  | "unsupported"
  | "error";

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
  repeatWordPrompt: () => boolean;
  startWordPrompt: () => boolean;
  stopWordRecognition: () => void;
  wordRecognition: VoiceSideScrollerWordRecognitionState;
}

interface UseVoiceSideScrollerWordRecognitionOptions {
  isRunning: boolean;
  onWordMissed: (target: VoiceSideScrollerTarget | undefined, transcript: string) => void;
  onWordMatched: (target: VoiceSideScrollerTarget, transcript: string) => void;
  onWordPromptRepeated: (target: VoiceSideScrollerTarget | undefined) => void;
  visibleTargets: VoiceSideScrollerTarget[];
}

const createIdleWordRecognitionState = (
  supportMessage = "Noem een plaatje wanneer het in beeld komt.",
): VoiceSideScrollerWordRecognitionState => ({
  feedbackText: "Noem een plaatje wanneer het in beeld komt.",
  isListening: false,
  status: "idle",
  supportMessage,
});

const getListeningFeedbackText = () =>
  "Noem een plaatje dat je ziet.";

const getSpeechStatusFeedback = (
  speechStatus: VoiceRecognitionStatus,
) => {
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
) => [
  transcript,
  ...alternatives.map((alternative) => alternative.transcript),
]
  .filter((candidate): candidate is string => Boolean(candidate?.trim()))
  .map((candidate) => candidate.trim());

const getHasBlockingSpeechError = (errorMessage: string | undefined) =>
  Boolean(errorMessage?.includes("microfoon") || errorMessage?.includes("toestemming"));

export const useVoiceSideScrollerWordRecognition = ({
  isRunning,
  onWordMissed,
  onWordMatched,
  onWordPromptRepeated,
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
    maxAlternatives: 8,
    restartOnEnd: true,
  });
  const visibleTargetsRef = useRef<VoiceSideScrollerTarget[]>(visibleTargets);
  const lastProcessedResultIdRef = useRef(0);
  const [wordRecognition, setWordRecognition] = useState<VoiceSideScrollerWordRecognitionState>(
    () => createIdleWordRecognitionState(),
  );

  useEffect(() => {
    visibleTargetsRef.current = visibleTargets;
  }, [visibleTargets]);

  const stopWordRecognition = useCallback(() => {
    stopListening();
    setWordRecognition(createIdleWordRecognitionState(supportMessage));
  }, [stopListening, supportMessage]);

  const startWordPrompt = useCallback((isManualRepeat = false) => {
    resetTranscript();
    lastProcessedResultIdRef.current = 0;

    if (isManualRepeat) {
      onWordPromptRepeated(visibleTargetsRef.current[0]);
    }

    setWordRecognition({
      feedbackText: getListeningFeedbackText(),
      isListening: true,
      status: "listening",
      supportMessage,
    });

    return startListening();
  }, [onWordPromptRepeated, resetTranscript, startListening, supportMessage]);

  const repeatWordPrompt = useCallback(() => startWordPrompt(true), [startWordPrompt]);

  useEffect(() => {
    if (!isRunning) {
      stopWordRecognition();
      return;
    }

    startWordPrompt(false);
  }, [isRunning, startWordPrompt, stopWordRecognition]);

  useEffect(() => {
    if (!isRunning || resultId === 0) {
      return;
    }

    const visibleTargetsSnapshot = visibleTargetsRef.current;
    const transcriptCandidates = getTranscriptCandidates(transcript, alternatives);

    if (transcriptCandidates.length === 0 || lastProcessedResultIdRef.current === resultId) {
      return;
    }

    lastProcessedResultIdRef.current = resultId;

    const matchedItem = visibleTargetsSnapshot
      .flatMap((target) =>
        transcriptCandidates.map((candidate) => ({
          matchResult: matchVoiceSideScrollerWord({
            targetWord: target.word,
            transcript: candidate,
          }),
          target,
          transcript: candidate,
        })),
      )
      .find((item) => item.matchResult.isMatch);

    if (matchedItem) {
      setWordRecognition({
        confidence,
        feedbackText: `Goed gehoord: ${matchedItem.target.word}. +1 Speed!`,
        isListening: true,
        lastHeard: matchedItem.transcript,
        matchedAlias: matchedItem.matchResult.matchedAlias,
        status: "matched",
        supportMessage,
        targetWord: matchedItem.target.word,
      });
      onWordMatched(matchedItem.target, matchedItem.transcript);
      return;
    }

    if (!isFinal) {
      return;
    }

    const practiceTarget = visibleTargetsSnapshot[0];
    const heardText = transcriptCandidates[0];

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
    onWordMatched,
    onWordMissed,
    resultId,
    supportMessage,
    transcript,
  ]);

  useEffect(() => {
    if (!isRunning || (wordRecognition.status !== "matched" && wordRecognition.status !== "missed")) {
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
    }, 550);

    return () => {
      window.clearTimeout(feedbackTimer);
    };
  }, [isRunning, wordRecognition.status]);

  useEffect(() => {
    if (!isRunning || status !== "error" || getHasBlockingSpeechError(errorMessage)) {
      return undefined;
    }

    const recoverTimer = window.setTimeout(() => {
      startWordPrompt(false);
    }, 900);

    return () => {
      window.clearTimeout(recoverTimer);
    };
  }, [errorMessage, isRunning, startWordPrompt, status]);

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
    repeatWordPrompt,
    startWordPrompt,
    stopWordRecognition,
    wordRecognition,
  };
};
