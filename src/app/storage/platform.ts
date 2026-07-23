import Dexie from "dexie";
import {
  createStorageError,
  type RepositoryBundle,
  type StorageApplicationError,
} from "./contracts";
import { createGameWorldDatabase, DATABASE_NAME, DATABASE_VERSION } from "./database";
import { createDexieRepositoryBundle, openDatabase } from "./dexieRepositories";
import { migrateLegacyStorage, type LegacyMigrationResult } from "./legacyMigration";
import { createMemoryRepositoryBundle } from "./memoryRepositories";

export interface DurableStorageResult {
  migration: LegacyMigrationResult;
  repositories: RepositoryBundle;
}

const asStorageError = (error: unknown): StorageApplicationError => {
  if (
    typeof error === "object" &&
    error !== null &&
    typeof Reflect.get(error, "code") === "string" &&
    typeof Reflect.get(error, "correlationId") === "string"
  ) {
    return error as StorageApplicationError;
  }
  return createStorageError(
    "migration-failed",
    error instanceof Error ? error.message : "Database kon niet worden geopend.",
  );
};

export const bootstrapDurableStorage = async (): Promise<DurableStorageResult> => {
  if (typeof indexedDB === "undefined") {
    throw createStorageError("storage-unavailable", "Deze browser biedt geen IndexedDB-opslag.");
  }
  const database = createGameWorldDatabase();
  try {
    await openDatabase(database);
    const migration = await migrateLegacyStorage(database, window.localStorage);
    return {
      migration,
      repositories: createDexieRepositoryBundle(database),
    };
  } catch (error) {
    database.db.close();
    throw asStorageError(error);
  }
};

export const createTemporaryStorage = () => createMemoryRepositoryBundle({ eventLimit: 100 });

export const resetDurableStorage = async () => {
  await Dexie.delete(DATABASE_NAME);
};

export const createStorageDiagnostic = (error: StorageApplicationError) => ({
  correlationId: error.correlationId,
  databaseVersion: DATABASE_VERSION,
  errorCode: error.code,
  generatedAt: new Date().toISOString(),
  message: error.message,
  userAgent: typeof navigator === "undefined" ? "unknown" : navigator.userAgent,
});
