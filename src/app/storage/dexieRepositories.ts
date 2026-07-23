import type { ProfileId } from "../game-platform/contracts";
import {
  createStorageError,
  type RepositoryBundle,
  type StorageApplicationError,
} from "./contracts";
import type { GameWorldDatabase } from "./database";
import {
  gameSessionRecordSchema,
  practiceEventEnvelopeSchema,
  profileRecordSchema,
  profileSettingsRecordSchema,
  progressProjectionSchema,
  settingsRecordSchema,
} from "./schemas";

const mapStorageError = (error: unknown): StorageApplicationError => {
  if (
    typeof error === "object" &&
    error !== null &&
    typeof Reflect.get(error, "code") === "string" &&
    typeof Reflect.get(error, "correlationId") === "string"
  ) {
    return error as StorageApplicationError;
  }
  const name = error instanceof Error ? error.name : "";
  if (name === "ConstraintError") {
    return createStorageError("duplicate", "Dit record bestaat al.");
  }
  if (name === "QuotaExceededError") {
    return createStorageError("quota-exceeded", "De lokale opslagruimte is vol.");
  }
  if (name === "InvalidStateError" || name === "SecurityError" || name === "DatabaseClosedError") {
    return createStorageError("storage-unavailable", "Lokale opslag is niet beschikbaar.");
  }
  return createStorageError(
    "storage-unavailable",
    error instanceof Error ? error.message : "Onbekende opslagfout.",
  );
};

const withStorageError = async <TValue>(operation: () => Promise<TValue>): Promise<TValue> => {
  try {
    return await operation();
  } catch (error) {
    throw mapStorageError(error);
  }
};

const parsePersisted = <TValue>(
  parser: { safeParse: (value: unknown) => { data?: TValue; success: boolean } },
  value: unknown,
  recordName: string,
): TValue => {
  const parsed = parser.safeParse(value);
  if (!parsed.success || parsed.data === undefined) {
    throw createStorageError(
      "invalid-persisted-data",
      `${recordName} bevat ongeldige opgeslagen gegevens.`,
    );
  }
  return parsed.data;
};

