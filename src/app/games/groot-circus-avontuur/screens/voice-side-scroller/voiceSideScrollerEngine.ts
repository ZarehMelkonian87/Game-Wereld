import {
  createInitialVoiceScrollerState,
  type CreateInitialVoiceScrollerStateOptions,
  recycleVoiceScrollerTarget,
  VOICE_SCROLLER_ITEM_SCORE,
  VOICE_SCROLLER_LEVEL_DISTANCE,
  type VoiceSideScrollerGameState,
  type VoiceSideScrollerObstacle,
  type VoiceSideScrollerTarget,
} from "./voiceSideScrollerModel";

const PLAYER_X = 0.12;
const PLAYER_COLLISION_WIDTH = 0.05;
const PLAYER_COLLISION_HEIGHT = 0.07;
const MIN_PLAYER_Y = 0.14;
const MAX_PLAYER_Y = 0.82;
const FALL_SPEED_PER_SECOND = 0.13;
const INPUT_SPEED_PER_SECOND = 0.52;
const SCROLL_SPEED_PER_SECOND = 0.105;
const TARGET_SPEED_PER_SECOND = 0.13;
const OBSTACLE_SPEED_PER_SECOND = 0.18;
const DISTANCE_PER_SECOND = 8;
const TARGET_RECYCLE_OFFSET = 2.1;
const TARGET_RECYCLE_RANDOM_OFFSET = 0.9;
const OBSTACLE_RECYCLE_OFFSET = 2.25;
const SPEED_BONUS_PER_WORD = 1;
const COLLISION_SLOWDOWN_MS = 1_300;
const FEEDBACK_VISIBLE_MS = 2_400;
const MAX_TICK_DELTA_MS = 1_000;

export interface VoiceSideScrollerTickInput {
  deltaMs: number;
  state: VoiceSideScrollerGameState;
  verticalInput: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const normalizeVerticalInput = (verticalInput: number) => clamp(verticalInput, -1, 1);

const getGameplaySpeedMultiplier = (state: VoiceSideScrollerGameState) => {
  const languageBoost = Math.min(0.38, Math.max(0, state.speed - 1) * 0.055);
  const distanceBoost = Math.min(0.72, state.distance * 0.0026);
  const obstacleSlowdown = state.collisionSlowdownMs > 0 ? 0.32 : 0;

  return clamp(1 + languageBoost + distanceBoost - obstacleSlowdown, 0.68, 1.92);
};

const getDifficultyLevel = (distance: number) =>
  Math.floor(distance / VOICE_SCROLLER_LEVEL_DISTANCE) + 1;

const getScore = (distance: number, stars: number) =>
  Math.floor(distance) + stars * VOICE_SCROLLER_ITEM_SCORE;

const getObstacleRecycleDistance = (difficultyLevel: number) =>
  Math.max(1.45, OBSTACLE_RECYCLE_OFFSET - (difficultyLevel - 1) * 0.08);

const getNextMovingX = (
  x: number,
  deltaSeconds: number,
  speedPerSecond: number,
  speedMultiplier: number,
) => x - speedPerSecond * speedMultiplier * deltaSeconds;

const getNextTarget = (
  target: VoiceSideScrollerTarget,
  deltaSeconds: number,
  speedMultiplier: number,
): VoiceSideScrollerTarget => {
  const nextX = getNextMovingX(target.x, deltaSeconds, TARGET_SPEED_PER_SECOND, speedMultiplier);

  if (nextX >= -0.18) {
    return {
      ...target,
      x: nextX,
    };
  }

  return recycleVoiceScrollerTarget(
    target,
    nextX + TARGET_RECYCLE_OFFSET + Math.random() * TARGET_RECYCLE_RANDOM_OFFSET,
  );
};

const getNextObstacle = (
  obstacle: VoiceSideScrollerObstacle,
  difficultyLevel: number,
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
    x: nextX + getObstacleRecycleDistance(difficultyLevel),
  };
};

const hasPlayerHitObstacle = (playerY: number, obstacle: VoiceSideScrollerObstacle) => {
  const collisionCenterX = obstacle.x + obstacle.collisionBox.offsetX;
  const collisionCenterY = obstacle.y + obstacle.collisionBox.offsetY;
  const isCloseHorizontally =
    Math.abs(collisionCenterX - PLAYER_X) <
    (obstacle.collisionBox.width + PLAYER_COLLISION_WIDTH) / 2;
  const isCloseVertically =
    Math.abs(collisionCenterY - playerY) <
    (obstacle.collisionBox.height + PLAYER_COLLISION_HEIGHT) / 2;

  return isCloseHorizontally && isCloseVertically;
};

