export type VoiceSideScrollerStatus =
  | "ready"
  | "running"
  | "paused"
  | "finished";

export interface VoiceSideScrollerTarget {
  id: string;
  word: string;
  assetId: string;
  x: number;
  y: number;
  collected: boolean;
}

export interface VoiceSideScrollerGameState {
  elapsedMs: number;
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
  { id: "target-boot", word: "boot", assetId: "boot", x: 0.72, y: 0.54, collected: false },
  { id: "target-krab", word: "krab", assetId: "krab", x: 1.02, y: 0.72, collected: false },
  { id: "target-dolfijn", word: "dolfijn", assetId: "dolfijn", x: 1.32, y: 0.42, collected: false },
  { id: "target-schelp", word: "schelp", assetId: "schelp", x: 1.62, y: 0.78, collected: false },
  { id: "target-bal", word: "bal", assetId: "bal", x: 1.92, y: 0.66, collected: false },
  { id: "target-parasol", word: "parasol", assetId: "parasol", x: 2.22, y: 0.58, collected: false },
  { id: "target-zon", word: "zon", assetId: "zon", x: 2.52, y: 0.22, collected: false },
];

export const createInitialVoiceScrollerState = (): VoiceSideScrollerGameState => ({
  elapsedMs: 0,
  playerY: 0.48,
  scrollX: 0,
  speed: 1,
  stars: 0,
  status: "ready",
  targets: VOICE_SCROLLER_DEMO_TARGETS.map((target) => ({ ...target })),
  timeLeftMs: VOICE_SCROLLER_ROUND_DURATION_MS,
});