export const createDexieRepositoryBundle = ({
  db,
  tables,
}: GameWorldDatabase): RepositoryBundle => ({
  close: () => db.close(),
  mode: "durable",
  practice: {
    append: (event) =>
      withStorageError(async () => {
        const validEvent = parsePersisted(practiceEventEnvelopeSchema, event, "Oefenevent");
        return db.transaction("rw", tables.practiceEvents, tables.progressProjections, async () => {
          const existing = await tables.practiceEvents.get(validEvent.id);
          if (existing) return { status: "duplicate" as const };
          await tables.practiceEvents.add(validEvent);
          const current = await tables.progressProjections.get([
            validEvent.profileId,
            validEvent.gameId,
          ]);
          const independentlyCorrect =
            validEvent.outcome === "correct" && validEvent.assistance.length === 0;
          const supportedCorrect =
            validEvent.outcome === "correct" && validEvent.assistance.length > 0;
          await tables.progressProjections.put(
            progressProjectionSchema.parse({
              attempts: (current?.attempts ?? 0) + 1,
              calculatedAt: validEvent.occurredAt,
              gameId: validEvent.gameId,
              hintsUsed:
                (current?.hintsUsed ?? 0) +
                validEvent.assistance.filter((item) => item === "visual-hint").length,
              independentCorrect:
                (current?.independentCorrect ?? 0) + (independentlyCorrect ? 1 : 0),
              lastPracticedAt: validEvent.occurredAt,
              profileId: validEvent.profileId,
              projectorVersion: 1,
              score: (current?.score ?? 0) + (validEvent.outcome === "correct" ? 100 : 0),
              stars: (current?.stars ?? 0) + (validEvent.outcome === "correct" ? 1 : 0),
              status:
                (current?.independentCorrect ?? 0) + (independentlyCorrect ? 1 : 0) >= 3
                  ? "confident"
                  : "practicing",
              supportedCorrect: (current?.supportedCorrect ?? 0) + (supportedCorrect ? 1 : 0),
            }),
          );
          return { status: "accepted" as const };
        });
      }),
    listForProfile: (profileId, gameId) =>
      withStorageError(async () => {
        const records = gameId
          ? await tables.practiceEvents
              .where("[profileId+gameId]")
              .equals([profileId, gameId])
              .toArray()
          : await tables.practiceEvents.where("profileId").equals(profileId).toArray();
        return records.map((record) =>
          parsePersisted(practiceEventEnvelopeSchema, record, "Oefenevent"),
        );
      }),
    listForSession: (sessionId) =>
      withStorageError(async () => {
        const records = await tables.practiceEvents.where("sessionId").equals(sessionId).toArray();
        return records.map((record) =>
          parsePersisted(practiceEventEnvelopeSchema, record, "Oefenevent"),
        );
      }),
    resetForProfileGame: (profileId, gameId) =>
      withStorageError(async () => {
        await db.transaction("rw", tables.practiceEvents, tables.progressProjections, async () => {
          await tables.practiceEvents
            .where("[profileId+gameId]")
            .equals([profileId, gameId])
            .delete();
          await tables.progressProjections.delete([profileId, gameId]);
        });
      }),
  },
  profiles: {
    create: (record, settings) =>
      withStorageError(async () => {
        const validProfile = parsePersisted(profileRecordSchema, record, "Profiel");
        const validSettings = parsePersisted(
          profileSettingsRecordSchema,
          settings,
          "Profielinstellingen",
        );
        if (validSettings.profileId !== validProfile.id) {
          throw createStorageError(
            "invalid-persisted-data",
            "Profiel en instellingen hebben verschillende profiel-id's.",
          );
        }
        await db.transaction("rw", tables.profiles, tables.profileSettings, async () => {
          await tables.profiles.add(validProfile);
          await tables.profileSettings.add(validSettings);
        });
        return validProfile;
      }),
    deleteCascade: (profileId: ProfileId) =>
      withStorageError(async () => {
        await db.transaction(
          "rw",
          [
            tables.profiles,
            tables.profileSettings,
            tables.settings,
            tables.gameSessions,
            tables.practiceEvents,
            tables.progressProjections,
          ],
          async () => {
            await Promise.all([
              tables.profileSettings.delete(profileId),
              tables.settings.where("profileId").equals(profileId).delete(),
              tables.gameSessions.where("profileId").equals(profileId).delete(),
              tables.practiceEvents.where("profileId").equals(profileId).delete(),
              tables.progressProjections.where("profileId").equals(profileId).delete(),
            ]);
            await tables.profiles.delete(profileId);
          },
        );
      }),
    get: (profileId) =>
      withStorageError(async () => {
        const record = await tables.profiles.get(profileId);
        return record ? parsePersisted(profileRecordSchema, record, "Profiel") : null;
      }),
    list: () =>
      withStorageError(async () => {
        const records = await tables.profiles.orderBy("createdAt").toArray();
        return records.map((record) => parsePersisted(profileRecordSchema, record, "Profiel"));
      }),
    update: (profileId, patch) =>
      withStorageError(async () => {
        const existing = await tables.profiles.get(profileId);
        if (!existing) {
          throw createStorageError("not-found", "Profiel bestaat niet.");
        }
        const updated = parsePersisted(
          profileRecordSchema,
          { ...existing, ...patch, id: profileId },
          "Profiel",
        );
        await tables.profiles.put(updated);
        return updated;
      }),
  },
  progress: {
    get: (profileId, gameId) =>
      withStorageError(async () => {
        const record = await tables.progressProjections.get([profileId, gameId]);
        return record
          ? parsePersisted(progressProjectionSchema, record, "Voortgangsprojectie")
          : null;
      }),
    listForProfile: (profileId) =>
      withStorageError(async () => {
        const records = await tables.progressProjections
          .where("profileId")
          .equals(profileId)
          .toArray();
        return records.map((record) =>
          parsePersisted(progressProjectionSchema, record, "Voortgangsprojectie"),
        );
      }),
    put: (projection) =>
      withStorageError(async () => {
        await tables.progressProjections.put(
          parsePersisted(progressProjectionSchema, projection, "Voortgangsprojectie"),
        );
      }),
  },
  sessions: {
    finish: (sessionId, status, endedAt) =>
      withStorageError(async () => {
        const existing = await tables.gameSessions.get(sessionId);
        if (!existing || existing.status !== "started") return;
        await tables.gameSessions.put(
          parsePersisted(gameSessionRecordSchema, { ...existing, endedAt, status }, "Gamesessie"),
        );
      }),
    get: (sessionId) =>
      withStorageError(async () => {
        const record = await tables.gameSessions.get(sessionId);
        return record ? parsePersisted(gameSessionRecordSchema, record, "Gamesessie") : null;
      }),
    start: (record) =>
      withStorageError(async () => {
        const validRecord = parsePersisted(gameSessionRecordSchema, record, "Gamesessie");
        const existing = await tables.gameSessions.get(validRecord.id);
        if (!existing) await tables.gameSessions.add(validRecord);
      }),
  },
  settings: {
    get: (profileId, scope) =>
      withStorageError(async () => {
        const record = await tables.settings.get([profileId, scope]);
        return record ? parsePersisted(settingsRecordSchema, record, "Instellingen") : null;
      }),
    getProfileSettings: (profileId) =>
      withStorageError(async () => {
        const record = await tables.profileSettings.get(profileId);
        return record
          ? parsePersisted(profileSettingsRecordSchema, record, "Profielinstellingen")
          : null;
      }),
    listForProfile: (profileId) =>
      withStorageError(async () => {
        const records = await tables.settings.where("profileId").equals(profileId).toArray();
        return records.map((record) =>
          parsePersisted(settingsRecordSchema, record, "Instellingen"),
        );
      }),
    put: (record) =>
      withStorageError(async () => {
        await tables.settings.put(parsePersisted(settingsRecordSchema, record, "Instellingen"));
      }),
    putProfileSettings: (record) =>
      withStorageError(async () => {
        await tables.profileSettings.put(
          parsePersisted(profileSettingsRecordSchema, record, "Profielinstellingen"),
        );
      }),
  },
});

export const openDatabase = (database: GameWorldDatabase) =>
  withStorageError(async () => {
    await database.db.open();
  });
