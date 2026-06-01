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
  maxAlternatives?: number;
}

interface UseDutchSpeechRecognitionState {
  alternatives: VoiceRecognitionAlternative[];
  confidence?: number;
  errorMessage?: string;
  isListening: boolean;
  resetTranscript: () => void;
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
  maxAlternatives = 3,
}: UseDutchSpeechRecognitionOptions = {}): UseDutchSpeechRecognitionState => {
  const [support, setSupport] = useState<SpeechRecognitionSupport>(() =>
    getSpeechRecognitionSupport(),
  );
  const [status, setStatus] = useState<VoiceRecognitionStatus>(() =>
    getInitialSpeechStatus(getSpeechRecognitionSupport()),
  );
  const [transcript, setTranscript] = useState<string>();
  const [confidence, setConfidence] = useState<number>();
  const [alternatives, setAlternatives] = useState<VoiceRecognitionAlternative[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const sessionRef = useRef<DutchSpeechRecognitionSession | null>(null);

  useEffect(() => {
    const nextSupport = getSpeechRecognitionSupport();
    setSupport(nextSupport);
    setStatus((currentStatus) =>
      currentStatus === "unsupported" || currentStatus === "idle"
        ? getInitialSpeechStatus(nextSupport)
        : currentStatus,
    );

    return () => {
      sessionRef.current?.destroy();
      sessionRef.current = null;
    };
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript(undefined);
    setConfidence(undefined);
    setAlternatives([]);
    setErrorMessage(undefined);
    setStatus(getInitialSpeechStatus(getSpeechRecognitionSupport()));
  }, []);

  const handleResult = useCallback((result: VoiceRecognitionResult) => {
    setTranscript(result.transcript);
    setConfidence(result.confidence);
    setAlternatives(result.alternatives);
    setErrorMessage(undefined);
    setStatus("heard");
  }, []);

  const handleError = useCallback((errorCode: VoiceRecognitionErrorCode, message: string) => {
    setErrorMessage(getSpeechRecognitionErrorMessage(errorCode, message));
    setStatus("error");
  }, []);

  const handleNoMatch = useCallback(() => {
    setErrorMessage("Ik kon de zin niet goed horen. Probeer het nog eens rustig.");
    setStatus("error");
  }, []);

  const stopListening = useCallback(() => {
    sessionRef.current?.stop();
    setStatus((currentStatus) => (currentStatus === "listening" ? "processing" : currentStatus));
  }, []);

  const startListening = useCallback(() => {
    const nextSupport = getSpeechRecognitionSupport();
    setSupport(nextSupport);

    if (!nextSupport.isSupported) {
      setStatus("unsupported");
      setErrorMessage(getSpeechRecognitionSupportMessage(nextSupport));
      return false;
    }

    sessionRef.current?.destroy();
    setTranscript(undefined);
    setConfidence(undefined);
    setAlternatives([]);
    setErrorMessage(undefined);
    setStatus("processing");

    const session = createDutchSpeechRecognition({
      autoStopMs,
      maxAlternatives,
      onError: handleError,
      onNoMatch: handleNoMatch,
      onResult: handleResult,
      onStatusChange: setStatus,
    });

    sessionRef.current = session;

    if (!session) {
      setStatus("unsupported");
      setErrorMessage(getSpeechRecognitionSupportMessage(nextSupport));
      return false;
    }

    return session.start();
  }, [autoStopMs, handleError, handleNoMatch, handleResult, maxAlternatives]);

  return {
    alternatives,
    confidence,
    errorMessage,
    isListening: status === "listening",
    resetTranscript,
    startListening,
    status,
    stopListening,
    support,
    supportMessage: getSpeechRecognitionSupportMessage(support),
    transcript,
  };
};

