import type { SceneCommandExecutionResult } from "../../../logic/scene-command-executor";

export interface PendingPlacement {
  objectId: string;
  source?: "manual" | "spoken";
  transcript?: string;
  x: number;
  y: number;
  zoneId: string;
}

export interface FeedbackState {
  hintVideoUrl?: string;
  kind: "almost" | "correct" | "ready";
  mascot?: "celebration" | "hint";
  repeatText?: string;
  rewardLabels?: string[];
  text: string;
}

export interface HintUsageEvent {
  hintLevel: number;
  instructionId: string;
  usedAt: string;
}

export type { SceneCommandExecutionResult };
