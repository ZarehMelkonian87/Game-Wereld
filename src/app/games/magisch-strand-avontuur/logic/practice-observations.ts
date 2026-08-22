import type { PracticeObservation } from "../../../game-platform/contracts";
import type { LanguageDomain, SpatialConcept } from "../types";

interface AssistanceInput {
  instructionReplays: number;
  spokenHelp: number;
  visualHints: number;
}

interface InstructionObservationInput extends AssistanceInput {
  attemptNumber: number;
  languageDomains: LanguageDomain[];
  outcome: PracticeObservation["outcome"];
  responseTimeMs?: number;
  spatialConcepts: SpatialConcept[];
  taskId: string;
  vocabularyId: string;
}

interface VoiceObservationInput extends AssistanceInput {
  attemptNumber: number;
  outcome: PracticeObservation["outcome"];
  responseTimeMs?: number;
  targetId: string;
  taskId: string;
}

export const createAssistance = ({
  instructionReplays,
  spokenHelp,
  visualHints,
}: AssistanceInput): PracticeObservation["assistance"] => [
  ...(instructionReplays > 0 ? (["instruction-replay"] as const) : []),
  ...(visualHints > 0 ? (["visual-hint"] as const) : []),
  ...(spokenHelp > 0 ? (["spoken-help"] as const) : []),
];

export const createInstructionPracticeObservation = ({
  attemptNumber,
  instructionReplays,
  languageDomains,
  outcome,
  responseTimeMs,
  spatialConcepts,
  spokenHelp,
  taskId,
  visualHints,
  vocabularyId,
}: InstructionObservationInput): PracticeObservation => ({
  assistance: createAssistance({ instructionReplays, spokenHelp, visualHints }),
  attemptNumber,
  outcome,
  responseTimeMs:
    responseTimeMs !== undefined ? Math.round(Math.max(0, responseTimeMs)) : undefined,
  skillIds: [
    ...new Set([
      ...languageDomains,
      ...spatialConcepts.map((concept) => `spatial:${concept}`),
      `vocabulary:${vocabularyId}`,
    ]),
  ],
  taskId,
});

export const createVoicePracticeObservation = ({
  attemptNumber,
  instructionReplays,
  outcome,
  responseTimeMs,
  spokenHelp,
  targetId,
  taskId,
  visualHints,
}: VoiceObservationInput): PracticeObservation => ({
  assistance: createAssistance({ instructionReplays, spokenHelp, visualHints }),
  attemptNumber,
  outcome,
  responseTimeMs:
    responseTimeMs !== undefined ? Math.round(Math.max(0, responseTimeMs)) : undefined,
  skillIds: ["active-vocabulary", `vocabulary:${targetId}`],
  taskId,
});
