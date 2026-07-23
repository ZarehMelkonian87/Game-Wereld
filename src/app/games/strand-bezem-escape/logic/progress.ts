import type {
  AssistanceLevel,
  BezemEscapePracticeEvent,
  BezemEscapeProgress,
  BezemEscapeMode,
  ConceptProgress,
  LanguageDomain,
  PracticeResult,
  SpatialConcept,
  VoiceSideScrollerObservationDetails,
} from "../types";

export const BEZEM_ESCAPE_GAME_ID = "strand-bezem-escape";

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
  activeSpatialConcept?: SpatialConcept;
  activelyNamedWord?: string;
  assistance: AssistanceLevel;
  attempts: number;
  audioRepeats: number;
  autoExecuted?: boolean;
  hintsUsed: number;
  id?: string;
  instructionId: string;
  isCorrect: boolean;
  languageDomains: LanguageDomain[];
  mode: BezemEscapeMode;
  reactionTimeMs?: number;
  result: PracticeResult;
  selfMadeSentence?: boolean;
  spatialConcepts: SpatialConcept[];
  speedEarned: number;
  spokenTranscript?: string;
  targetWords: string[];
  voiceSideScroller?: VoiceSideScrollerObservationDetails;
  wordStarsEarned: number;
  worldId?: string;
}

export type AdultRating = "good" | "help" | "partial";

export interface SpeakAndPlaceObservationInput {
  assistance: AssistanceLevel;
  audioRepeats: number;
  autoExecuted: boolean;
  hintsUsed: number;
  id?: string;
  instructionId: string;
  isCorrect: boolean;
  languageDomains?: LanguageDomain[];
  result: PracticeResult;
  selfMadeSentence: boolean;
  spatialConcept?: SpatialConcept;
  speedEarned: number;
  targetWord?: string;
  transcript?: string;
  wordStarsEarned: number;
  worldId?: string;
}

export interface VoiceSideScrollerObservationInput {
  audioRepeats: number;
  hintsUsed: number;
  id?: string;
  instructionId: string;
  isRecognized: boolean;
  spokenTranscript?: string;
  targetWord: string;
  wordAttempts: number;
  wordStarsEarned: number;
}

