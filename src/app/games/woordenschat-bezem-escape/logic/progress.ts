import type {
  AssistanceLevel,
  BezemEscapePracticeEvent,
  BezemEscapeProgress,
  BezemEscapeMode,
  ConceptProgress,
  LanguageDomain,
  PracticeResult,
  SpatialConcept,
} from "../types";

export const BEZEM_ESCAPE_GAME_ID = "woordenschat-bezem-escape";

const spatialConcepts: SpatialConcept[] = [
  "in",
  "op",
  "onder",
  "boven",
  "naast",
  "tussen",
  "links",
  "rechts",
  "midden",
  "dichtbij",
  "ver weg",
];

const languageDomains: LanguageDomain[] = [
  "receptive-vocabulary",
  "active-vocabulary",
  "sentence-comprehension",
  "sentence-repetition",
  "word-structure",
  "concepts-and-directions",
  "word-categories",
  "spatial-language",
  "following-directions",
];

export interface PracticeEventInput {
  assistance: AssistanceLevel;
  attempts: number;
  audioRepeats: number;
  hintsUsed: number;
  id?: string;
  instructionId: string;
  isCorrect: boolean;
  languageDomains: LanguageDomain[];
  mode: BezemEscapeMode;
  reactionTimeMs?: number;
  result: PracticeResult;
  spatialConcepts: SpatialConcept[];
  speedEarned: number;
  targetWords: string[];
  wordStarsEarned: number;
}

export interface RaceProgressSummaryInput {
  audioRepeats: number;
  correctActions: number;
  hintsUsed: number;
  mistakes: number;
  playedAt?: string;
  practicedConcepts: string[];
  practicedWords: string[];
  resultId?: string;
  speedEarned: number;
  starsEarned: number;
}

export type AdultRating = "good" | "help" | "partial";

function getProgressStorageKey(profileId: string) {
  return `woordenschat-bezem-escape:${profileId}:progress`;
}

function createConceptProgress(): ConceptProgress {
  return {
    correctWithHelp: 0,
    correctWithoutHelp: 0,
    needsPractice: 0,
    practiced: 0,
  };
}

function createEmptyProgress(profileId: string): BezemEscapeProgress {
  return {
    attempts: [],
    activelyNamedWords: {},
    languageDomains: Object.fromEntries(
      languageDomains.map((domain) => [domain, createConceptProgress()]),
    ) as Record<LanguageDomain, ConceptProgress>,
    practicedWords: {},
    profileId,
    recognizedWords: {},
    spatialConcepts: Object.fromEntries(
      spatialConcepts.map((concept) => [concept, createConceptProgress()]),
    ) as Record<SpatialConcept, ConceptProgress>,
    totalSpeed: 0,
    totalWordStars: 0,
    unlockedRewards: [],
  };
}

function normalizeProgress(profileId: string, progress: Partial<BezemEscapeProgress>) {
  const emptyProgress = createEmptyProgress(profileId);

  return {
    ...emptyProgress,
    ...progress,
    attempts: Array.isArray(progress.attempts) ? progress.attempts : [],
    languageDomains: {
      ...emptyProgress.languageDomains,
      ...(progress.languageDomains ?? {}),
    },
    spatialConcepts: {
      ...emptyProgress.spatialConcepts,
      ...(progress.spatialConcepts ?? {}),
    },
  };
}

function incrementCounter(record: Record<string, number>, key: string, amount = 1) {
  record[key] = (record[key] ?? 0) + amount;
}

function incrementConceptProgress(progress: ConceptProgress, result: PracticeResult) {
  progress.practiced += 1;

  if (result === "correct-without-help") {
    progress.correctWithoutHelp += 1;
    return;
  }

  if (result === "correct-with-help") {
    progress.correctWithHelp += 1;
    return;
  }

  progress.needsPractice += 1;
}

function mapRatingToResult(rating: AdultRating): PracticeResult {
  if (rating === "good") {
    return "correct-without-help";
  }

  if (rating === "help") {
    return "correct-with-help";
  }

  return "needs-more-practice";
}

function mapRatingToAssistance(rating: AdultRating): AssistanceLevel {
  return rating === "good" ? "none" : "adult-help";
}

export function readBezemEscapeProgress(profileId: string) {
  if (typeof window === "undefined") {
    return createEmptyProgress(profileId);
  }

  const rawProgress = window.localStorage.getItem(getProgressStorageKey(profileId));

  if (!rawProgress) {
    return createEmptyProgress(profileId);
  }

  try {
    return normalizeProgress(profileId, JSON.parse(rawProgress) as Partial<BezemEscapeProgress>);
  } catch {
    return createEmptyProgress(profileId);
  }
}

export function saveBezemEscapeProgress(progress: BezemEscapeProgress) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getProgressStorageKey(progress.profileId),
    JSON.stringify(progress),
  );
}

