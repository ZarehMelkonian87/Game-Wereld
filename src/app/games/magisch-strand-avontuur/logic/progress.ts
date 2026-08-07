import type {
  BezemEscapeProgress,
  ConceptProgress,
  LanguageDomain,
  SpatialConcept,
} from "../types";

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

const createConceptProgress = (): ConceptProgress => ({
  correctWithHelp: 0,
  correctWithoutHelp: 0,
  needsPractice: 0,
  practiced: 0,
});

export const createEmptyBezemEscapeProgress = (profileId: string): BezemEscapeProgress => ({
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
});
