import type { GameId, ProfileId, SessionId } from "../game-platform/contracts";
import type {
  GameSessionRecord,
  PracticeEventEnvelope,
  ProfileRecord,
  ProfileSettingsRecord,
  ProgressProjection,
  SettingsRecord,
} from "./schemas";

export type StorageErrorCode =
  | "duplicate"
  | "invalid-persisted-data"
  | "migration-failed"
  | "not-found"
  | "quota-exceeded"
  | "storage-unavailable";

export interface StorageApplicationError {
  code: StorageErrorCode;
  correlationId: string;
  message: string;
  recoverable: boolean;
}

export type DatabaseBootstrapState =
  | { status: "opening" }
  | { repositories: RepositoryBundle; status: "ready" }
  | { error: StorageApplicationError; status: "migration-failed" | "unavailable" };

export interface ProfileRepository {
  create: (record: ProfileRecord, settings: ProfileSettingsRecord) => Promise<ProfileRecord>;
  deleteCascade: (profileId: ProfileId) => Promise<void>;
  get: (profileId: ProfileId) => Promise<ProfileRecord | null>;
  list: () => Promise<ProfileRecord[]>;
  update: (
    profileId: ProfileId,
    patch: Partial<Pick<ProfileRecord, "avatar" | "name" | "updatedAt">>,
  ) => Promise<ProfileRecord>;
}

export interface SettingsRepository {
  get: (profileId: ProfileId, scope: string) => Promise<SettingsRecord | null>;
  getProfileSettings: (profileId: ProfileId) => Promise<ProfileSettingsRecord | null>;
  listForProfile: (profileId: ProfileId) => Promise<SettingsRecord[]>;
  put: (record: SettingsRecord) => Promise<void>;
  putProfileSettings: (record: ProfileSettingsRecord) => Promise<void>;
}

export interface SessionRepository {
  finish: (
    sessionId: SessionId,
    status: Exclude<GameSessionRecord["status"], "started">,
    endedAt: string,
  ) => Promise<void>;
  get: (sessionId: SessionId) => Promise<GameSessionRecord | null>;
  start: (record: GameSessionRecord) => Promise<void>;
}

export interface AppendPracticeResult {
  status: "accepted" | "duplicate";
}

export interface PracticeRepository {
  append: (event: PracticeEventEnvelope) => Promise<AppendPracticeResult>;
  listForProfile: (profileId: ProfileId, gameId?: GameId) => Promise<PracticeEventEnvelope[]>;
  listForSession: (sessionId: SessionId) => Promise<PracticeEventEnvelope[]>;
  resetForProfileGame: (profileId: ProfileId, gameId: GameId) => Promise<void>;
}

export interface ProgressRepository {
  get: (profileId: ProfileId, gameId: GameId) => Promise<ProgressProjection | null>;
  listForProfile: (profileId: ProfileId) => Promise<ProgressProjection[]>;
  put: (projection: ProgressProjection) => Promise<void>;
}

export interface RepositoryBundle {
  close: () => void;
  mode: "durable" | "temporary";
  practice: PracticeRepository;
  profiles: ProfileRepository;
  progress: ProgressRepository;
  sessions: SessionRepository;
  settings: SettingsRepository;
}

export const createStorageError = (
  code: StorageErrorCode,
  message: string,
  recoverable = true,
): StorageApplicationError => ({
  code,
  correlationId: crypto.randomUUID(),
  message,
  recoverable,
});
