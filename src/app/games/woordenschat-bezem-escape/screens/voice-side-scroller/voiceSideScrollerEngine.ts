import {
  createInitialVoiceScrollerState,
  type CreateInitialVoiceScrollerStateOptions,
  VOICE_SCROLLER_ROUND_DURATION_MS,
  type VoiceSideScrollerGameState,
  type VoiceSideScrollerObstacle,
  type VoiceSideScrollerStatus,
} from "./voiceSideScrollerModel";

const PLAYER_X = 0.12;
const PLAYER_COLLISION_WIDTH = 0.1;
const PLAYER_COLLISION_HEIGHT = 0.18;
const MIN_PLAYER_Y = 0.14;
const MAX_PLAYER_Y = 0.82;
const FALL_SPEED_PER_SECOND = 0.13;
const INPUT_SPEED_PER_SECOND = 0.52;
const SCROLL_SPEED_PER_SECOND = 0.105;
const TARGET_SPEED_PER_SECOND = 0.16;
const OBSTACLE_SPEED_PER_SECOND = 0.18;
const TARGET_RECYCLE_OFFSET = 2.1;
const OBSTACLE_RECYCLE_OFFSET = 2.25;
const SPEED_BONUS_PER_WORD = 1;
const COLLISION_SLOWDOWN_MS = 1_300;
const FEEDBACK_VISIBLE_MS = 2_400;

export interface VoiceSideScrollerTickInput {
  deltaMs: number;
  state: VoiceSideScrollerGameState;
  verticalInput: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizeVerticalInput = (verticalInput: number) => clamp(verticalInput, -1, 1);

const getGameplaySpeedMultiplier = (state: VoiceSideScrollerGameState) => {
  const languageBoost = Math.min(0.38, Math.max(0, state.speed - 1) * 0.055);
  const obstacleSlowdown = state.collisionSlowdownMs > 0 ? 0.32 : 0;

  return clamp(1 + languageBoost - obstacleSlowdown, 0.68, 1.45);
};

const getNextMovingX = (
  x: number,
  deltaSeconds: number,
  speedPerSecond: number,
  speedMultiplier: number,
) => x - speedPerSecond * speedMultiplier * deltaSeconds;

const getNextTargetX = (
  x: number,
  deltaSeconds: number,
  speedMultiplier: number,
) => {
  const nextX = getNextMovingX(x, deltaSeconds, TARGET_SPEED_PER_SECOND, speedMultiplier);

  if (nextX >= -0.18) {
    return nextX;
  }

  return nextX + TARGET_RECYCLE_OFFSET;
};

const getNextObstacle = (
  obstacle: VoiceSideScrollerObstacle,
  deltaSeconds: number,
  speedMultiplier: number,
): VoiceSideScrollerObstacle => {
  const nextX = getNextMovingX(
    obstacle.x,
    deltaSeconds,
    OBSTACLE_SPEED_PER_SECOND,
    speedMultiplier,
  );

  if (nextX >= -0.18) {
    return {
      ...obstacle,
      x: nextX,
    };
  }

  return {
    ...obstacle,
    hit: false,
    x: nextX + OBSTACLE_RECYCLE_OFFSET,
  };
};

const hasPlayerHitObstacle = (
  playerY: number,
  obstacle: VoiceSideScrollerObstacle,
) => {
  const isCloseHorizontally =
    Math.abs(obstacle.x - PLAYER_X) < (obstacle.width + PLAYER_COLLISION_WIDTH) / 2;
  const isCloseVertically =
    Math.abs(obstacle.y - playerY) < (obstacle.height + PLAYER_COLLISION_HEIGHT) / 2;

  return isCloseHorizontally && isCloseVertically;
};

const findCollidingObstacle = (
  obstacles: VoiceSideScrollerObstacle[],
  playerY: number,
) => obstacles.find((obstacle) => !obstacle.hit && hasPlayerHitObstacle(playerY, obstacle));

const getVisibleFeedback = (
  state: VoiceSideScrollerGameState,
  nextElapsedMs: number,
) => (
  state.gameplayFeedback && state.gameplayFeedback.visibleUntilMs > nextElapsedMs
    ? state.gameplayFeedback
    : undefined
);

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
  const speedMultiplier = getGameplaySpeedMultiplier(state);
  const nextElapsedMs = Math.min(
    VOICE_SCROLLER_ROUND_DURATION_MS,
    state.elapsedMs + Math.max(deltaMs, 0),
  );
  const nextPlayerY = clamp(
    state.playerY + FALL_SPEED_PER_SECOND * deltaSeconds + input * INPUT_SPEED_PER_SECOND * deltaSeconds,
    MIN_PLAYER_Y,
    MAX_PLAYER_Y,
  );
  const nextObstacles = state.obstacles.map((obstacle) =>
    getNextObstacle(obstacle, deltaSeconds, speedMultiplier),
  );
  const collidingObstacle = findCollidingObstacle(nextObstacles, nextPlayerY);
  const obstacles = collidingObstacle
    ? nextObstacles.map((obstacle) => (
        obstacle.id === collidingObstacle.id ? { ...obstacle, hit: true } : obstacle
      ))
    : nextObstacles;
  const collisionSlowdownMs = collidingObstacle
    ? COLLISION_SLOWDOWN_MS
    : Math.max(0, state.collisionSlowdownMs - deltaMs);
  const gameplayFeedback = collidingObstacle
    ? {
        id: `feedback-${collidingObstacle.id}-${Math.round(nextElapsedMs)}`,
        kind: "hint" as const,
        message: `Rustig, vlieg om de ${collidingObstacle.label} heen.`,
        visibleUntilMs: nextElapsedMs + FEEDBACK_VISIBLE_MS,
      }
    : getVisibleFeedback(state, nextElapsedMs);