const findCollidingObstacle = (obstacles: VoiceSideScrollerObstacle[], playerY: number) =>
  obstacles.find((obstacle) => !obstacle.hit && hasPlayerHitObstacle(playerY, obstacle));

const getVisibleFeedback = (state: VoiceSideScrollerGameState, nextElapsedMs: number) =>
  state.gameplayFeedback && state.gameplayFeedback.visibleUntilMs > nextElapsedMs
    ? state.gameplayFeedback
    : undefined;

export const tickVoiceSideScrollerState = ({
  deltaMs,
  state,
  verticalInput,
}: VoiceSideScrollerTickInput): VoiceSideScrollerGameState => {
  if (state.status !== "running") {
    return state;
  }

  const tickDeltaMs = Math.min(Math.max(deltaMs, 0), MAX_TICK_DELTA_MS);
  const deltaSeconds = tickDeltaMs / 1000;
  const input = normalizeVerticalInput(verticalInput);
  const speedMultiplier = getGameplaySpeedMultiplier(state);
  const nextElapsedMs = state.elapsedMs + tickDeltaMs;
  const nextDistance = state.distance + DISTANCE_PER_SECOND * speedMultiplier * deltaSeconds;
  const nextDifficultyLevel = getDifficultyLevel(nextDistance);
  const nextPlayerY = clamp(
    state.playerY +
      FALL_SPEED_PER_SECOND * deltaSeconds +
      input * INPUT_SPEED_PER_SECOND * deltaSeconds,
    MIN_PLAYER_Y,
    MAX_PLAYER_Y,
  );
  const nextObstacles = state.obstacles.map((obstacle) =>
    getNextObstacle(obstacle, nextDifficultyLevel, deltaSeconds, speedMultiplier),
  );
  const collidingObstacle = findCollidingObstacle(nextObstacles, nextPlayerY);
  const obstacles = collidingObstacle
    ? nextObstacles.map((obstacle) =>
        obstacle.id === collidingObstacle.id ? { ...obstacle, hit: true } : obstacle,
      )
    : nextObstacles;
  const collisionSlowdownMs = collidingObstacle
    ? COLLISION_SLOWDOWN_MS
    : Math.max(0, state.collisionSlowdownMs - tickDeltaMs);
  const gameplayFeedback = collidingObstacle
    ? {
        id: `feedback-${collidingObstacle.id}-${Math.round(nextElapsedMs)}`,
        kind: "hint" as const,
        message: `Game over. Je raakte de ${collidingObstacle.label}.`,
        visibleUntilMs: nextElapsedMs + FEEDBACK_VISIBLE_MS,
      }
    : getVisibleFeedback(state, nextElapsedMs);

  return {
    ...state,
    collisionSlowdownMs,
    difficultyLevel: nextDifficultyLevel,
    distance: nextDistance,
    elapsedMs: nextElapsedMs,
    gameplayFeedback,
    obstacleHits: state.obstacleHits + (collidingObstacle ? 1 : 0),
    obstacles,
    playerY: nextPlayerY,
    scrollX: state.scrollX + SCROLL_SPEED_PER_SECOND * speedMultiplier * deltaSeconds,
    score: getScore(nextDistance, state.stars),
    status: collidingObstacle ? "game-over" : state.status,
    targets: state.targets.map((target) => getNextTarget(target, deltaSeconds, speedMultiplier)),
  };
};

export const startVoiceSideScrollerRound = (
  options: CreateInitialVoiceScrollerStateOptions = {},
): VoiceSideScrollerGameState => ({
  ...createInitialVoiceScrollerState(options),
  status: "running",
});

export const collectVoiceSideScrollerTarget = (
  state: VoiceSideScrollerGameState,
  targetId: string,
): VoiceSideScrollerGameState => {
  const target = state.targets.find((candidate) => candidate.id === targetId);

  if (!target || target.collected) {
    return state;
  }

  const targets = state.targets.map((candidate) =>
    candidate.id === targetId ? { ...candidate, collected: true } : candidate,
  );

  return {
    ...state,
    gameplayFeedback: {
      id: `feedback-${target.id}-${Math.round(state.elapsedMs)}`,
      kind: "boost",
      message: `Goed gevangen: ${target.collectibleLabel}. +1 Tempo!`,
      visibleUntilMs: state.elapsedMs + FEEDBACK_VISIBLE_MS,
    },
    score: getScore(state.distance, state.stars + 1),
    speed: state.speed + SPEED_BONUS_PER_WORD,
    stars: state.stars + 1,
    targets,
  };
};
