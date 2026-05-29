export type BezemEscapeMode =
  | "listen-and-place"
  | "choose-word"
  | "broom-escape-run";

export type SpatialConcept = "in" | "op" | "naast" | "onder" | "boven";

export type LanguageDomain =
  | "receptive-vocabulary"
  | "sentence-comprehension"
  | "active-vocabulary"
  | "spatial-concepts"
  | "following-directions";

export type AssistanceLevel = "none" | "hint" | "audio-repeat" | "adult-help";

export interface SceneObject {
  id: string;
  label: string;
  pluralLabel?: string;
  category: "dieren" | "voertuigen" | "strandspullen" | "plekken";
  emoji: string;
  description: string;
  vocabularyLevel: 1 | 2 | 3;
}

export interface SceneZone {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RewardRule {
  speed: number;
  wordStars: number;
  bonusReason?: string;
}

export interface GameInstruction {
  id: string;
  mode: BezemEscapeMode;
  level: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  audioText: string;
  targetObjectIds: string[];
  targetZoneIds: string[];
  spatialConcepts: SpatialConcept[];
  languageDomains: LanguageDomain[];
  answerOptions?: string[];
  hint: string;
  feedback: string;
  reward: RewardRule;
}

export interface BroomReward {
  id: string;
  type: "broom-color" | "sticker";
  name: string;
  unlockAfterWordStars: number;
}

export interface GameWorld {
  id: string;
  name: string;
  theme: "strand";
  recommendedAgeLabel: string;
  objects: SceneObject[];
  zones: SceneZone[];
  spatialConcepts: SpatialConcept[];
  instructions: GameInstruction[];
  rewards: BroomReward[];
}

export interface BezemEscapeAttempt {
  profileId: string;
  gameId: "woordenschat-bezem-escape";
  worldId: string;
  mode: BezemEscapeMode;
  instructionId: string;
  targetWords: string[];
  spatialConcepts: SpatialConcept[];
  assistance: AssistanceLevel;
  isCorrect: boolean;
  attempts: number;
  audioRepeats: number;
  reactionTimeMs?: number;
  speedEarned: number;
  wordStarsEarned: number;
  playedAt: string;
}

export interface BezemEscapeProgress {
  profileId: string;
  totalSpeed: number;
  totalWordStars: number;
  practicedWords: Record<string, number>;
  recognizedWords: Record<string, number>;
  spatialConcepts: Record<SpatialConcept, {
    correct: number;
    withHelp: number;
    needsPractice: number;
  }>;
  unlockedRewards: string[];
  attempts: BezemEscapeAttempt[];
}
