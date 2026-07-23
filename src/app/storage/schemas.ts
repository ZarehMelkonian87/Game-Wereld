import { z } from "zod";
import {
  createEventId,
  createGameId,
  createProfileId,
  createSessionId,
  createTaskId,
} from "../game-platform/contracts";

const utcDateTimeSchema = z.string().datetime({ offset: true });
const versionSchema = z.literal(1);

export const avatarSchema = z
  .object({
    color: z.string().min(1),
    emoji: z.string().min(1),
    id: z.string().min(1),
    name: z.string().min(1),
  })
  .strict();

export const profileRecordSchema = z
  .object({
    avatar: avatarSchema,
    contractVersion: versionSchema,
    createdAt: utcDateTimeSchema,
    id: z.string().min(1).transform(createProfileId),
    name: z.string().trim().min(1).max(80),
    updatedAt: utcDateTimeSchema,
  })
  .passthrough();

export const profileSettingsRecordSchema = z
  .object({
    contractVersion: versionSchema,
    musicEnabled: z.boolean(),
    profileId: z.string().min(1).transform(createProfileId),
    soundEnabled: z.boolean(),
    updatedAt: utcDateTimeSchema,
  })
  .passthrough();

const settingValueSchema = z.union([
  z.boolean(),
  z.number().finite(),
  z.string(),
  z.array(z.string()),
  z.record(z.string(), z.string()),
]);

export const settingsRecordSchema = z
  .object({
    contractVersion: versionSchema,
    profileId: z.string().min(1).transform(createProfileId),
    scope: z.string().min(1),
    updatedAt: utcDateTimeSchema,
    values: z.record(z.string(), settingValueSchema),
  })
  .passthrough();

export const gameSessionRecordSchema = z
  .object({
    contentVersion: z.string().min(1),
    contractVersion: versionSchema,
    endedAt: utcDateTimeSchema.optional(),
    gameId: z.string().min(1).transform(createGameId),
    id: z.string().min(1).transform(createSessionId),
    profileId: z.string().min(1).transform(createProfileId),
    startedAt: utcDateTimeSchema,
    status: z.enum(["started", "completed", "abandoned", "crashed"]),
  })
  .passthrough();

export const practiceEventEnvelopeSchema = z
  .object({
    assistance: z
      .array(z.enum(["instruction-replay", "visual-hint", "spoken-help"]))
      .refine((values) => new Set(values).size === values.length, "Hulptypen moeten uniek zijn."),
    attemptNumber: z.number().int().positive(),
    contentVersion: z.string().min(1),
    gameId: z.string().min(1).transform(createGameId),
    id: z.string().min(1).transform(createEventId),
    occurredAt: utcDateTimeSchema,
    outcome: z.enum(["correct", "incorrect", "skipped"]),
    profileId: z.string().min(1).transform(createProfileId),
    responseTimeMs: z.number().int().nonnegative().optional(),
    schemaVersion: versionSchema,
    sessionId: z.string().min(1).transform(createSessionId),
    skillIds: z.array(z.string().min(1)).min(1),
    taskId: z.string().min(1).transform(createTaskId),
  })
  .strict();

export const skillProgressSummarySchema = z
  .object({
    attempts: z.number().int().nonnegative(),
    incorrect: z.number().int().nonnegative(),
    independentCorrect: z.number().int().nonnegative(),
    skillId: z.string().min(1),
    skipped: z.number().int().nonnegative(),
    supportedCorrect: z.number().int().nonnegative(),
  })
  .strict();

export const progressProjectionSchema = z
  .object({
    attempts: z.number().int().nonnegative(),
    calculatedAt: utcDateTimeSchema,
    gameId: z.string().min(1).transform(createGameId),
    hintsUsed: z.number().int().nonnegative(),
    incorrect: z.number().int().nonnegative().default(0),
    independentCorrect: z.number().int().nonnegative(),
    instructionReplays: z.number().int().nonnegative().default(0),
    lastPracticedAt: utcDateTimeSchema.optional(),
    measuredResponses: z.number().int().nonnegative().default(0),
    profileId: z.string().min(1).transform(createProfileId),
    projectorVersion: z.number().int().positive(),
    score: z.number().nonnegative(),
    skillSummaries: z.array(skillProgressSummarySchema).default([]),
    skipped: z.number().int().nonnegative().default(0),
    sourceSelection: z
      .object({
        eventCount: z.number().int().nonnegative(),
        fromOccurredAt: utcDateTimeSchema.optional(),
        throughOccurredAt: utcDateTimeSchema.optional(),
      })
      .strict()
      .default({ eventCount: 0 }),
    spokenHelp: z.number().int().nonnegative().default(0),
    stars: z.number().int().nonnegative(),
    status: z.enum(["not-started", "practicing", "confident"]),
    supportedCorrect: z.number().int().nonnegative(),
    totalResponseTimeMs: z.number().int().nonnegative().default(0),
  })
  .passthrough();

export const databaseMetaRecordSchema = z
  .object({
    key: z.string().min(1),
    updatedAt: utcDateTimeSchema,
    value: z.unknown(),
  })
  .strict();

export const legacyGameProgressSchema = z
  .object({
    completed: z.boolean().catch(false),
    gameId: z.string().min(1),
    lastPlayed: utcDateTimeSchema.catch("1970-01-01T00:00:00.000Z"),
    score: z.number().nonnegative().catch(0),
    stars: z.number().int().nonnegative().catch(0),
  })
  .passthrough();

export const legacyProfileSchema = z
  .object({
    avatar: avatarSchema,
    createdAt: utcDateTimeSchema,
    id: z.string().min(1),
    name: z.string().trim().min(1).max(80),
    progress: z.array(legacyGameProgressSchema).catch([]),
    settings: z
      .object({
        musicEnabled: z.boolean().catch(true),
        soundEnabled: z.boolean().catch(true),
      })
      .catch({ musicEnabled: true, soundEnabled: true }),
  })
  .passthrough();

export const legacyProfilesSchema = z.array(legacyProfileSchema);

export const legacyGameSettingsSchema = z
  .object({
    audioEnabled: z.boolean().optional(),
    hintsEnabled: z.boolean().optional(),
    musicEnabled: z.boolean().optional(),
    reducedMotion: z.boolean().optional(),
  })
  .passthrough();

export const legacyRewardsSchema = z.array(z.string().min(1));

export const legacyPracticeProgressSchema = z
  .object({
    attempts: z.array(z.record(z.string(), z.unknown())).optional().default([]),
    totalSpeed: z.number().nonnegative().optional().default(0),
    totalWordStars: z.number().int().nonnegative().optional().default(0),
  })
  .passthrough();

export type DatabaseMetaRecord = z.infer<typeof databaseMetaRecordSchema>;
export type GameSessionRecord = z.infer<typeof gameSessionRecordSchema>;
export type PracticeEventEnvelope = z.infer<typeof practiceEventEnvelopeSchema>;
export type ProfileRecord = z.infer<typeof profileRecordSchema>;
export type ProfileSettingsRecord = z.infer<typeof profileSettingsRecordSchema>;
export type ProgressProjection = z.infer<typeof progressProjectionSchema>;
export type SettingsRecord = z.infer<typeof settingsRecordSchema>;
export type SkillProgressSummary = z.infer<typeof skillProgressSummarySchema>;
