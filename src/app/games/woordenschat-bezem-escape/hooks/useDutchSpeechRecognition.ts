import { useCallback, useEffect, useRef, useState } from "react";
import {
  createDutchSpeechRecognition,
  getSpeechRecognitionErrorMessage,
  getSpeechRecognitionSupport,
  getSpeechRecognitionSupportMessage,
  type DutchSpeechRecognitionSession,
  type SpeechRecognitionSupport,
  type VoiceRecognitionAlternative,
  type VoiceRecognitionErrorCode,
  type VoiceRecognitionResult,
  type VoiceRecognitionStatus,
} from "../logic/speech-recognition";

interface UseDutchSpeechRecognitionOptions {
  autoStopMs?: number;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  restartOnEnd?: boolean;
}

interface UseDutchSpeechRecognitionState {
  alternatives: VoiceRecognitionAlternative[];
  confidence?: number;
  errorMessage?: string;
  isFinal?: boolean;
  isListening: boolean;
  resetTranscript: () => void;
  resultId: number;
  startListening: () => boolean;
  status: VoiceRecognitionStatus;
  stopListening: () => void;
  support: SpeechRecognitionSupport;
  supportMessage: string;
  transcript?: string;
}

const getInitialSpeechStatus = (support: SpeechRecognitionSupport): VoiceRecognitionStatus =>
  support.isSupported ? "idle" : "unsupported";

export const useDutchSpeechRecognition = ({
  autoStopMs = 7000,
  continuous = false,
  interimResults = false,
  maxAlternatives = 3,
  restartOnEnd = false,
}: UseDutchSpeechRecognitionOptions = {}): UseDutchSpeechRecognitionState => {
  const [support, setSupport] = useState<SpeechRecognitionSupport>(() =>
    getSpeechRecognitionSupport(),
  );
  const [status, setStatus] = useState<VoiceRecognitionStatus>(() =>
    getInitialSpeechStatus(getSpeechRecognitionSupport()),
  );
  const [transcript, setTranscript] = useState<string>();
  const [confidence, setConfidence] = useState<number>();
  const [isFinal, setIsFinal] = useState<boolean>();
  const [resultId, setResultId] = useState(0);
  const [alternatives, setAlternatives] = useState<VoiceRecognitionAlternative[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const sessionRef = useRef<DutchSpeechRecognitionSession | null>(null);
  const lastErrorCodeRef = useRef<VoiceRecognitionErrorCode>();
  const restartTimerRef = useRef<number>();
  const shouldRestartRef = useRef(false);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current !== undefined) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    const nextSupport = getSpeechRecognitionSupport();
    setSupport(nextSupport);
    setStatus((currentStatus) =>
      currentStatus === "unsupported" || currentStatus === "idle"
        ? getInitialSpeechStatus(nextSupport)
        : currentStatus,
    );

    return () => {
      shouldRestartRef.current = false;
      clearRestartTimer();
      sessionRef.current?.destroy();
      sessionRef.current = null;
    };
  }, [clearRestartTimer]);

  const resetTranscript = useCallback(() => {
    setTranscript(undefined);
    setConfidence(undefined);
    setIsFinal(undefined);
    setAlternatives([]);
    setErrorMessage(undefined);
    setStatus(getInitialSpeechStatus(getSpeechRecognitionSupport()));
  }, []);

  const handleResult = useCallback((result: VoiceRecognitionResult) => {
    lastErrorCodeRef.current = undefined;
    setTranscript(result.transcript);
    setConfidence(result.confidence);
    setIsFinal(result.isFinal);
    setResultId((currentResultId) => currentResultId + 1);
    setAlternatives(result.alternatives);
    setErrorMessage(undefined);
    setStatus(continuous ? "listening" : "heard");
  }, [continuous]);

  const handleError = useCallback((errorCode: VoiceRecognitionErrorCode, message: string) => {
    lastErrorCodeRef.current = errorCode;
    setErrorMessage(getSpeechRecognitionErrorMessage(errorCode, message));
    setStatus("error");
  }, []);

  const handleNoMatch = useCallback(() => {
    setErrorMessage("Ik kon de zin niet goed horen. Probeer het nog eens rustig.");
    setStatus("error");
  }, []);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    clearRestartTimer();
    sessionRef.current?.stop();
    setStatus((currentStatus) => (currentStatus === "listening" ? "processing" : currentStatus));
  }, [clearRestartTimer]);

  const startListening = useCallback(() => {
    const nextSupport = getSpeechRecognitionSupport();
    setSupport(nextSupport);

    if (!nextSupport.isSupported) {
      setStatus("unsupported");
      setErrorMessage(getSpeechRecognitionSupportMessage(nextSupport));
      return false;
    }

    shouldRestartRef.current = false;
    clearRestartTimer();
    sessionRef.current?.destroy();
    setTranscript(undefined);
    setConfidence(undefined);
    setIsFinal(undefined);
    setAlternatives([]);
    setErrorMessage(undefined);
    lastErrorCodeRef.current = undefined;
    setStatus("processing");
    shouldRestartRef.current = restartOnEnd;

    const session = createDutchSpeechRecognition({
      autoStopMs,
      continuous,
      interimResults,
      maxAlternatives,
      onEnd: () => {
        const shouldBlockRestart =
          lastErrorCodeRef.current === "audio-capture" ||
          lastErrorCodeRef.current === "not-allowed" ||
          lastErrorCodeRef.current === "service-not-allowed";

        if (!shouldRestartRef.current || shouldBlockRestart) {
          setStatus((currentStatus) =>
            currentStatus === "listening" || currentStatus === "processing"
              ? "idle"
              : currentStatus,
          );
          return;
        }

        restartTimerRef.current = window.setTimeout(() => {
          sessionRef.current?.start();
        }, 120);
      },
      onError: handleError,
      onNoMatch: handleNoMatch,
      onResult: handleResult,
      onStatusChange: setStatus,
    });

    sessionRef.current = session;

    if (!session) {
      shouldRestartRef.current = false;
      setStatus("unsupported");
      setErrorMessage(getSpeechRecognitionSupportMessage(nextSupport));
      return false;
    }

    return session.start();
  }, [
    autoStopMs,
    clearRestartTimer,
    continuous,
    handleError,
    handleNoMatch,
    handleResult,
    interimResults,
    maxAlternatives,
    restartOnEnd,
  ]);

  return {
    alternatives,
    confidence,
    errorMessage,
    isFinal,
    isListening: status === "listening",
    resetTranscript,
    resultId,
    startListening,
    status,
    stopListening,
    support,
    supportMessage: getSpeechRecognitionSupportMessage(support),
    transcript,
  };
};
