import type { ProfileId } from "../game-platform/contracts";
import { createStorageError, type RepositoryBundle, type StorageErrorCode } from "./contracts";
import type {
  GameSessionRecord,
  PracticeEventEnvelope,
  ProfileRecord,
  ProfileSettingsRecord,
  ProgressProjection,
  SettingsRecord,
} from "./schemas";

interface MemoryRepositoryOptions {
  eventLimit?: number;
  failWritesWith?: StorageErrorCode;
}

export const createMemoryRepositoryBundle = ({
  eventLimit = 100,
  failWritesWith,
}: MemoryRepositoryOptions = {}): RepositoryBundle => {
  const profiles = new Map<string, ProfileRecord>();
  const profileSettings = new Map<string, ProfileSettingsRecord>();
  const settings = new Map<string, SettingsRecord>();
  const sessions = new Map<string, GameSessionRecord>();
  const events = new Map<string, PracticeEventEnvelope>();
  const projections = new Map<string, ProgressProjection>();
  const failWrite = () => {
    if (failWritesWith) {
      throw createStorageError(failWritesWith, "Gesimuleerde opslagfout.");
    }
  };
  const compositeKey = (profileId: string, suffix: string) => `${profileId}::${suffix}`;

  return {
    close: () => undefined,
    mode: "temporary",
    practice: {
      append: async (event) => {
        failWrite();
        if (events.has(event.id)) return { status: "duplicate" };
        if (events.size >= eventLimit) {
          throw createStorageError(
            "quota-exceeded",
            "De tijdelijke eventbuffer heeft zijn limiet bereikt.",
          );
        }
        events.set(event.id, structuredClone(event));
        const key = compositeKey(event.profileId, event.gameId);
        const current = projections.get(key);
        const independentlyCorrect = event.outcome === "correct" && event.assistance.length === 0;
        const supportedCorrect = event.outcome === "correct" && event.assistance.length > 0;
        projections.set(key, {
          attempts: (current?.attempts ?? 0) + 1,
          calculatedAt: event.occurredAt,
          gameId: event.gameId,
          hintsUsed:
            (current?.hintsUsed ?? 0) +
            event.assistance.filter((item) => item === "visual-hint").length,
          independentCorrect: (current?.independentCorrect ?? 0) + (independentlyCorrect ? 1 : 0),
          lastPracticedAt: event.occurredAt,
          profileId: event.profileId,
          projectorVersion: 1,
          score: (current?.score ?? 0) + (event.outcome === "correct" ? 100 : 0),
          stars: (current?.stars ?? 0) + (event.outcome === "correct" ? 1 : 0),
          status:
            (current?.independentCorrect ?? 0) + (independentlyCorrect ? 1 : 0) >= 3
              ? "confident"
              : "practicing",
          supportedCorrect: (current?.supportedCorrect ?? 0) + (supportedCorrect ? 1 : 0),
        });
        return { status: "accepted" };
      },
      listForProfile: async (profileId, gameId) =>
        [...events.values()].filter(
          (event) => event.profileId === profileId && (!gameId || event.gameId === gameId),
        ),
      listForSession: async (sessionId) =>
        [...events.values()].filter((event) => event.sessionId === sessionId),
      resetForProfileGame: async (profileId, gameId) => {
        failWrite();
        [...events.entries()].forEach(([id, event]) => {
          if (event.profileId === profileId && event.gameId === gameId) events.delete(id);
        });
        projections.delete(compositeKey(profileId, gameId));
      },
    },
    profiles: {
      create: async (record, recordSettings) => {
        failWrite();
        if (profiles.has(record.id)) throw createStorageError("duplicate", "Profiel bestaat al.");
        profiles.set(record.id, structuredClone(record));
        profileSettings.set(record.id, structuredClone(recordSettings));
        return structuredClone(record);
      },
      deleteCascade: async (profileId: ProfileId) => {
        failWrite();
        profiles.delete(profileId);
        profileSettings.delete(profileId);
        [...settings.entries()].forEach(([key, record]) => {
          if (record.profileId === profileId) settings.delete(key);
        });
        [...sessions.entries()].forEach(([key, record]) => {
          if (record.profileId === profileId) sessions.delete(key);
        });
        [...events.entries()].forEach(([key, record]) => {
          if (record.profileId === profileId) events.delete(key);
        });
        [...projections.entries()].forEach(([key, record]) => {
          if (record.profileId === profileId) projections.delete(key);
        });
      },
      get: async (profileId) => {
        const record = profiles.get(profileId);
        return record ? structuredClone(record) : null;
      },
      list: async () =>
        [...profiles.values()]
          .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
          .map((record) => structuredClone(record)),
      update: async (profileId, patch) => {
        failWrite();
        const existing = profiles.get(profileId);
        if (!existing) throw createStorageError("not-found", "Profiel bestaat niet.");
        const updated = { ...existing, ...patch, id: profileId };
        profiles.set(profileId, updated);
        return structuredClone(updated);
      },
    },
    progress: {
      get: async (profileId, gameId) => {
        const record = projections.get(compositeKey(profileId, gameId));
        return record ? structuredClone(record) : null;
      },
      listForProfile: async (profileId) =>
        [...projections.values()]
          .filter((record) => record.profileId === profileId)
          .map((record) => structuredClone(record)),
      put: async (projection) => {
        failWrite();
        projections.set(
          compositeKey(projection.profileId, projection.gameId),
          structuredClone(projection),
        );
      },
    },
    sessions: {
      finish: async (sessionId, status, endedAt) => {
        failWrite();
        const existing = sessions.get(sessionId);
        if (existing?.status === "started") {
          sessions.set(sessionId, { ...existing, endedAt, status });
        }
      },
      get: async (sessionId) => {
        const record = sessions.get(sessionId);
        return record ? structuredClone(record) : null;
      },
      start: async (record) => {
        failWrite();
        if (!sessions.has(record.id)) sessions.set(record.id, structuredClone(record));
      },
    },
    settings: {
      get: async (profileId, scope) => {
        const record = settings.get(compositeKey(profileId, scope));
        return record ? structuredClone(record) : null;
      },
      getProfileSettings: async (profileId) => {
        const record = profileSettings.get(profileId);
        return record ? structuredClone(record) : null;
      },
      listForProfile: async (profileId) =>
        [...settings.values()]
          .filter((record) => record.profileId === profileId)
          .map((record) => structuredClone(record)),
      put: async (record) => {
        failWrite();
        settings.set(compositeKey(record.profileId, record.scope), structuredClone(record));
      },
      putProfileSettings: async (record) => {
        failWrite();
        profileSettings.set(record.profileId, structuredClone(record));
      },
    },
  };
};
