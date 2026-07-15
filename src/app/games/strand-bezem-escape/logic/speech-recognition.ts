export const DUTCH_SPEECH_RECOGNITION_LANGUAGE = "nl-NL";

export type VoiceRecognitionStatus =
  | "idle"
  | "listening"
  | "processing"
  | "heard"
  | "unsupported"
  | "error";

export type VoiceRecognitionConfidence = "high" | "medium" | "low";

export type VoiceRecognitionErrorCode =
  | "aborted"
  | "audio-capture"
  | "bad-grammar"
  | "language-not-supported"
  | "network"
  | "no-speech"
  | "not-allowed"
  | "service-not-allowed"
  | "unknown";

export interface VoiceRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface VoiceRecognitionResult {
  alternatives: VoiceRecognitionAlternative[];
  confidence: number;
  confidenceLabel: VoiceRecognitionConfidence;
  isFinal: boolean;
  transcript: string;
}

export interface SpeechRecognitionSupport {
  isSecureContext: boolean;
  isSupported: boolean;
  needsSecureContext: boolean;
  reason?: "ssr" | "api-missing" | "insecure-context";
}

interface BrowserSpeechRecognitionAlternative {
  confidence: number;
  transcript: string;
}

interface BrowserSpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: BrowserSpeechRecognitionAlternative;
}

interface BrowserSpeechRecognitionResultList {
  readonly length: number;
  [index: number]: BrowserSpeechRecognitionResult;
}

interface BrowserSpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: BrowserSpeechRecognitionResultList;
}

