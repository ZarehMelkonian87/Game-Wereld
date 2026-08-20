import type {
  MicrophonePermissionResult,
  MicrophonePermissionState,
  SpeechRecognitionOptions,
  SpeechRecognitionSession,
  SpeechRecognitionSupport,
  VoiceRecognitionAlternative,
  VoiceRecognitionConfidence,
  VoiceRecognitionErrorCode,
  VoiceRecognitionResult,
} from "../contracts";

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

const getSpeechWindow = (): SpeechRecognitionWindow | null =>
  typeof window === "undefined" ? null : (window as SpeechRecognitionWindow);

const getRecognitionConstructor = (): BrowserSpeechRecognitionConstructor | null => {
  const speechWindow = getSpeechWindow();
  return speechWindow?.SpeechRecognition ?? speechWindow?.webkitSpeechRecognition ?? null;
};

export const getBrowserSpeechRecognitionSupport = (): SpeechRecognitionSupport => {
  const speechWindow = getSpeechWindow();
  if (!speechWindow) {
    return {
      isSecureContext: false,
      isSupported: false,
      needsSecureContext: false,
      reason: "ssr",
    };
  }
  if (!speechWindow.isSecureContext) {
    return {
      isSecureContext: false,
      isSupported: false,
      needsSecureContext: true,
      reason: "insecure-context",
    };
  }
  if (!getRecognitionConstructor()) {
    return {
      isSecureContext: true,
      isSupported: false,
      needsSecureContext: false,
      reason: "api-missing",
    };
  }
  return { isSecureContext: true, isSupported: true, needsSecureContext: false };
};

const getConfidenceLabel = (confidence: number): VoiceRecognitionConfidence => {
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.45) return "medium";
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
  if (event.results.length === 0) return null;

  if (event.results.length === 1) {
    const speechResult = event.results[0];
    if (!speechResult) return null;
    const alternatives = readRecognitionAlternatives(speechResult);
    const bestAlternative = alternatives[0];
    if (!bestAlternative) return null;
    return {
      alternatives,
      confidence: bestAlternative.confidence,
      confidenceLabel: getConfidenceLabel(bestAlternative.confidence),
      isFinal: speechResult.isFinal,
      transcript: bestAlternative.transcript,
    };
  }

  const transcriptSegments: string[] = [];
  let isAllFinal = true;
  let totalConfidence = 0;
  let count = 0;

  for (let i = 0; i < event.results.length; i++) {
    const resultItem = event.results[i];
    if (!resultItem || resultItem.length === 0) continue;
    const bestAlt = resultItem[0];
    if (bestAlt && bestAlt.transcript.trim()) {
      transcriptSegments.push(bestAlt.transcript.trim());
      totalConfidence += bestAlt.confidence || 0.8;
      count++;
    }
    if (!resultItem.isFinal) {
      isAllFinal = false;
    }
  }

  const combinedTranscript = transcriptSegments.join(" ").trim();
  if (!combinedTranscript) return null;

  const averageConfidence = count > 0 ? totalConfidence / count : 0.8;
  return {
    alternatives: [{ confidence: averageConfidence, transcript: combinedTranscript }],
    confidence: averageConfidence,
    confidenceLabel: getConfidenceLabel(averageConfidence),
    isFinal: isAllFinal,
    transcript: combinedTranscript,
  };
};

