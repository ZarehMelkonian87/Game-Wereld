export type VoiceSideScrollerStatus =
  | "ready"
  | "running"
  | "paused"
  | "finished";

export interface VoiceSideScrollerTarget {
  id: string;
  word: string;
  assetId: string;
  collectibleLabel: string;
  x: number;
  y: number;
  collected: boolean;
}

export type VoiceSideScrollerObstacleKind =
  | "cloud"
  | "parasol-edge"
  | "rock"
  | "wave";

export interface VoiceSideScrollerObstacle {
  height: number;
  hit: boolean;
  id: string;
  kind: VoiceSideScrollerObstacleKind;
  label: string;
  width: number;
  x: number;
  y: number;
}

export type VoiceSideScrollerGameplayFeedbackKind =
  | "boost"
  | "hint";

export interface VoiceSideScrollerGameplayFeedback {
  id: string;
  kind: VoiceSideScrollerGameplayFeedbackKind;
  message: string;
  visibleUntilMs: number;
}

export interface VoiceSideScrollerGameState {
  collisionSlowdownMs: number;
  elapsedMs: number;
  gameplayFeedback?: VoiceSideScrollerGameplayFeedback;
  obstacleHits: number;
  obstacles: VoiceSideScrollerObstacle[];
  playerY: number;
  scrollX: number;
  speed: number;
  stars: number;
  status: VoiceSideScrollerStatus;
  targets: VoiceSideScrollerTarget[];
  timeLeftMs: number;
}

export const VOICE_SCROLLER_ROUND_DURATION_MS = 45_000;

export const VOICE_SCROLLER_DEMO_TARGETS: VoiceSideScrollerTarget[] = [
  { id: "target-boot", word: "boot", assetId: "boot", collectibleLabel: "bootster", x: 0.72, y: 0.54, collected: false },
  { id: "target-krab", word: "krab", assetId: "krab", collectibleLabel: "krabster", x: 1.02, y: 0.72, collected: false },
  { id: "target-dolfijn", word: "dolfijn", assetId: "dolfijn", collectibleLabel: "dolfijnster", x: 1.32, y: 0.42, collected: false },
  { id: "target-schelp", word: "schelp", assetId: "schelp", collectibleLabel: "schelpster", x: 1.62, y: 0.78, collected: false },
  { id: "target-bal", word: "bal", assetId: "bal", collectibleLabel: "balster", x: 1.92, y: 0.66, collected: false },
  { id: "target-parasol", word: "parasol", assetId: "parasol", collectibleLabel: "parasolster", x: 2.22, y: 0.58, collected: false },
  { id: "target-zon", word: "zon", assetId: "zon", collectibleLabel: "zonster", x: 2.52, y: 0.22, collected: false },
];

export const VOICE_SCROLLER_DEMO_OBSTACLES: VoiceSideScrollerObstacle[] = [
  { id: "obstacle-cloud", kind: "cloud", label: "wolk", x: 0.58, y: 0.25, width: 0.16, height: 0.14, hit: false },
  { id: "obstacle-wave", kind: "wave", label: "golf", x: 1.14, y: 0.72, width: 0.18, height: 0.12, hit: false },
  { id: "obstacle-rock", kind: "rock", label: "rots", x: 1.7, y: 0.8, width: 0.14, height: 0.11, hit: false },
  { id: "obstacle-parasol-edge", kind: "parasol-edge", label: "parasolrand", x: 2.26, y: 0.6, width: 0.16, height: 0.19, hit: false },
];

export const createInitialVoiceScrollerState = (): VoiceSideScrollerGameState => ({
  collisionSlowdownMs: 0,
  elapsedMs: 0,
  gameplayFeedback: undefined,
  obstacleHits: 0,
  obstacles: VOICE_SCROLLER_DEMO_OBSTACLES.map((obstacle) => ({ ...obstacle })),
  playerY: 0.48,
  scrollX: 0,
  speed: 1,
  stars: 0,
  status: "ready",
  targets: VOICE_SCROLLER_DEMO_TARGETS.map((target) => ({ ...target })),
  timeLeftMs: VOICE_SCROLLER_ROUND_DURATION_MS,
});
