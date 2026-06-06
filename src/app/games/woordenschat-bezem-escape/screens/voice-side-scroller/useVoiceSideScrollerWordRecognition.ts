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

export const useVoiceSideScrollerWordRecognition = ({
  isRunning,
  onWordMissed,
  onWordMatched,
  onWordPromptRepeated,
  visibleTargets,
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
  const visibleTargetsRef = useRef<VoiceSideScrollerTarget[]>(visibleTargets);
  const lastProcessedResultRef = useRef("");
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
    lastProcessedResultRef.current = "";

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
    if (!isRunning || !transcript) {
      return;
    }

    const visibleTargetsSnapshot = visibleTargetsRef.current;
    const resultKey = transcript;

    if (lastProcessedResultRef.current === resultKey) {
      return;
    }

    lastProcessedResultRef.current = resultKey;

    const matchedItem = visibleTargetsSnapshot
      .map((target) => ({
        matchResult: matchVoiceSideScrollerWord({
          targetWord: target.word,
          transcript,
        }),
        target,
      }))
      .find((item) => item.matchResult.isMatch);

    if (matchedItem) {
      setWordRecognition({
        confidence,
        feedbackText: `Goed gehoord: ${matchedItem.target.word}. +1 Speed!`,
        isListening: false,
        lastHeard: transcript,
        matchedAlias: matchedItem.matchResult.matchedAlias,
        status: "matched",
        supportMessage,
        targetWord: matchedItem.target.word,
      });
      onWordMatched(matchedItem.target, transcript);
      return;
    }

    const practiceTarget = visibleTargetsSnapshot[0];

    setWordRecognition({
      confidence,
      feedbackText: `Ik hoorde "${transcript}". Noem een plaatje in beeld.`,
      isListening: false,
      lastHeard: transcript,
      status: "missed",
      supportMessage,
      targetWord: practiceTarget?.word,
    });
    onWordMissed(practiceTarget, transcript);
  }, [confidence, isRunning, onWordMatched, onWordMissed, supportMessage, transcript]);

  useEffect(() => {
    if (!isRunning || (wordRecognition.status !== "matched" && wordRecognition.status !== "missed")) {
      return undefined;
    }

    const restartTimer = window.setTimeout(() => {
      startWordPrompt(false);
    }, 550);

    return () => {
      window.clearTimeout(restartTimer);
    };
  }, [isRunning, startWordPrompt, wordRecognition.status]);

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
