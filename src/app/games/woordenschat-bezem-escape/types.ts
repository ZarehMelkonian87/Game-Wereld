export type BezemEscapeMode =
  | "listen-and-place"
  | "choose-word"
  | "broom-escape-run";

export type PlannedPracticeMode =
  | BezemEscapeMode
  | "active-vocabulary"
  | "sentence-repeat"
  | "word-structure"
  | "following-directions"
  | "word-category";

export type SpatialConcept =
  | "in"
  | "op"
  | "onder"
  | "boven"
  | "naast"
  | "tussen"
  | "links"
  | "rechts"
  | "midden"
  | "dichtbij"
  | "ver weg";

export type LanguageDomain =
  | "receptive-vocabulary"
  | "active-vocabulary"
  | "sentence-comprehension"
  | "sentence-repetition"
  | "word-structure"
  | "concepts-and-directions"
  | "word-categories"
  | "spatial-language"
  | "following-directions";

export type AssistanceLevel =
  | "none"
  | "hint"
  | "audio-repeat"
  | "adult-help";

export type SceneObjectCategory =
  | "dieren"
  | "voertuigen"
  | "strandspullen"
  | "plekken"
  | "natuur";

export type TaskDifficulty = 1 | 2 | 3 | 4 | 5;

export interface SceneObject {
  id: string;
  label: string;
  pluralLabel?: string;
  article: "de" | "het";
  category: SceneObjectCategory;
  emoji: string;
  assetId: string;
  assetPath: string;
  description: string;
  vocabularyLevel: TaskDifficulty;
  tags: string[];
}

export type SceneZoneKind =
  | "absolute"
  | "relative"
  | "horizontal"
  | "landmark";

export interface SceneZone {
  id: string;
  label: string;
  description: string;
  kind: SceneZoneKind;
  x: number;
  y: number;
  width: number;
  height: number;
  supportedConcepts: SpatialConcept[];
}

export interface RewardRule {
  speed: number;
  wordStars: number;
  bonusReason?: string;
  unlockRewardIds?: string[];
}

export interface InstructionFeedbackCopy {
  correct: string;
  almost?: string;
  tryAgain?: string;
  hint?: string;
  repeatAfterSuccess?: string;
}

interface BaseGameInstruction {
  id: string;
  mode: BezemEscapeMode;
  level: TaskDifficulty;
  prompt: string;
  audioText: string;
  targetObjectIds: string[];
  targetZoneIds: string[];
  spatialConcepts: SpatialConcept[];
  languageDomains: LanguageDomain[];
  tags: string[];
  hint: string;
  feedback: string;
  feedbackCopy: InstructionFeedbackCopy;
  reward: RewardRule;
}

export interface SceneBuilderInstruction extends BaseGameInstruction {
  mode: "listen-and-place";
  placement: {
    objectId: string;
    zoneId: string;
    relation: SpatialConcept;
    anchorObjectIds?: string[];
  };
}

export interface VocabularyChoiceInstruction extends BaseGameInstruction {
  mode: "choose-word";
  targetWord: string;
  answerOptions: string[];
  choiceCount: 2 | 3 | 4;
  distractorStrategy:
    | "different-category"
    | "same-theme"
    | "same-category";
}

export interface BroomRaceInstruction extends BaseGameInstruction {
  mode: "broom-escape-run";
  raceAction:
    | "fly-under"
    | "fly-over"
    | "go-left"
    | "go-right"
    | "collect"
    | "fly-between"
    | "follow-sequence";
  durationSeconds?: number;
}

export type GameInstruction =
  | SceneBuilderInstruction
  | VocabularyChoiceInstruction
  | BroomRaceInstruction;

export interface BroomReward {
  id: string;
  type:
    | "broom-color"
    | "broom"
    | "broom-trail"
    | "sticker"
    | "avatar-item";
  name: string;
  description: string;
  assetId?: string;
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

export type WorldSelectionStatus =
  | "open"
  | "komt_later"
  | "gesloten";

export type WorldIconId =
  | "waves"
  | "barn"
  | "paw"
  | "slide"
  | "book"
  | "planet";

export interface WorldThemeDefinition {
  label: string;
  colors: readonly string[];
  cardTone: string;
}

export interface WorldDefinition {
  id: string;
  title: string;
  theme: WorldThemeDefinition;
  status: WorldSelectionStatus;
  icon: WorldIconId;
  description: string;
  availableModes: readonly BezemEscapeMode[];
  plannedModes: readonly PlannedPracticeMode[];
  linkedGameWorldId?: GameWorld["id"];
}

export type PracticeResult =
  | "correct-without-help"
  | "correct-with-help"
  | "needs-more-practice";

export interface BezemEscapePracticeEvent {
  id: string;
  profileId: string;
  gameId: "woordenschat-bezem-escape";
  worldId: string;
  mode: BezemEscapeMode;
  instructionId: string;
  targetWords: string[];
  spatialConcepts: SpatialConcept[];
  languageDomains: LanguageDomain[];
  assistance: AssistanceLevel;
  result: PracticeResult;
  isCorrect: boolean;
  attempts: number;
  hintsUsed: number;
  audioRepeats: number;
  reactionTimeMs?: number;
  speedEarned: number;
  wordStarsEarned: number;
  playedAt: string;
}

export type BezemEscapeAttempt = BezemEscapePracticeEvent;

export interface ConceptProgress {
  practiced: number;
  correctWithoutHelp: number;
  correctWithHelp: number;
  needsPractice: number;
}

export interface BezemEscapeProgress {
  profileId: string;
  totalSpeed: number;
  totalWordStars: number;
  practicedWords: Record<string, number>;
  recognizedWords: Record<string, number>;
  activelyNamedWords: Record<string, number>;
  spatialConcepts: Record<SpatialConcept, ConceptProgress>;
  languageDomains: Record<LanguageDomain, ConceptProgress>;
  unlockedRewards: string[];
  attempts: BezemEscapePracticeEvent[];
}
