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
  stopWordRecognition: () => void;
  wordRecognition: VoiceSideScrollerWordRecognitionState;
}

interface UseVoiceSideScrollerWordRecognitionOptions {
  activeTarget?: VoiceSideScrollerTarget;
  isRunning: boolean;
  onWordMatched: (target: VoiceSideScrollerTarget, transcript: string) => void;
}

const createIdleWordRecognitionState = (
  supportMessage = "Zeg het woord wanneer het plaatje komt.",
): VoiceSideScrollerWordRecognitionState => ({
  feedbackText: "Zeg het woord wanneer het plaatje komt.",
  isListening: false,
  status: "idle",
  supportMessage,
});

const getListeningFeedbackText = (targetWord?: string) =>
  targetWord ? `Luister nu: zeg ${targetWord}.` : "Luister nu.";

const getSpeechStatusFeedback = (
  speechStatus: VoiceRecognitionStatus,
  targetWord?: string,
) => {
  if (speechStatus === "listening") {
    return getListeningFeedbackText(targetWord);
  }

  if (speechStatus === "processing") {
    return "Ik luister mee...";
  }

  return targetWord ? `Zeg rustig: ${targetWord}.` : "Zeg het woord.";
};

export const useVoiceSideScrollerWordRecognition = ({
  activeTarget,
  isRunning,
  onWordMatched,
}: UseVoiceSideScrollerWordRecognitionOptions): VoiceSideScrollerWordRecognitionController => {
  const {
    confidence,
    errorMessage,
    resetTranscript,
    startListening,
    status,
    stopListening,
    supportMessage,
    transcript,
  } = useDutchSpeechRecognition({ autoStopMs: 4_500, maxAlternatives: 4 });
  const activeTargetRef = useRef<VoiceSideScrollerTarget | undefined>(activeTarget);
  const lastProcessedResultRef = useRef("");
  const lastStartedTargetIdRef = useRef<string>();
  const [wordRecognition, setWordRecognition] = useState<VoiceSideScrollerWordRecognitionState>(
    () => createIdleWordRecognitionState(),
  );

  useEffect(() => {
    activeTargetRef.current = activeTarget;
  }, [activeTarget]);

  const stopWordRecognition = useCallback(() => {
    stopListening();
    lastStartedTargetIdRef.current = undefined;
    setWordRecognition(createIdleWordRecognitionState(supportMessage));
  }, [stopListening, supportMessage]);

  const repeatWordPrompt = useCallback(() => {
    const target = activeTargetRef.current;

    if (!target) {
      setWordRecognition({
        ...createIdleWordRecognitionState(supportMessage),
        feedbackText: "Er is nu geen woord om te zeggen.",
      });
      return false;
    }

    resetTranscript();
    lastProcessedResultRef.current = "";
    lastStartedTargetIdRef.current = target.id;

    setWordRecognition({
      feedbackText: getListeningFeedbackText(target.word),
      isListening: true,
      status: "listening",
      supportMessage,
      targetWord: target.word,
    });

    return startListening();
  }, [resetTranscript, startListening, supportMessage]);

  useEffect(() => {
    if (!isRunning) {
      stopWordRecognition();
      return;
    }

    if (!activeTarget || activeTarget.collected) {
      return;
    }

    if (lastStartedTargetIdRef.current === activeTarget.id) {
      return;
    }

    repeatWordPrompt();
  }, [activeTarget?.collected, activeTarget?.id, isRunning, repeatWordPrompt, stopWordRecognition]);

  useEffect(() => {
    const target = activeTargetRef.current;

    if (!isRunning || !target || !transcript) {
      return;
    }

    const resultKey = `${target.id}:${transcript}`;

    if (lastProcessedResultRef.current === resultKey) {
      return;
    }

    lastProcessedResultRef.current = resultKey;

    const matchResult = matchVoiceSideScrollerWord({
      targetWord: target.word,
      transcript,
    });

    if (matchResult.isMatch) {
      setWordRecognition({
        confidence,
        feedbackText: `Goed gehoord: ${target.word}. +1 Speed!`,
        isListening: false,
        lastHeard: transcript,
        matchedAlias: matchResult.matchedAlias,
        status: "matched",
        supportMessage,
        targetWord: target.word,
      });
      onWordMatched(target, transcript);
      return;
    }

    setWordRecognition({
      confidence,
      feedbackText: `Bijna. Ik hoorde "${transcript}". Zeg rustig: ${target.word}.`,
      isListening: false,
      lastHeard: transcript,
      status: "missed",
      supportMessage,
      targetWord: target.word,
    });
  }, [confidence, isRunning, onWordMatched, supportMessage, transcript]);

  useEffect(() => {
    const targetWord = activeTargetRef.current?.word;

    if (status === "unsupported") {
      setWordRecognition((currentState) => ({
        ...currentState,
        errorMessage,
        feedbackText: errorMessage ?? supportMessage,
        isListening: false,
        status: "unsupported",
        supportMessage,
        targetWord,
      }));
      return;
    }

    if (status === "error") {
      setWordRecognition((currentState) => ({
        ...currentState,
        errorMessage,
        feedbackText: errorMessage ?? `Probeer nog eens rustig: ${targetWord ?? "het woord"}.`,
        isListening: false,
        status: "error",
        supportMessage,
        targetWord,
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
        feedbackText: getSpeechStatusFeedback(status, targetWord),
        isListening: status === "listening",
        status: status === "listening" ? "listening" : currentState.status,
        supportMessage,
        targetWord,
      };
    });
  }, [errorMessage, status, supportMessage]);

  return {
    repeatWordPrompt,
    stopWordRecognition,
    wordRecognition,
  };
};
