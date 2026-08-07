import { createGameId, createProfileId } from "../game-platform/contracts";
import { createStorageError } from "./contracts";
import type { GameWorldDatabase } from "./database";
import {
  legacyGameSettingsSchema,
  legacyPracticeProgressSchema,
  legacyProfilesSchema,
  legacyRewardsSchema,
  practiceEventEnvelopeSchema,
  profileRecordSchema,
  profileSettingsRecordSchema,
  progressProjectionSchema,
  settingsRecordSchema,
  type PracticeEventEnvelope,
  type SettingsRecord,
} from "./schemas";

export interface LegacyStorageReader {
  getItem: (key: string) => string | null;
}

export interface LegacyMigrationResult {
  fingerprint: string;
  migratedEvents: number;
  migratedProfiles: number;
  status: "migrated" | "unchanged";
}

const migrationMetaKey = "legacy-import-v1";
const profilesKey = "kids-game-profiles";

const fingerprint = (values: string[]) => {
  let hash = 2166136261;
  values
    .join("\u001f")
    .split("")
    .forEach((character) => {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    });
  return `fnv1a-${(hash >>> 0).toString(16)}`;
};

const parseJson = (raw: string | null): unknown => {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw createStorageError(
      "migration-failed",
      "Bestaande browserdata bevat ongeldige JSON en is niet overschreven.",
    );
  }
};

const createSettingsRecord = (
  profileId: string,
  scope: string,
  values: SettingsRecord["values"],
  updatedAt: string,
) =>
  settingsRecordSchema.parse({
    contractVersion: 1,
    profileId,
    scope,
    updatedAt,
    values,
  });

const mapLegacyPracticeEvents = (
  raw: string | null,
  profileId: string,
  gameId: string,
): PracticeEventEnvelope[] => {
  const parsed = parseJson(raw);
  if (parsed === undefined) return [];
  if (!Array.isArray(parsed)) {
    throw createStorageError(
      "migration-failed",
      "Bestaande oefenevents hebben een ongeldige payloadvorm en zijn niet overschreven.",
    );
  }
  return parsed.map((value) => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw createStorageError(
        "migration-failed",
        "Een bestaand oefenevent is corrupt en is niet overschreven.",
      );
    }
    const attempts = Number(Reflect.get(value, "attempts"));
    const recordedAt = Reflect.get(value, "recordedAt") ?? Reflect.get(value, "playedAt");
    const taskId = Reflect.get(value, "taskId") ?? Reflect.get(value, "instructionId");
    const sessionId = Reflect.get(value, "sessionId");
    const eventId = Reflect.get(value, "eventId") ?? Reflect.get(value, "id");
    const result = Reflect.get(value, "result");
    const assistance = Reflect.get(value, "assistance");
    const targetWords = Reflect.get(value, "targetWords");
    const candidate = practiceEventEnvelopeSchema.safeParse({
      assistance:
        assistance === "audio-repeat"
          ? ["instruction-replay"]
          : assistance === "hint"
            ? ["visual-hint"]
            : assistance === "spoken-help"
              ? ["spoken-help"]
              : [],
      attemptNumber: Number.isInteger(attempts) && attempts > 0 ? attempts : 1,
      contentVersion: "legacy-import-v1",
      gameId,
      id: typeof eventId === "string" ? eventId : crypto.randomUUID(),
      occurredAt: typeof recordedAt === "string" ? recordedAt : "1970-01-01T00:00:00.000Z",
      outcome:
        result === "needs-more-practice"
          ? "incorrect"
          : Reflect.get(value, "isCorrect")
            ? "correct"
            : "incorrect",
      profileId,
      schemaVersion: 1,
      sessionId: typeof sessionId === "string" ? sessionId : `legacy-${profileId}`,
      skillIds:
        Array.isArray(targetWords) && targetWords.length > 0
          ? targetWords.filter((word): word is string => typeof word === "string")
          : ["legacy-unknown"],
      taskId: typeof taskId === "string" ? taskId : "legacy-task",
    });
    if (!candidate.success) {
      throw createStorageError(
        "migration-failed",
        "Een bestaand oefenevent kon niet veilig worden gemigreerd.",
      );
    }
    return candidate.data;
  });
};

