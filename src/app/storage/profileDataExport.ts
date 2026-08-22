import { z } from "zod";
import type { ProfileId } from "../game-platform/contracts";
import type { RepositoryBundle } from "./contracts";
import { skillProgressSummarySchema } from "./schemas";

export const PROFILE_PROGRESS_EXPORT_VERSION = 1;

const exportedEventSchema = z
  .object({
    assistance: z.array(z.enum(["instruction-replay", "visual-hint", "spoken-help"])),
    attemptNumber: z.number().int().positive(),
    contentVersion: z.string(),
    gameId: z.string(),
    occurredAt: z.string().datetime({ offset: true }),
    outcome: z.enum(["correct", "incorrect", "skipped"]),
    responseTimeMs: z.number().int().nonnegative().optional(),
    skillIds: z.array(z.string()),
    taskId: z.string(),
  })
  .strict();

export const profileProgressExportSchema = z
  .object({
    exportVersion: z.literal(PROFILE_PROGRESS_EXPORT_VERSION),
    generatedAt: z.string().datetime({ offset: true }),
    practiceEvents: z.array(exportedEventSchema),
    profileAlias: z.literal("local-profile"),
    projections: z.array(
      z.object({
        attempts: z.number().int().nonnegative(),
        gameId: z.string(),
        independentCorrect: z.number().int().nonnegative(),
        lastPracticedAt: z.string().datetime({ offset: true }).optional(),
        projectorVersion: z.number().int().positive(),
        skillSummaries: z.array(skillProgressSummarySchema),
        status: z.enum(["not-started", "practicing", "confident"]),
        supportedCorrect: z.number().int().nonnegative(),
      }),
    ),
    sessions: z.array(
      z.object({
        contentVersion: z.string(),
        endedAt: z.string().datetime({ offset: true }).optional(),
        gameId: z.string(),
        startedAt: z.string().datetime({ offset: true }),
        status: z.enum(["started", "completed", "abandoned", "crashed"]),
      }),
    ),
  })
  .strict();

export const createProfileProgressExport = async (
  repositories: RepositoryBundle,
  profileId: ProfileId,
  generatedAt = new Date().toISOString(),
) => {
  const [practiceEvents, projections, sessions] = await Promise.all([
    repositories.practice.listForProfile(profileId),
    repositories.progress.listForProfile(profileId),
    repositories.sessions.listForProfile(profileId),
  ]);
  return profileProgressExportSchema.parse({
    exportVersion: PROFILE_PROGRESS_EXPORT_VERSION,
    generatedAt,
    practiceEvents: practiceEvents.map((event) => ({
      assistance: event.assistance,
      attemptNumber: event.attemptNumber,
      contentVersion: event.contentVersion,
      gameId: event.gameId,
      occurredAt: event.occurredAt,
      outcome: event.outcome,
      responseTimeMs: event.responseTimeMs,
      skillIds: event.skillIds,
      taskId: event.taskId,
    })),
    profileAlias: "local-profile",
    projections: projections.map((projection) => ({
      attempts: projection.attempts,
      gameId: projection.gameId,
      independentCorrect: projection.independentCorrect,
      lastPracticedAt: projection.lastPracticedAt,
      projectorVersion: projection.projectorVersion,
      skillSummaries: projection.skillSummaries,
      status: projection.status,
      supportedCorrect: projection.supportedCorrect,
    })),
    sessions: sessions.map((session) => ({
      contentVersion: session.contentVersion,
      endedAt: session.endedAt,
      gameId: session.gameId,
      startedAt: session.startedAt,
      status: session.status,
    })),
  });
};