export function resetBezemEscapeProgress(profileId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getProgressStorageKey(profileId));
}

export function appendPracticeEvent(profileId: string, input: PracticeEventInput) {
  const progress = readBezemEscapeProgress(profileId);
  const eventId =
    input.id ??
    `${input.mode}:${input.instructionId}:${Date.now()}:${Math.round(Math.random() * 10000)}`;

  if (progress.attempts.some((attempt) => attempt.id === eventId)) {
    return progress;
  }

  const event: BezemEscapePracticeEvent = {
    assistance: input.assistance,
    attempts: input.attempts,
    audioRepeats: input.audioRepeats,
    gameId: BEZEM_ESCAPE_GAME_ID,
    hintsUsed: input.hintsUsed,
    id: eventId,
    instructionId: input.instructionId,
    isCorrect: input.isCorrect,
    languageDomains: input.languageDomains,
    mode: input.mode,
    playedAt: new Date().toISOString(),
    profileId,
    reactionTimeMs: input.reactionTimeMs,
    result: input.result,
    spatialConcepts: input.spatialConcepts,
    speedEarned: input.speedEarned,
    targetWords: input.targetWords,
    wordStarsEarned: input.wordStarsEarned,
  };

  event.targetWords.forEach((word) => incrementCounter(progress.practicedWords, word));

  if (event.mode === "choose-word" && event.isCorrect) {
    event.targetWords.forEach((word) => incrementCounter(progress.recognizedWords, word));
  }

  event.spatialConcepts.forEach((concept) => {
    incrementConceptProgress(progress.spatialConcepts[concept], event.result);
  });

  event.languageDomains.forEach((domain) => {
    incrementConceptProgress(progress.languageDomains[domain], event.result);
  });

  progress.totalSpeed += event.speedEarned;
  progress.totalWordStars += event.wordStarsEarned;
  progress.attempts.push(event);
  saveBezemEscapeProgress(progress);

  return progress;
}

export function recordActiveVocabularyObservation(profileId: string, params: {
  instructionId: string;
  rating: AdultRating;
  word: string;
}) {
  const progress = readBezemEscapeProgress(profileId);
  incrementCounter(progress.activelyNamedWords, params.word);
  saveBezemEscapeProgress(progress);

  return appendPracticeEvent(profileId, {
    assistance: mapRatingToAssistance(params.rating),
    attempts: 1,
    audioRepeats: 0,
    hintsUsed: params.rating === "good" ? 0 : 1,
    instructionId: `${params.instructionId}:active-vocabulary:${params.rating}`,
    isCorrect: params.rating !== "partial",
    languageDomains: ["active-vocabulary"],
    mode: "listen-and-place",
    result: mapRatingToResult(params.rating),
    spatialConcepts: [],
    speedEarned: 0,
    targetWords: [params.word],
    wordStarsEarned: 0,
  });
}

export function recordSentenceRepeatObservation(profileId: string, params: {
  instructionId: string;
  rating: AdultRating;
  sentence: string;
}) {
  return appendPracticeEvent(profileId, {
    assistance: mapRatingToAssistance(params.rating),
    attempts: 1,
    audioRepeats: 0,
    hintsUsed: params.rating === "good" ? 0 : 1,
    instructionId: `${params.instructionId}:sentence-repeat:${params.rating}`,
    isCorrect: params.rating !== "partial",
    languageDomains: ["sentence-repetition"],
    mode: "listen-and-place",
    result: mapRatingToResult(params.rating),
    spatialConcepts: [],
    speedEarned: 0,
    targetWords: [params.sentence],
    wordStarsEarned: 0,
  });
}

export function recordRaceProgressSummary(profileId: string, input: RaceProgressSummaryInput) {
  const resultId = input.resultId ?? `race-summary:${input.playedAt ?? Date.now()}`;
  const result: PracticeResult =
    input.correctActions > 0
      ? input.hintsUsed > 0 || input.mistakes > 0
        ? "correct-with-help"
        : "correct-without-help"
      : "needs-more-practice";

  return appendPracticeEvent(profileId, {
    assistance: input.hintsUsed > 0 ? "hint" : "none",
    attempts: input.correctActions + input.mistakes,
    audioRepeats: input.audioRepeats,
    hintsUsed: input.hintsUsed,
    id: `race-summary:${resultId}`,
    instructionId: "race-summary",
    isCorrect: input.correctActions > 0,
    languageDomains: [
      "concepts-and-directions",
      "following-directions",
      "sentence-comprehension",
      "spatial-language",
    ],
    mode: "broom-escape-run",
    result,
    spatialConcepts: input.practicedConcepts.filter((concept): concept is SpatialConcept =>
      spatialConcepts.includes(concept as SpatialConcept),
    ),
    speedEarned: input.speedEarned,
    targetWords: input.practicedWords,
    wordStarsEarned: input.starsEarned,
  });
}
