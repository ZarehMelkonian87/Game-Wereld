export type VoiceRecognitionStatus =
  "idle" | "listening" | "processing" | "heard" | "unsupported" | "error";

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

export interface SpeechRecognitionOptions {
  autoStopMs?: number;
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  /**
   * Alleen het laatst gewijzigde resultaatsegment doorgeven i.p.v. de volledige
   * opgestapelde transcript (leest vanaf `event.resultIndex`). Nodig voor een
   * doorlopende luister-sessie waarbij losse woorden worden herkend (Zeg &
   * Vlieg): zo stapelen eerdere woorden niet op en hoeft de sessie niet na elke
   * match herstart te worden. Standaard uit → gedrag ongewijzigd voor Zeg & Zet,
   * dat juist de hele zin nodig heeft.
   */
  latestSegmentOnly?: boolean;
  maxAlternatives?: number;
  onEnd?: () => void;
  onError?: (errorCode: VoiceRecognitionErrorCode, message: string) => void;
  onNoMatch?: () => void;
  onResult?: (result: VoiceRecognitionResult) => void;
  onStatusChange?: (status: VoiceRecognitionStatus) => void;
  silenceStopMs?: number;
}

export interface SpeechRecognitionSession {
  abort: () => void;
  destroy: () => void;
  start: () => boolean;
  stop: () => void;
}

export type MicrophonePermissionState =
  "denied" | "granted" | "insecure-context" | "prompt" | "unknown" | "unsupported";

export interface MicrophonePermissionResult {
  canAsk: boolean;
  canUse: boolean;
  message: string;
  state: MicrophonePermissionState;
}
