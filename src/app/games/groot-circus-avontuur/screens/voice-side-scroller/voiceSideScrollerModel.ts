export type VoiceSideScrollerStatus = "game-over" | "ready" | "running";

export interface VoiceSideScrollerTarget {
  id: string;
  word: string;
  assetId: string;
  collectibleLabel: string;
  x: number;
  y: number;
  collected: boolean;
}

export interface VoiceSideScrollerWordEducationState {
  audioRepeats: number;
  attempts: number;
  heardTranscripts: string[];
  hintsUsed: number;
  needsPractice: boolean;
  recognized: boolean;
  targetId: string;
  word: string;
}

export interface VoiceSideScrollerRoundEducationState {
  focusWords: string[];
  wordObservations: Record<string, VoiceSideScrollerWordEducationState>;
}

export type VoiceSideScrollerObstacleKind = "cloud" | "sea-lion" | "seagull" | "shark";

export interface VoiceSideScrollerObstacle {
  collisionBox: VoiceSideScrollerObstacleCollisionBox;
  height: number;
  hit: boolean;
  id: string;
  kind: VoiceSideScrollerObstacleKind;
  label: string;
  width: number;
  x: number;
  y: number;
}

export interface VoiceSideScrollerObstacleCollisionBox {
  height: number;
  offsetX: number;
  offsetY: number;
  width: number;
}

export type VoiceSideScrollerGameplayFeedbackKind = "boost" | "hint";

export interface VoiceSideScrollerGameplayFeedback {
  id: string;
  kind: VoiceSideScrollerGameplayFeedbackKind;
  message: string;
  visibleUntilMs: number;
}

export interface VoiceSideScrollerGameState {
  collisionSlowdownMs: number;
  difficultyLevel: number;
  distance: number;
  education: VoiceSideScrollerRoundEducationState;
  elapsedMs: number;
  gameplayFeedback?: VoiceSideScrollerGameplayFeedback;
  obstacleHits: number;
  obstacles: VoiceSideScrollerObstacle[];
  playerY: number;
  scrollX: number;
  score: number;
  speed: number;
  stars: number;
  status: VoiceSideScrollerStatus;
  targets: VoiceSideScrollerTarget[];
}

export const VOICE_SCROLLER_FOCUS_WORD_COUNT = 7;
export const VOICE_SCROLLER_ITEM_SCORE = 50;
export const VOICE_SCROLLER_LEVEL_DISTANCE = 100;

const TARGET_SPAWN_SPACING = 0.46;
const TARGET_START_X = 1.18;
const TARGET_Y_JITTER = 0.08;

const clampTargetY = (value: number) => Math.min(0.8, Math.max(0.22, value));

const getRandomizedTargetY = (target: VoiceSideScrollerTarget) =>
  clampTargetY(target.y + (Math.random() - 0.5) * TARGET_Y_JITTER);

const shuffleVoiceScrollerTargets = (targets: VoiceSideScrollerTarget[]) => {
  const shuffledTargets = [...targets];

  for (let index = shuffledTargets.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    const currentTarget = shuffledTargets[index];

    shuffledTargets[index] = shuffledTargets[targetIndex];
    shuffledTargets[targetIndex] = currentTarget;
  }

  return shuffledTargets;
};

const createSpawnedTarget = (
  target: VoiceSideScrollerTarget,
  index: number,
): VoiceSideScrollerTarget => ({
  ...target,
  collected: false,
  x: TARGET_START_X + index * TARGET_SPAWN_SPACING + Math.random() * 0.22,
  y: getRandomizedTargetY(target),
});

export const VOICE_SCROLLER_DEMO_TARGETS: VoiceSideScrollerTarget[] = [
  {
    id: "target-leeuw",
    word: "leeuw",
    assetId: "leeuw",
    collectibleLabel: "leeuwster",
    x: 0.72,
    y: 0.54,
    collected: false,
  },
  {
    id: "target-olifant",
    word: "olifant",
    assetId: "olifant",
    collectibleLabel: "olifantster",
    x: 1.02,
    y: 0.72,
    collected: false,
  },
  {
    id: "target-aap",
    word: "aap",
    assetId: "aap",
    collectibleLabel: "aapster",
    x: 1.32,
    y: 0.42,
    collected: false,
  },
  {
    id: "target-hond",
    word: "hond",
    assetId: "hond",
    collectibleLabel: "hondster",
    x: 1.62,
    y: 0.78,
    collected: false,
  },
  {
    id: "target-bal",
    word: "bal",
    assetId: "bal",
    collectibleLabel: "balster",
    x: 1.92,
    y: 0.66,
    collected: false,
  },
  {
    id: "target-poes",
    word: "poes",
    assetId: "poes",
    collectibleLabel: "poesster",
    x: 2.22,
    y: 0.58,
    collected: false,
  },
  {
    id: "target-ballon",
    word: "ballon",
    assetId: "ballon",
    collectibleLabel: "ballonster",
    x: 2.52,
    y: 0.22,
    collected: false,
  },
];

