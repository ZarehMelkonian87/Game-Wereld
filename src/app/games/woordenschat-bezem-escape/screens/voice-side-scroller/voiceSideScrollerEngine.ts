import {
  createInitialVoiceScrollerState,
  VOICE_SCROLLER_ROUND_DURATION_MS,
  type VoiceSideScrollerGameState,
  type VoiceSideScrollerStatus,
} from "./voiceSideScrollerModel";

const MIN_PLAYER_Y = 0.14;
const MAX_PLAYER_Y = 0.82;
const FALL_SPEED_PER_SECOND = 0.13;
const INPUT_SPEED_PER_SECOND = 0.52;
const SCROLL_SPEED_PER_SECOND = 0.105;
const TARGET_SPEED_PER_SECOND = 0.16;
const TARGET_RECYCLE_OFFSET = 2.1;

export interface VoiceSideScrollerTickInput {
  deltaMs: number;
  state: VoiceSideScrollerGameState;
  verticalInput: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizeVerticalInput = (verticalInput: number) => clamp(verticalInput, -1, 1);

const getNextTargetX = (x: number, deltaSeconds: number) => {
  const nextX = x - TARGET_SPEED_PER_SECOND * deltaSeconds;

  if (nextX >= -0.18) {
    return nextX;
  }

  return nextX + TARGET_RECYCLE_OFFSET;
};

const getNextStatus = (
  elapsedMs: number,
  currentStatus: VoiceSideScrollerStatus,
): VoiceSideScrollerStatus => {
  if (currentStatus !== "running") {
    return currentStatus;
  }

  return elapsedMs >= VOICE_SCROLLER_ROUND_DURATION_MS ? "finished" : "running";
};

export const tickVoiceSideScrollerState = ({
  deltaMs,
  state,
  verticalInput,
}: VoiceSideScrollerTickInput): VoiceSideScrollerGameState => {
  if (state.status !== "running") {
    return state;
  }

  const deltaSeconds = Math.min(deltaMs, 80) / 1000;
  const input = normalizeVerticalInput(verticalInput);
  const nextElapsedMs = Math.min(
    VOICE_SCROLLER_ROUND_DURATION_MS,
    state.elapsedMs + Math.max(deltaMs, 0),
  );
  const nextPlayerY = clamp(
    state.playerY + FALL_SPEED_PER_SECOND * deltaSeconds + input * INPUT_SPEED_PER_SECOND * deltaSeconds,
    MIN_PLAYER_Y,
    MAX_PLAYER_Y,
  );

  return {
    ...state,
    elapsedMs: nextElapsedMs,
    playerY: nextPlayerY,
    scrollX: state.scrollX + SCROLL_SPEED_PER_SECOND * deltaSeconds,
    status: getNextStatus(nextElapsedMs, state.status),
    targets: state.targets.map((target) => ({
      ...target,
      x: getNextTargetX(target.x, deltaSeconds),
    })),
    timeLeftMs: Math.max(0, VOICE_SCROLLER_ROUND_DURATION_MS - nextElapsedMs),
  };
};

export const startVoiceSideScrollerRound = (): VoiceSideScrollerGameState => ({
  ...createInitialVoiceScrollerState(),
  status: "running",
});

export const pauseVoiceSideScrollerRound = (
  state: VoiceSideScrollerGameState,
): VoiceSideScrollerGameState => (
  state.status === "running" ? { ...state, status: "paused" } : state
);

export const resumeVoiceSideScrollerRound = (
  state: VoiceSideScrollerGameState,
): VoiceSideScrollerGameState => (
  state.status === "paused" ? { ...state, status: "running" } : state
);
