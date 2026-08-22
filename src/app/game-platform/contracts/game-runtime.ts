import type { ComponentType } from "react";
import type { EventId, GameId, ProfileId, SessionId } from "./ids";
import type { Result } from "./result";
import type {
  MicrophonePermissionResult,
  SpeechRecognitionOptions,
  SpeechRecognitionSession,
  SpeechRecognitionSupport,
} from "./speech-recognition";

export type GameExitReason = "back" | "route-change" | "unload" | "user";
export type GameSessionStatus = "abandoned" | "completed" | "crashed" | "started";

export interface RuntimeFailure {
  code: "permission-denied" | "quota-exceeded" | "unavailable" | "unexpected";
  message: string;
  recoverable: boolean;
}

export interface Clock {
  now: () => Date;
}

export interface IdGenerator {
  eventId: () => EventId;
  sessionId: () => SessionId;
}

export interface DiagnosticContext {
  capability?: string;
  contentVersion?: string;
  errorCode?: string;
  gameId?: string;
  operation?: string;
  recovery?: string;
  route?: string;
  state?: string;
}

export interface DiagnosticInput {
  context?: DiagnosticContext;
  correlationId?: string;
  event: string;
  severity: "debug" | "error" | "info" | "warn";
  subsystem: string;
}

export interface DiagnosticEvent {
  context: DiagnosticContext;
  correlationId: string;
  event: string;
  release: string;
  severity: "debug" | "error" | "info" | "warn";
  subsystem: string;
  timestamp: string;
}

export interface DiagnosticLogger {
  log: (event: DiagnosticInput) => void;
}

export interface PracticeObservation {
  assistance: Array<"instruction-replay" | "visual-hint" | "spoken-help">;
  attemptNumber: number;
  eventId?: EventId;
  outcome: "correct" | "incorrect" | "skipped";
  responseTimeMs?: number;
  skillIds: string[];
  taskId: string;
}

export interface PracticeEventWriter {
  append: (observation: PracticeObservation) => Promise<Result<void, RuntimeFailure>>;
  reset: () => Promise<Result<void, RuntimeFailure>>;
}

export interface MediaController {
  createPlayback: (source: string) => MediaPlayback;
  pauseAll: () => void;
  playAudio: (source: string) => Promise<Result<void, RuntimeFailure>>;
}

export interface MediaPlayback {
  dispose: () => void;
  pause: () => void;
  play: () => Promise<Result<void, RuntimeFailure>>;
  reset: () => void;
  setLoop: (loop: boolean) => void;
  setVolume: (volume: number) => void;
}

export interface SpeechController {
  createRecognition: (options?: SpeechRecognitionOptions) => SpeechRecognitionSession | null;
  getMicrophonePermission: () => Promise<MicrophonePermissionResult>;
  getRecognitionSupport: () => SpeechRecognitionSupport;
  isRecognitionAvailable: () => boolean;
  requestMicrophonePermission: () => Promise<MicrophonePermissionResult>;
  speak: (text: string, language?: string) => Result<void, RuntimeFailure>;
}

export interface RuntimeStorage {
  get: (key: string, scope?: "local" | "session") => string | null;
  remove: (key: string, scope?: "local" | "session") => void;
  set: (key: string, value: string, scope?: "local" | "session") => Result<void, RuntimeFailure>;
}

export interface GameSessionSummary {
  correctActions: number;
  score: number;
  stars: number;
}

export interface GameRuntime {
  clock: Clock;
  diagnostics: DiagnosticLogger;
  identity: {
    gameId: GameId;
    profileId: ProfileId;
    sessionId: SessionId;
  };
  ids: IdGenerator;
  lifecycle: {
    complete: (summary: GameSessionSummary) => void;
    exit: (reason: GameExitReason) => void;
  };
  media: MediaController;
  practice: PracticeEventWriter;
  speech: SpeechController;
  storage: RuntimeStorage;
}

export interface GameModule {
  Game: ComponentType<{ runtime: GameRuntime }>;
}
