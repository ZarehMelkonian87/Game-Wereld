export type SpeechAvailability = "available" | "blocked" | "prompt" | "unsupported";

export interface SpeechPermissionStatus {
  availability: SpeechAvailability;
  message: string;
}