  return {
    ...state,
    collisionSlowdownMs,
    elapsedMs: nextElapsedMs,
    gameplayFeedback,
    obstacleHits: state.obstacleHits + (collidingObstacle ? 1 : 0),
    obstacles,
    playerY: nextPlayerY,
    scrollX: state.scrollX + SCROLL_SPEED_PER_SECOND * speedMultiplier * deltaSeconds,
    status: getNextStatus(nextElapsedMs, state.status),
    targets: state.targets.map((target) => ({
      ...target,
      x: getNextTargetX(target.x, deltaSeconds, speedMultiplier),
    })),
    timeLeftMs: Math.max(0, VOICE_SCROLLER_ROUND_DURATION_MS - nextElapsedMs),
  };
};

export const startVoiceSideScrollerRound = (
  options: CreateInitialVoiceScrollerStateOptions = {},
): VoiceSideScrollerGameState => ({
  ...createInitialVoiceScrollerState(options),
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

export const collectVoiceSideScrollerTarget = (
  state: VoiceSideScrollerGameState,
  targetId: string,
): VoiceSideScrollerGameState => {
  const target = state.targets.find((candidate) => candidate.id === targetId);

  if (!target || target.collected) {
    return state;
  }

  const targets = state.targets.map((candidate) => (
    candidate.id === targetId ? { ...candidate, collected: true } : candidate
  ));
  const hasRemainingTargets = targets.some((candidate) => !candidate.collected);

  return {
    ...state,
    gameplayFeedback: {
      id: `feedback-${target.id}-${Math.round(state.elapsedMs)}`,
      kind: "boost",
      message: `Goed gevangen: ${target.collectibleLabel}. +1 Speed!`,
      visibleUntilMs: state.elapsedMs + FEEDBACK_VISIBLE_MS,
    },
    speed: state.speed + SPEED_BONUS_PER_WORD,
    stars: state.stars + 1,
    status: hasRemainingTargets ? state.status : "finished",
    targets,
  };
};
