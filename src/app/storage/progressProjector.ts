import type { GameId, ProfileId } from "../game-platform/contracts";
import {
  progressProjectionSchema,
  type PracticeEventEnvelope,
  type ProgressProjection,
  type SkillProgressSummary,
} from "./schemas";

export const PRACTICE_PROJECTOR_VERSION = 1;

export interface ProjectionSelection {
  fromOccurredAt?: string;
  throughOccurredAt?: string;
}

interface ProjectPracticeEventsInput {
  calculatedAt: string;
  events: PracticeEventEnvelope[];
  gameId: GameId;
  profileId: ProfileId;
  selection?: ProjectionSelection;
}

const getStatus = (attempts: number, independentCorrect: number) => {
  if (attempts === 0) return "not-started" as const;
  if (independentCorrect >= 3 && independentCorrect / attempts >= 0.6) {
    return "confident" as const;
  }
  return "practicing" as const;
};

const emptySkillSummary = (skillId: string): SkillProgressSummary => ({
  attempts: 0,
  incorrect: 0,
  independentCorrect: 0,
  skillId,
  skipped: 0,
  supportedCorrect: 0,
});

const updateSkillSummary = (
  current: SkillProgressSummary,
  event: PracticeEventEnvelope,
): SkillProgressSummary => {
  const independent = event.outcome === "correct" && event.assistance.length === 0;
  const supported = event.outcome === "correct" && event.assistance.length > 0;
  return {
    ...current,
    attempts: current.attempts + 1,
    incorrect: current.incorrect + (event.outcome === "incorrect" ? 1 : 0),
    independentCorrect: current.independentCorrect + (independent ? 1 : 0),
    skipped: current.skipped + (event.outcome === "skipped" ? 1 : 0),
    supportedCorrect: current.supportedCorrect + (supported ? 1 : 0),
  };
};

const selectEvents = ({
  events,
  gameId,
  profileId,
  selection,
}: Omit<ProjectPracticeEventsInput, "calculatedAt">) => {
  const unique = new Map<string, PracticeEventEnvelope>();
  events.forEach((event) => {
    if (event.profileId !== profileId || event.gameId !== gameId) return;
    if (selection?.fromOccurredAt && event.occurredAt < selection.fromOccurredAt) return;
    if (selection?.throughOccurredAt && event.occurredAt > selection.throughOccurredAt) return;
    unique.set(event.id, event);
  });
  return [...unique.values()].sort(
    (left, right) =>
      left.occurredAt.localeCompare(right.occurredAt) || left.id.localeCompare(right.id),
  );
};

export const createEmptyProgressProjection = (
  profileId: ProfileId,
  gameId: GameId,
  calculatedAt: string,
): ProgressProjection =>
  progressProjectionSchema.parse({
    attempts: 0,
    calculatedAt,
    gameId,
    hintsUsed: 0,
    incorrect: 0,
    independentCorrect: 0,
    instructionReplays: 0,
    measuredResponses: 0,
    profileId,
    projectorVersion: PRACTICE_PROJECTOR_VERSION,
    score: 0,
    skillSummaries: [],
    skipped: 0,
    sourceSelection: { eventCount: 0 },
    spokenHelp: 0,
    stars: 0,
    status: "not-started",
    supportedCorrect: 0,
    totalResponseTimeMs: 0,
  });

export const applyPracticeEvent = (
  current: ProgressProjection,
  event: PracticeEventEnvelope,
  calculatedAt = event.occurredAt,
): ProgressProjection => {
  if (event.profileId !== current.profileId || event.gameId !== current.gameId) {
    throw new TypeError("Oefenevent hoort niet bij de geselecteerde profiel-gameprojectie.");
  }
  const independent = event.outcome === "correct" && event.assistance.length === 0;
  const supported = event.outcome === "correct" && event.assistance.length > 0;
  const attempts = current.attempts + 1;
  const independentCorrect = current.independentCorrect + (independent ? 1 : 0);
  const skills = new Map(
    current.skillSummaries.map((summary) => [summary.skillId, summary] as const),
  );
  event.skillIds.forEach((skillId) => {
    skills.set(
      skillId,
      updateSkillSummary(skills.get(skillId) ?? emptySkillSummary(skillId), event),
    );
  });
  const responseTimeMs = event.responseTimeMs ?? 0;

  return progressProjectionSchema.parse({
    ...current,
    attempts,
    calculatedAt,
    hintsUsed: current.hintsUsed + (event.assistance.includes("visual-hint") ? 1 : 0),
    incorrect: current.incorrect + (event.outcome === "incorrect" ? 1 : 0),
    independentCorrect,
    instructionReplays:
      current.instructionReplays + (event.assistance.includes("instruction-replay") ? 1 : 0),
    lastPracticedAt:
      !current.lastPracticedAt || event.occurredAt > current.lastPracticedAt
        ? event.occurredAt
        : current.lastPracticedAt,
    measuredResponses: current.measuredResponses + (event.responseTimeMs === undefined ? 0 : 1),
    score: current.score + (independent ? 100 : supported ? 60 : 0),
    skillSummaries: [...skills.values()].sort((left, right) =>
      left.skillId.localeCompare(right.skillId),
    ),
    skipped: current.skipped + (event.outcome === "skipped" ? 1 : 0),
    sourceSelection: {
      eventCount: current.sourceSelection.eventCount + 1,
      fromOccurredAt:
        !current.sourceSelection.fromOccurredAt ||
        event.occurredAt < current.sourceSelection.fromOccurredAt
          ? event.occurredAt
          : current.sourceSelection.fromOccurredAt,
      throughOccurredAt:
        !current.sourceSelection.throughOccurredAt ||
        event.occurredAt > current.sourceSelection.throughOccurredAt
          ? event.occurredAt
          : current.sourceSelection.throughOccurredAt,
    },
    spokenHelp: current.spokenHelp + (event.assistance.includes("spoken-help") ? 1 : 0),
    stars: current.stars + (independent ? 1 : 0),
    status: getStatus(attempts, independentCorrect),
    supportedCorrect: current.supportedCorrect + (supported ? 1 : 0),
    totalResponseTimeMs: current.totalResponseTimeMs + responseTimeMs,
  });
};

export const projectPracticeEvents = ({
  calculatedAt,
  events,
  gameId,
  profileId,
  selection,
}: ProjectPracticeEventsInput): ProgressProjection =>
  selectEvents({ events, gameId, profileId, selection }).reduce(
    (projection, event) => applyPracticeEvent(projection, event, calculatedAt),
    createEmptyProgressProjection(profileId, gameId, calculatedAt),
  );
