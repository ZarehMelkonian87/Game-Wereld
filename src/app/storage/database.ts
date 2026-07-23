import Dexie, { type Table } from "dexie";
import type {
  DatabaseMetaRecord,
  GameSessionRecord,
  PracticeEventEnvelope,
  ProfileRecord,
  ProfileSettingsRecord,
  ProgressProjection,
  SettingsRecord,
} from "./schemas";

export const DATABASE_NAME = "game-wereld";
export const DATABASE_VERSION = 2;

export interface GameWorldTables {
  databaseMeta: Table<DatabaseMetaRecord, string>;
  gameSessions: Table<GameSessionRecord, string>;
  practiceEvents: Table<PracticeEventEnvelope, string>;
  profileSettings: Table<ProfileSettingsRecord, string>;
  profiles: Table<ProfileRecord, string>;
  progressProjections: Table<ProgressProjection, [string, string]>;
  settings: Table<SettingsRecord, [string, string]>;
}

export interface GameWorldDatabase {
  db: Dexie;
  tables: GameWorldTables;
}

export const createGameWorldDatabase = (name = DATABASE_NAME): GameWorldDatabase => {
  const db = new Dexie(name);
  db.version(1).stores({
    databaseMeta: "&key, updatedAt",
    gameSessions: "&id, profileId, gameId, startedAt, [profileId+startedAt]",
    practiceEvents:
      "&id, profileId, gameId, sessionId, occurredAt, [profileId+gameId], [profileId+occurredAt]",
    profileSettings: "&profileId, updatedAt",
    profiles: "&id, createdAt, updatedAt",
    progressProjections: "&[profileId+gameId], profileId, gameId, status",
    settings: "&[profileId+scope], profileId, scope, updatedAt",
  });
  db.version(DATABASE_VERSION)
    .stores({
      databaseMeta: "&key, updatedAt",
      gameSessions: "&id, profileId, gameId, status, startedAt, [profileId+startedAt]",
      practiceEvents:
        "&id, profileId, gameId, sessionId, occurredAt, [profileId+gameId], [profileId+occurredAt]",
      profileSettings: "&profileId, updatedAt",
      profiles: "&id, createdAt, updatedAt",
      progressProjections: "&[profileId+gameId], profileId, gameId, status",
      settings: "&[profileId+scope], profileId, scope, updatedAt",
    })
    .upgrade(async (transaction) => {
      await transaction
        .table("gameSessions")
        .toCollection()
        .modify((session: Record<string, unknown>) => {
          if (typeof session.contentVersion !== "string") {
            session.contentVersion = "legacy-unknown";
          }
        });
    });

  return {
    db,
    tables: {
      databaseMeta: db.table("databaseMeta"),
      gameSessions: db.table("gameSessions"),
      practiceEvents: db.table("practiceEvents"),
      profileSettings: db.table("profileSettings"),
      profiles: db.table("profiles"),
      progressProjections: db.table("progressProjections"),
      settings: db.table("settings"),
    },
  };
};