export const createBrowserSpeechRecognition = ({
  autoStopMs = 15000,
  continuous = false,
  interimResults = false,
  language = "nl-NL",
  maxAlternatives = 3,
  onEnd,
  onError,
  onNoMatch,
  onResult,
  onStatusChange,
  silenceStopMs,
}: SpeechRecognitionOptions = {}): SpeechRecognitionSession | null => {
  const RecognitionConstructor = getRecognitionConstructor();
  if (!RecognitionConstructor) {
    onStatusChange?.("unsupported");
    return null;
  }

  const recognition = new RecognitionConstructor();
  let autoStopTimer: number | undefined;
  let silenceStopTimer: number | undefined;
  let destroyed = false;

  const clearAutoStopTimer = () => {
    if (autoStopTimer !== undefined) {
      window.clearTimeout(autoStopTimer);
      autoStopTimer = undefined;
    }
  };

  const clearSilenceStopTimer = () => {
    if (silenceStopTimer !== undefined) {
      window.clearTimeout(silenceStopTimer);
      silenceStopTimer = undefined;
    }
  };

  const clearAllTimers = () => {
    clearAutoStopTimer();
    clearSilenceStopTimer();
  };

  const resetSilenceTimer = () => {
    clearSilenceStopTimer();
    if (silenceStopMs !== undefined && silenceStopMs > 0) {
      silenceStopTimer = window.setTimeout(() => {
        onStatusChange?.("processing");
        safeStop();
      }, silenceStopMs);
    }
  };

  const safeStop = () => {
    clearAllTimers();
    try {
      recognition.stop();
    } catch {
      // Browsers throw when stop is called outside an active recognition session.
    }
  };

  recognition.lang = language;
  recognition.continuous = continuous;
  recognition.interimResults = interimResults;
  recognition.maxAlternatives = maxAlternatives;
  recognition.onstart = () => {
    onStatusChange?.("listening");
    clearAllTimers();
    if (autoStopMs > 0) {
      autoStopTimer = window.setTimeout(() => {
        onStatusChange?.("processing");
        safeStop();
      }, autoStopMs);
    }
  };
  recognition.onspeechend = () => {
    if (continuous || (silenceStopMs !== undefined && silenceStopMs > 0)) {
      // Allow the silence timer or continuous stream to finish naturally
      return;
    }
    onStatusChange?.("processing");
    clearAllTimers();
    safeStop();
  };
  recognition.onresult = (event) => {
    const result = readBestRecognitionResult(event);
    if (!result) {
      onNoMatch?.();
      return;
    }
    resetSilenceTimer();
    onResult?.(result);
    onStatusChange?.(continuous ? "listening" : "heard");
  };
  recognition.onnomatch = () => {
    onNoMatch?.();
    onStatusChange?.("error");
  };
  recognition.onerror = (event) => {
    clearAllTimers();
    onError?.(event.error ?? "unknown", event.message ?? "");
    onStatusChange?.("error");
  };
  recognition.onend = () => {
    clearAllTimers();
    if (!destroyed) onEnd?.();
  };

  return {
    abort: () => {
      clearAllTimers();
      recognition.abort();
    },
    destroy: () => {
      destroyed = true;
      clearAllTimers();
      recognition.abort();
    },
    start: () => {
      try {
        recognition.start();
        return true;
      } catch (error) {
        onError?.("unknown", error instanceof Error ? error.message : "");
        onStatusChange?.("error");
        return false;
      }
    },
    stop: safeStop,
  };
};

const createPermissionResult = (
  state: MicrophonePermissionState,
  message: string,
): MicrophonePermissionResult => ({
  canAsk: state === "prompt" || state === "unknown",
  canUse: state === "granted",
  message,
  state,
});

const getUnavailableMicrophoneReason = (): MicrophonePermissionResult | undefined => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return createPermissionResult("unsupported", "Microfooncontrole is hier niet beschikbaar.");
  }
  if (!window.isSecureContext) {
    return createPermissionResult(
      "insecure-context",
      "Microfoon werkt op telefoon meestal alleen via HTTPS of localhost.",
    );
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return createPermissionResult(
      "unsupported",
      "Deze browser kan geen microfoontoestemming vragen. Gebruik Typ of probeer Chrome.",
    );
  }
  return undefined;
};

const mapPermissionState = (state: PermissionState): MicrophonePermissionResult => {
  if (state === "granted") {
    return createPermissionResult("granted", "Microfoon is toegestaan.");
  }
  if (state === "denied") {
    return createPermissionResult(
      "denied",
      "Microfoon is geblokkeerd. Zet microfoontoegang aan in de browserinstellingen.",
    );
  }
  return createPermissionResult("prompt", "De browser moet nog om microfoontoestemming vragen.");
};

const readPermissionStatus = async (): Promise<MicrophonePermissionResult | undefined> => {
  if (!navigator.permissions?.query) return undefined;
  try {
    const permissionStatus = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return mapPermissionState(permissionStatus.state);
  } catch {
    return undefined;
  }
};

export const getBrowserMicrophonePermission = async (): Promise<MicrophonePermissionResult> => {
  const unavailable = getUnavailableMicrophoneReason();
  if (unavailable) return unavailable;
  return (
    (await readPermissionStatus()) ??
    createPermissionResult("unknown", "Tik op de microfoonknop om toestemming te vragen.")
  );
};

export const requestBrowserMicrophonePermission = async (): Promise<MicrophonePermissionResult> => {
  const unavailable = getUnavailableMicrophoneReason();
  if (unavailable) return unavailable;
  const current = await readPermissionStatus();
  if (current?.state === "denied" || current?.state === "granted") return current;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return createPermissionResult("granted", "Microfoon is toegestaan.");
  } catch (error) {
    const errorName = error instanceof DOMException ? error.name : "";
    if (errorName === "NotAllowedError" || errorName === "SecurityError") {
      return createPermissionResult(
        "denied",
        "Microfoon is geweigerd. Sta microfoon toe in de browserinstellingen en probeer opnieuw.",
      );
    }
    if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
      return createPermissionResult(
        "unsupported",
        "Er is geen microfoon gevonden op dit apparaat.",
      );
    }
    return createPermissionResult(
      "unknown",
      "Microfoon kon niet worden gestart. Gebruik Typ of probeer het opnieuw.",
    );
  }
};
