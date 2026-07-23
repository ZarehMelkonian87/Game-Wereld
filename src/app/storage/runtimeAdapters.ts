import {
  createTaskId,
  failure,
  success,
  type GameRuntime,
  type PracticeEventWriter,
  type RuntimeFailure,
  type RuntimeStorage,
} from "../game-platform/contracts";
import type { PracticeRepository, SettingsRepository, StorageApplicationError } from "./contracts";
import { practiceEventEnvelopeSchema, settingsRecordSchema, type SettingsRecord } from "./schemas";

const toRuntimeFailure = (error: unknown): RuntimeFailure => {
  const storageError = error as Partial<StorageApplicationError>;
  return {
    code:
      storageError.code === "quota-exceeded"
        ? "quota-exceeded"
        : storageError.code === "storage-unavailable"
          ? "unavailable"
          : "unexpected",
    message: storageError.message ?? "Voortgang kon niet worden opgeslagen.",
    recoverable: storageError.recoverable ?? true,
  };
};

const normalizeScope = (key: string, profileId: string) =>
  key
    .replace(`strand-bezem-escape:${profileId}:settings`, "strand-bezem-escape.preferences")
    .replace(`strand-bezem-escape:${profileId}:unlocked-rewards`, "strand-bezem-escape.rewards")
    .replace(`strand-bezem-escape:${profileId}:selected-world`, "strand-bezem-escape.world")
    .replace(
      `strand-bezem-escape:${profileId}:voice-privacy:2026-06-01`,
      "strand-bezem-escape.voice-privacy",
    );

const isDevelopmentOnlyKey = (key: string) =>
  key === "strand-bezem-escape:zone-visual-hint-overrides";

export const reportStorageWriteFailure = (error: unknown) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("game-wereld:storage-write-failed", {
      detail: toRuntimeFailure(error),
    }),
  );
};

export const createRepositoryRuntimeStorage = ({
  initialRecords,
  profileId,
  settings,
}: {
  initialRecords: SettingsRecord[];
  profileId: string;
  settings: SettingsRepository;
}): RuntimeStorage => {
  const localCache = new Map(
    initialRecords.flatMap((record) => {
      const raw = record.values.raw;
      return typeof raw === "string" ? [[record.scope, raw] as const] : [];
    }),
  );
  const sessionCache = new Map<string, string>();

  return {
    get: (key, scope = "local") => {
      const cache = scope === "session" || isDevelopmentOnlyKey(key) ? sessionCache : localCache;
      return cache.get(normalizeScope(key, profileId)) ?? null;
    },
    remove: (key, scope = "local") => {
      const normalized = normalizeScope(key, profileId);
      const cache = scope === "session" || isDevelopmentOnlyKey(key) ? sessionCache : localCache;
      cache.delete(normalized);
      if (scope === "local" && !isDevelopmentOnlyKey(key)) {
        void settings
          .put(
            settingsRecordSchema.parse({
              contractVersion: 1,
              profileId,
              scope: normalized,
              updatedAt: new Date().toISOString(),
              values: { raw: "" },
            }),
          )
          .catch(reportStorageWriteFailure);
      }
    },
    set: (key, value, scope = "local") => {
      const normalized = normalizeScope(key, profileId);
      const cache = scope === "session" || isDevelopmentOnlyKey(key) ? sessionCache : localCache;
      cache.set(normalized, value);
      if (scope === "local" && !isDevelopmentOnlyKey(key)) {
        void settings
          .put(
            settingsRecordSchema.parse({
              contractVersion: 1,
              profileId,
              scope: normalized,
              updatedAt: new Date().toISOString(),
              values: { raw: value },
            }),
          )
          .catch(reportStorageWriteFailure);
      }
      return success(undefined);
    },
  };
};

export const createRepositoryPracticeWriter = ({
  clock,
  ids,
  identity,
  practice,
}: {
  clock: GameRuntime["clock"];
  ids: GameRuntime["ids"];
  identity: GameRuntime["identity"];
  practice: PracticeRepository;
}): PracticeEventWriter => ({
  append: async (observation) => {
    try {
      const assistance = [
        ...(observation.assistance === "audio-repeat" ? (["instruction-replay"] as const) : []),
        ...(observation.assistance === "hint" ? (["visual-hint"] as const) : []),
        ...(observation.assistance === "spoken-help" ? (["spoken-help"] as const) : []),
      ];
      await practice.append(
        practiceEventEnvelopeSchema.parse({
          assistance,
          attemptNumber: Math.max(1, observation.attempts),
          contentVersion: "strand-bezem-escape-v1",
          gameId: identity.gameId,
          id: observation.eventId ?? ids.eventId(),
          occurredAt: clock.now().toISOString(),
          outcome: observation.isCorrect ? "correct" : "incorrect",
          profileId: identity.profileId,
          schemaVersion: 1,
          sessionId: identity.sessionId,
          skillIds:
            observation.targetWords.length > 0 ? observation.targetWords : ["general-practice"],
          taskId: createTaskId(observation.taskId),
        }),
      );
      return success(undefined);
    } catch (error) {
      const runtimeFailure = toRuntimeFailure(error);
      reportStorageWriteFailure(error);
      return failure(runtimeFailure);
    }
  },
  reset: async () => {
    try {
      await practice.resetForProfileGame(identity.profileId, identity.gameId);
      return success(undefined);
    } catch (error) {
      const runtimeFailure = toRuntimeFailure(error);
      reportStorageWriteFailure(error);
      return failure(runtimeFailure);
    }
  },
});