export const VOICE_SCROLLER_DEMO_OBSTACLES: VoiceSideScrollerObstacle[] = [
  {
    collisionBox: { height: 0.07, offsetX: 0, offsetY: 0.01, width: 0.14 },
    height: 0.19,
    hit: false,
    id: "obstacle-cloud",
    kind: "cloud",
    label: "wolk",
    width: 0.28,
    x: 0.58,
    y: 0.25,
  },
  {
    collisionBox: { height: 0.07, offsetX: -0.01, offsetY: 0.01, width: 0.11 },
    height: 0.2,
    hit: false,
    id: "obstacle-seagull",
    kind: "seagull",
    label: "duif",
    width: 0.24,
    x: 1.14,
    y: 0.25,
  },
  {
    collisionBox: { height: 0.06, offsetX: -0.01, offsetY: 0.01, width: 0.16 },
    height: 0.17,
    hit: false,
    id: "obstacle-shark",
    kind: "shark",
    label: "tijger",
    width: 0.3,
    x: 1.7,
    y: 0.58,
  },
  {
    collisionBox: { height: 0.08, offsetX: 0.01, offsetY: 0, width: 0.11 },
    height: 0.23,
    hit: false,
    id: "obstacle-sea-lion",
    kind: "sea-lion",
    label: "jongleur",
    width: 0.25,
    x: 2.26,
    y: 0.8,
  },
];

export interface CreateInitialVoiceScrollerStateOptions {
  focusWords?: string[];
}

const createVoiceScrollerTargets = (focusWords?: string[]) => {
  if (!focusWords || focusWords.length === 0) {
    return VOICE_SCROLLER_DEMO_TARGETS.slice(0, VOICE_SCROLLER_FOCUS_WORD_COUNT);
  }

  const focusWordSet = new Set(focusWords);
  const selectedTargets = VOICE_SCROLLER_DEMO_TARGETS.filter((target) =>
    focusWordSet.has(target.word),
  );

  return selectedTargets.length > 0
    ? selectedTargets
    : VOICE_SCROLLER_DEMO_TARGETS.slice(0, VOICE_SCROLLER_FOCUS_WORD_COUNT);
};

const createRoundEducationState = (
  targets: VoiceSideScrollerTarget[],
): VoiceSideScrollerRoundEducationState => ({
  focusWords: targets.map((target) => target.word),
  wordObservations: Object.fromEntries(
    targets.map((target) => [
      target.id,
      {
        attempts: 0,
        audioRepeats: 0,
        heardTranscripts: [],
        hintsUsed: 0,
        needsPractice: false,
        recognized: false,
        targetId: target.id,
        word: target.word,
      },
    ]),
  ),
});

export const createInitialVoiceScrollerState = ({
  focusWords,
}: CreateInitialVoiceScrollerStateOptions = {}): VoiceSideScrollerGameState => {
  const targets = shuffleVoiceScrollerTargets(createVoiceScrollerTargets(focusWords)).map(
    createSpawnedTarget,
  );

  return {
    collisionSlowdownMs: 0,
    difficultyLevel: 1,
    distance: 0,
    education: createRoundEducationState(targets),
    elapsedMs: 0,
    gameplayFeedback: undefined,
    obstacleHits: 0,
    obstacles: VOICE_SCROLLER_DEMO_OBSTACLES.map((obstacle) => ({ ...obstacle })),
    playerY: 0.48,
    scrollX: 0,
    score: 0,
    speed: 1,
    stars: 0,
    status: "ready",
    targets,
  };
};

export const recycleVoiceScrollerTarget = (
  target: VoiceSideScrollerTarget,
  x: number,
): VoiceSideScrollerTarget => ({
  ...target,
  collected: false,
  x,
  y: getRandomizedTargetY(target),
});