interface BrowserSpeechRecognitionErrorEvent extends Event {
  readonly error?: VoiceRecognitionErrorCode;
  readonly message?: string;
}

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onend: (() => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onnomatch: (() => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onspeechend: (() => void) | null;
  onstart: (() => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
}

interface BrowserSpeechRecognitionConstructor {
  new (): BrowserSpeechRecognition;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: BrowserSpeechRecognitionConstructor;
  webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
}

interface CreateDutchSpeechRecognitionOptions {
  autoStopMs?: number;
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
  onEnd?: () => void;
  onError?: (errorCode: VoiceRecognitionErrorCode, message: string) => void;
  onNoMatch?: () => void;
  onResult?: (result: VoiceRecognitionResult) => void;
  onStatusChange?: (status: VoiceRecognitionStatus) => void;
}

export interface DutchSpeechRecognitionSession {
  abort: () => void;
  destroy: () => void;
  start: () => boolean;
  stop: () => void;
}

const getSpeechRecognitionWindow = (): SpeechRecognitionWindow | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window as SpeechRecognitionWindow;
};

export const getSpeechRecognitionConstructor = (): BrowserSpeechRecognitionConstructor | null => {
  const speechWindow = getSpeechRecognitionWindow();

  if (!speechWindow) {
    return null;
  }

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
};

export const getSpeechRecognitionSupport = (): SpeechRecognitionSupport => {
  const speechWindow = getSpeechRecognitionWindow();

  if (!speechWindow) {
    return {
      isSecureContext: false,
      isSupported: false,
      needsSecureContext: false,
      reason: "ssr",
    };
  }

  const isSecureContext = speechWindow.isSecureContext;
  const hasSpeechApi = Boolean(getSpeechRecognitionConstructor());

  if (!isSecureContext) {
    return {
      isSecureContext,
      isSupported: false,
      needsSecureContext: true,
      reason: "insecure-context",
    };
  }

  if (!hasSpeechApi) {
    return {
      isSecureContext,
      isSupported: false,
      needsSecureContext: false,
      reason: "api-missing",
    };
  }

  return {
    isSecureContext,
    isSupported: true,
    needsSecureContext: false,
  };
};

export const getSpeechRecognitionSupportMessage = (support: SpeechRecognitionSupport) => {
  if (support.isSupported) {
    return "Spraakherkenning is beschikbaar.";
  }

  if (support.reason === "insecure-context") {
    return "Spraak werkt op mobiel meestal alleen via HTTPS of localhost.";
  }

  if (support.reason === "api-missing") {
    return "Deze browser ondersteunt spraakherkenning niet. Gebruik de fallback of probeer Chrome.";
  }

  return "Spraakherkenning is hier niet beschikbaar.";
};

export const getSpeechRecognitionErrorMessage = (
  errorCode: VoiceRecognitionErrorCode,
  fallbackMessage = "",
) => {
  if (errorCode === "no-speech") {
    return "Ik hoorde nog geen zin. Probeer het nog eens rustig.";
  }

  if (errorCode === "not-allowed" || errorCode === "service-not-allowed") {
    return "De microfoon mag nog niet gebruikt worden. Controleer de toestemming.";
  }

  if (errorCode === "audio-capture") {
    return "Ik kan de microfoon niet vinden. Controleer de microfoon van dit apparaat.";
  }

  if (errorCode === "network") {
    return "Spraakherkenning heeft nu geen verbinding. Probeer het later opnieuw.";
  }

  if (errorCode === "language-not-supported") {
    return "Nederlandse spraakherkenning wordt in deze browser niet ondersteund.";
  }

  if (errorCode === "aborted") {
    return "Luisteren is gestopt.";
  }

  return fallbackMessage || "Ik kon de zin niet goed verwerken. Probeer het nog eens.";
};

const getConfidenceLabel = (confidence: number): VoiceRecognitionConfidence => {
  if (confidence >= 0.75) {
    return "high";
  }

  if (confidence >= 0.45) {
    return "medium";
  }

  return "low";
};

const readRecognitionAlternatives = (
  speechResult: BrowserSpeechRecognitionResult,
): VoiceRecognitionAlternative[] =>
  Array.from({ length: speechResult.length }, (_, index) => {
    const alternative = speechResult[index];

    return {
      confidence: alternative.confidence,
      transcript: alternative.transcript.trim(),
    };
  }).filter((alternative) => alternative.transcript.length > 0);

const readBestRecognitionResult = (
  event: BrowserSpeechRecognitionEvent,
): VoiceRecognitionResult | null => {
  const speechResult = event.results[event.resultIndex];

  if (!speechResult) {
    return null;
  }

  const alternatives = readRecognitionAlternatives(speechResult);
  const bestAlternative = alternatives[0];

  if (!bestAlternative) {
    return null;
  }

  return {
    alternatives,
    confidence: bestAlternative.confidence,
    confidenceLabel: getConfidenceLabel(bestAlternative.confidence),
    isFinal: speechResult.isFinal,
    transcript: bestAlternative.transcript,
  };
};

export const createDutchSpeechRecognition = ({
  autoStopMs = 7000,
  continuous = false,
  interimResults = false,
  lang = DUTCH_SPEECH_RECOGNITION_LANGUAGE,
  maxAlternatives = 3,
  onEnd,
  onError,
  onNoMatch,
  onResult,
  onStatusChange,
}: CreateDutchSpeechRecognitionOptions = {}): DutchSpeechRecognitionSession | null => {
  const RecognitionConstructor = getSpeechRecognitionConstructor();

  if (!RecognitionConstructor) {
    onStatusChange?.("unsupported");
    return null;
  }

  const recognition = new RecognitionConstructor();
  let autoStopTimer: number | undefined;
  let destroyed = false;

  const clearAutoStopTimer = () => {
    if (autoStopTimer !== undefined) {
      window.clearTimeout(autoStopTimer);
      autoStopTimer = undefined;
    }
  };

  const safeStop = () => {
    try {
      recognition.stop();
    } catch {
      // Browser implementations throw when stop is called outside an active session.
    }
  };

  recognition.lang = lang;
  recognition.continuous = continuous;
  recognition.interimResults = interimResults;
  recognition.maxAlternatives = maxAlternatives;

  recognition.onstart = () => {
    onStatusChange?.("listening");
    clearAutoStopTimer();

    if (autoStopMs > 0) {
      autoStopTimer = window.setTimeout(() => {
        onStatusChange?.("processing");
        safeStop();
      }, autoStopMs);
    }
  };

  recognition.onspeechend = () => {
    if (continuous) {
      onStatusChange?.("listening");
      return;
    }

    onStatusChange?.("processing");
    clearAutoStopTimer();
    safeStop();
  };

  recognition.onresult = (event) => {
    const result = readBestRecognitionResult(event);

    if (!result) {
      onNoMatch?.();
      return;
    }

    onResult?.(result);
    onStatusChange?.(continuous ? "listening" : "heard");
  };

  recognition.onnomatch = () => {
    onNoMatch?.();
    onStatusChange?.("error");
  };

  recognition.onerror = (event) => {
    clearAutoStopTimer();
    const errorCode = event.error ?? "unknown";
    onError?.(errorCode, getSpeechRecognitionErrorMessage(errorCode, event.message));
    onStatusChange?.("error");
  };

  recognition.onend = () => {
    clearAutoStopTimer();

    if (!destroyed) {
      onEnd?.();
    }
  };

  return {
    abort: () => {
      clearAutoStopTimer();
      recognition.abort();
    },
    destroy: () => {
      destroyed = true;
      clearAutoStopTimer();
      recognition.abort();
    },
    start: () => {
      try {
        recognition.start();
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        onError?.("unknown", getSpeechRecognitionErrorMessage("unknown", message));
        onStatusChange?.("error");
        return false;
      }
    },
    stop: safeStop,
  };
};