function getProgressStorageKey(profileId: string) {
  return `strand-bezem-escape:${profileId}:progress`;
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
    activeSpatialConcepts: Object.fromEntries(
      spatialConcepts.map((concept) => [concept, 0]),
    ) as Record<SpatialConcept, number>,
    attempts: [],
    activelyNamedWords: {},
    autoExecutedSpokenCommands: 0,
    languageDomains: Object.fromEntries(
      languageDomains.map((domain) => [domain, createConceptProgress()]),
    ) as Record<LanguageDomain, ConceptProgress>,
    misunderstoodSpeechAttempts: 0,
    practicedWords: {},
    profileId,
    recognizedWords: {},
    selfMadeSentences: 0,
    selfMadeSentencesWithHelp: 0,
    selfMadeSentencesWithoutHelp: 0,
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
    activeSpatialConcepts: {
      ...emptyProgress.activeSpatialConcepts,
      ...(progress.activeSpatialConcepts ?? {}),
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

  window.localStorage.setItem(getProgressStorageKey(progress.profileId), JSON.stringify(progress));
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
    selfMadeSentence: input.selfMadeSentence,
    spatialConcepts: input.spatialConcepts,
    speedEarned: input.speedEarned,
    spokenTranscript: input.spokenTranscript,
    targetWords: input.targetWords,
    voiceSideScroller: input.voiceSideScroller,
    wordStarsEarned: input.wordStarsEarned,
    worldId: input.worldId ?? "beach-world-1",
    activeSpatialConcept: input.activeSpatialConcept,
    activelyNamedWord: input.activelyNamedWord,
    autoExecuted: input.autoExecuted,
  };

  event.targetWords.forEach((word) => incrementCounter(progress.practicedWords, word));

  if ((event.mode === "choose-word" || event.mode === "zeg-en-vlieg") && event.isCorrect) {
    event.targetWords.forEach((word) => incrementCounter(progress.recognizedWords, word));
  }

  if (event.mode === "zeg-en-vlieg") {
    if (event.activelyNamedWord && event.isCorrect) {
      incrementCounter(progress.activelyNamedWords, event.activelyNamedWord);
    }

    if (!event.isCorrect) {
      progress.misunderstoodSpeechAttempts += 1;
    }
  }

  if (event.mode === "zeg-en-bouw") {
    if (event.activelyNamedWord) {
      incrementCounter(progress.activelyNamedWords, event.activelyNamedWord);
    }

    if (event.activeSpatialConcept) {
      incrementCounter(progress.activeSpatialConcepts, event.activeSpatialConcept);
    }

    if (event.selfMadeSentence) {
      progress.selfMadeSentences += 1;

      if (event.assistance === "none") {
        progress.selfMadeSentencesWithoutHelp += 1;
      } else {
        progress.selfMadeSentencesWithHelp += 1;
      }
    }

    if (event.autoExecuted && event.isCorrect) {
      progress.autoExecutedSpokenCommands += 1;
    }

    if (!event.isCorrect && !event.autoExecuted) {
      progress.misunderstoodSpeechAttempts += 1;
    }
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

export function recordActiveVocabularyObservation(
  profileId: string,
  params: {
    instructionId: string;
    rating: AdultRating;
    word: string;
  },
) {
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

export function recordSentenceRepeatObservation(
  profileId: string,
  params: {
    instructionId: string;
    rating: AdultRating;
    sentence: string;
  },
) {
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

export function recordSpeakAndPlaceObservation(
  profileId: string,
  input: SpeakAndPlaceObservationInput,
) {
  const languageDomainSet = new Set<LanguageDomain>([
    "active-vocabulary",
    "concepts-and-directions",
    "sentence-comprehension",
    "spatial-language",
    ...(input.languageDomains ?? []),
  ]);

  return appendPracticeEvent(profileId, {
    activeSpatialConcept: input.spatialConcept,
    activelyNamedWord: input.targetWord,
    assistance: input.assistance,
    attempts: 1,
    audioRepeats: input.audioRepeats,
    autoExecuted: input.autoExecuted,
    hintsUsed: input.hintsUsed,
    id: input.id,
    instructionId: input.instructionId,
    isCorrect: input.isCorrect,
    languageDomains: [...languageDomainSet],
    mode: "zeg-en-bouw",
    result: input.result,
    selfMadeSentence: input.selfMadeSentence,
    spatialConcepts: input.spatialConcept ? [input.spatialConcept] : [],
    speedEarned: input.speedEarned,
    spokenTranscript: input.transcript,
    targetWords: input.targetWord ? [input.targetWord] : [],
    wordStarsEarned: input.wordStarsEarned,
    worldId: input.worldId,
  });
}

const getVoiceSideScrollerAssistance = ({
  audioRepeats,
  hintsUsed,
}: Pick<VoiceSideScrollerObservationInput, "audioRepeats" | "hintsUsed">): AssistanceLevel => {
  if (hintsUsed > 0) {
    return "hint";
  }

  if (audioRepeats > 0) {
    return "audio-repeat";
  }

  return "none";
};

export function recordVoiceSideScrollerWordObservation(
  profileId: string,
  input: VoiceSideScrollerObservationInput,
) {
  const assistance = getVoiceSideScrollerAssistance(input);
  const result: PracticeResult = input.isRecognized
    ? assistance === "none"
      ? "correct-without-help"
      : "correct-with-help"
    : "needs-more-practice";

  return appendPracticeEvent(profileId, {
    activelyNamedWord: input.isRecognized ? input.targetWord : undefined,
    assistance,
    attempts: input.wordAttempts,
    audioRepeats: input.audioRepeats,
    hintsUsed: input.hintsUsed,
    id: input.id,
    instructionId: input.instructionId,
    isCorrect: input.isRecognized,
    languageDomains: ["active-vocabulary", "receptive-vocabulary"],
    mode: "zeg-en-vlieg",
    result,
    spatialConcepts: [],
    speedEarned: input.isRecognized ? 1 : 0,
    spokenTranscript: input.spokenTranscript,
    targetWords: [input.targetWord],
    voiceSideScroller: {
      audioRepeats: input.audioRepeats,
      hintsUsed: input.hintsUsed,
      isRecognized: input.isRecognized,
      spokenTranscript: input.spokenTranscript,
      targetWord: input.targetWord,
      wordAttempts: input.wordAttempts,
    },
    wordStarsEarned: input.wordStarsEarned,
    worldId: "beach-world-1",
  });
}