export const migrateLegacyStorage = async (
  database: GameWorldDatabase,
  source: LegacyStorageReader,
): Promise<LegacyMigrationResult> => {
  const rawProfiles = source.getItem(profilesKey);
  const parsedProfiles = rawProfiles
    ? legacyProfilesSchema.safeParse(parseJson(rawProfiles))
    : null;
  if (parsedProfiles && !parsedProfiles.success) {
    throw createStorageError(
      "migration-failed",
      "Bestaande profieldata is corrupt. De oude bron is behouden voor diagnose of export.",
    );
  }
  const legacyProfiles = parsedProfiles?.data ?? [];
  const sourceValues = [rawProfiles ?? ""];
  legacyProfiles.forEach((profile) => {
    [
      `strand-bezem-escape:${profile.id}:settings`,
      `strand-bezem-escape:${profile.id}:unlocked-rewards`,
      `strand-bezem-escape:${profile.id}:selected-world`,
      `strand-bezem-escape:${profile.id}:voice-privacy:2026-06-01`,
      `strand-bezem-escape:${profile.id}:progress`,
      `game-runtime:practice:${profile.id}:strand-bezem-escape`,
    ].forEach((key) => sourceValues.push(source.getItem(key) ?? ""));
  });
  const sourceFingerprint = fingerprint(sourceValues);
  const currentMeta = await database.tables.databaseMeta.get(migrationMetaKey);
  if (
    typeof currentMeta?.value === "object" &&
    currentMeta.value !== null &&
    Reflect.get(currentMeta.value, "fingerprint") === sourceFingerprint &&
    Reflect.get(currentMeta.value, "status") === "complete"
  ) {
    return {
      fingerprint: sourceFingerprint,
      migratedEvents: 0,
      migratedProfiles: 0,
      status: "unchanged",
    };
  }

  const now = new Date().toISOString();
  const events: PracticeEventEnvelope[] = [];
  await database.db.transaction(
    "rw",
    [
      database.tables.profiles,
      database.tables.profileSettings,
      database.tables.settings,
      database.tables.practiceEvents,
      database.tables.progressProjections,
      database.tables.databaseMeta,
    ],
    async () => {
      for (const legacyProfile of legacyProfiles) {
        const profileId = createProfileId(legacyProfile.id);
        await database.tables.profiles.put(
          profileRecordSchema.parse({
            avatar: legacyProfile.avatar,
            contractVersion: 1,
            createdAt: legacyProfile.createdAt,
            id: profileId,
            name: legacyProfile.name,
            updatedAt: now,
          }),
        );
        await database.tables.profileSettings.put(
          profileSettingsRecordSchema.parse({
            contractVersion: 1,
            musicEnabled: legacyProfile.settings.musicEnabled,
            profileId,
            soundEnabled: legacyProfile.settings.soundEnabled,
            updatedAt: now,
          }),
        );

        const gameSettings =
          source.getItem(`magisch-strand-avontuur:${profileId}:settings`) ??
          source.getItem(`strand-bezem-escape:${profileId}:settings`);
        if (gameSettings) {
          if (!legacyGameSettingsSchema.safeParse(parseJson(gameSettings)).success) {
            throw createStorageError(
              "migration-failed",
              "Bestaande game-instellingen zijn corrupt en zijn niet overschreven.",
            );
          }
          await database.tables.settings.put(
            createSettingsRecord(
              profileId,
              "magisch-strand-avontuur.preferences",
              { raw: gameSettings },
              now,
            ),
          );
        }
        const rewards =
          source.getItem(`magisch-strand-avontuur:${profileId}:unlocked-rewards`) ??
          source.getItem(`strand-bezem-escape:${profileId}:unlocked-rewards`);
        if (rewards) {
          if (!legacyRewardsSchema.safeParse(parseJson(rewards)).success) {
            throw createStorageError(
              "migration-failed",
              "Bestaande beloningen zijn corrupt en zijn niet overschreven.",
            );
          }
          await database.tables.settings.put(
            createSettingsRecord(profileId, "magisch-strand-avontuur.rewards", { raw: rewards }, now),
          );
        }
        const selectedWorld =
          source.getItem(`magisch-strand-avontuur:${profileId}:selected-world`) ??
          source.getItem(`strand-bezem-escape:${profileId}:selected-world`);
        if (selectedWorld) {
          await database.tables.settings.put(
            createSettingsRecord(
              profileId,
              "magisch-strand-avontuur.world",
              { raw: selectedWorld },
              now,
            ),
          );
        }
        const privacyAccepted =
          source.getItem(`magisch-strand-avontuur:${profileId}:voice-privacy:2026-06-01`) ===
            "accepted" ||
          source.getItem(`strand-bezem-escape:${profileId}:voice-privacy:2026-06-01`) ===
            "accepted";
        if (privacyAccepted) {
          await database.tables.settings.put(
            createSettingsRecord(
              profileId,
              "magisch-strand-avontuur.voice-privacy",
              { raw: "accepted" },
              now,
            ),
          );
        }
        for (const progress of legacyProfile.progress) {
          const gameId = createGameId(progress.gameId);
          await database.tables.progressProjections.put(
            progressProjectionSchema.parse({
              attempts: progress.completed ? 1 : 0,
              calculatedAt: now,
              gameId,
              hintsUsed: 0,
              independentCorrect: progress.completed ? 1 : 0,
              lastPracticedAt: progress.lastPlayed,
              profileId,
              projectorVersion: 1,
              score: progress.score,
              stars: progress.stars,
              status: progress.completed ? "confident" : "practicing",
              supportedCorrect: 0,
            }),
          );
        }
        const rawLegacyGameProgress =
          source.getItem(`magisch-strand-avontuur:${profileId}:progress`) ??
          source.getItem(`strand-bezem-escape:${profileId}:progress`);
        const parsedLegacyGameProgress = rawLegacyGameProgress
          ? legacyPracticeProgressSchema.safeParse(parseJson(rawLegacyGameProgress))
          : null;
        if (parsedLegacyGameProgress && !parsedLegacyGameProgress.success) {
          throw createStorageError(
            "migration-failed",
            "Bestaande gameprogressie is corrupt en is niet overschreven.",
          );
        }
        const legacyGameProgress = parsedLegacyGameProgress?.data;
        const legacyAttempts = legacyGameProgress?.attempts ?? [];
        if (legacyGameProgress) {
          const lastAttempt = legacyAttempts[legacyAttempts.length - 1];
          const lastPracticedAt =
            typeof lastAttempt === "object" &&
            lastAttempt !== null &&
            typeof Reflect.get(lastAttempt, "playedAt") === "string"
              ? Reflect.get(lastAttempt, "playedAt")
              : now;
          await database.tables.progressProjections.put(
            progressProjectionSchema.parse({
              attempts: legacyAttempts.length,
              calculatedAt: now,
              gameId: "magisch-strand-avontuur",
              hintsUsed: legacyAttempts.reduce(
                (total, attempt) =>
                  total +
                  (typeof attempt === "object" && attempt !== null
                    ? Number(Reflect.get(attempt, "hintsUsed")) || 0
                    : 0),
                0,
              ),
              independentCorrect: legacyAttempts.filter(
                (attempt) =>
                  typeof attempt === "object" &&
                  attempt !== null &&
                  Reflect.get(attempt, "isCorrect") === true &&
                  Reflect.get(attempt, "assistance") === "none",
              ).length,
              lastPracticedAt,
              profileId,
              projectorVersion: 1,
              score: Number(legacyGameProgress.totalSpeed) * 100 || 0,
              stars: Number(legacyGameProgress.totalWordStars) || 0,
              status: legacyAttempts.length > 0 ? "practicing" : "not-started",
              supportedCorrect: legacyAttempts.filter(
                (attempt) =>
                  typeof attempt === "object" &&
                  attempt !== null &&
                  Reflect.get(attempt, "isCorrect") === true &&
                  Reflect.get(attempt, "assistance") !== "none",
              ).length,
            }),
          );
          events.push(
            ...mapLegacyPracticeEvents(
              JSON.stringify(legacyAttempts),
              profileId,
              "magisch-strand-avontuur",
            ),
          );
        }
        events.push(
          ...mapLegacyPracticeEvents(
            source.getItem(`game-runtime:practice:${profileId}:magisch-strand-avontuur`) ??
            source.getItem(`game-runtime:practice:${profileId}:strand-bezem-escape`),
            profileId,
            "magisch-strand-avontuur",
          ),
        );
      }
      await database.tables.practiceEvents.bulkPut(events);
      await database.tables.databaseMeta.put({
        key: migrationMetaKey,
        updatedAt: now,
        value: { fingerprint: sourceFingerprint, status: "complete" },
      });
    },
  );

  return {
    fingerprint: sourceFingerprint,
    migratedEvents: events.length,
    migratedProfiles: legacyProfiles.length,
    status: "migrated",
  };
};
