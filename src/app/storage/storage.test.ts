import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import {
  createEventId,
  createGameId,
  createProfileId,
  createSessionId,
  createTaskId,
} from "../game-platform/contracts";
import { createDexieRepositoryBundle } from "./dexieRepositories";
import { createGameWorldDatabase } from "./database";
import { migrateLegacyStorage } from "./legacyMigration";
import { createMemoryRepositoryBundle } from "./memoryRepositories";
import { createProfileProgressExport } from "./profileDataExport";
import { evaluatePracticeEventRetention } from "./retentionPolicy";
import { createRepositoryRuntimeStorage } from "./runtimeAdapters";
import {
  readActiveProfileId,
  readGlobalMute,
  saveActiveProfileId,
  saveGlobalMute,
} from "./bootPreferences";
import {
  gameSessionRecordSchema,
  practiceEventEnvelopeSchema,
  profileRecordSchema,
  profileSettingsRecordSchema,
  progressProjectionSchema,
} from "./schemas";

const databaseNames: string[] = [];
const now = "2026-07-23T10:00:00.000Z";
const profileId = createProfileId("profile-1");
const gameId = createGameId("strand-bezem-escape");
const sessionId = createSessionId("session-1");

const createProfileFixture = () =>
  profileRecordSchema.parse({
    avatar: { color: "blue", emoji: "🧒", id: "avatar-1", name: "Blauw" },
    contractVersion: 1,
    createdAt: now,
    id: profileId,
    name: "Testspeler",
    updatedAt: now,
  });

const createSettingsFixture = () =>
  profileSettingsRecordSchema.parse({
    contractVersion: 1,
    musicEnabled: true,
    profileId,
    soundEnabled: true,
    updatedAt: now,
  });

const createEventFixture = () =>
  practiceEventEnvelopeSchema.parse({
    assistance: [],
    attemptNumber: 1,
    contentVersion: "test-v1",
    gameId,
    id: createEventId("event-1"),
    occurredAt: now,
    outcome: "correct",
    profileId,
    schemaVersion: 1,
    sessionId,
    skillIds: ["boot"],
    taskId: createTaskId("task-1"),
  });

const createTestDatabase = () => {
  const name = `game-wereld-test-${crypto.randomUUID()}`;
  databaseNames.push(name);
  return createGameWorldDatabase(name);
};

afterEach(async () => {
  await Promise.all(databaseNames.splice(0).map((name) => Dexie.delete(name)));
  window.localStorage.clear();
});

describe("niet-kritieke bootvoorkeuren", () => {
  it("leest de legacy profiel-id alleen als fallback en schrijft uitsluitend de nieuwe key", () => {
    window.localStorage.setItem("kids-game-current-profile", profileId);
    expect(readActiveProfileId()).toBe(profileId);

    saveActiveProfileId(createProfileId("profile-2"));
    expect(window.localStorage.getItem("game-wereld-active-profile-id")).toBe("profile-2");
    expect(window.localStorage.getItem("kids-game-current-profile")).toBe(profileId);
  });

  it("bewaart globale mute als kleine pre-bootvoorkeur", () => {
    expect(readGlobalMute()).toBe(false);
    saveGlobalMute(true);
    expect(readGlobalMute()).toBe(true);
  });
});

describe("persistente schemas", () => {
  it("accepteert geldige records en weigert corrupt of toekomstig materiaal", () => {
    expect(profileRecordSchema.safeParse(createProfileFixture()).success).toBe(true);
    expect(profileRecordSchema.safeParse({ id: "", contractVersion: 1 }).success).toBe(false);
    expect(
      practiceEventEnvelopeSchema.safeParse({
        ...createEventFixture(),
        schemaVersion: 2,
      }).success,
    ).toBe(false);
    expect(
      progressProjectionSchema.safeParse({
        attempts: -1,
        calculatedAt: now,
        gameId,
        hintsUsed: 0,
        independentCorrect: 0,
        profileId,
        projectorVersion: 1,
        score: 0,
        stars: 0,
        status: "not-started",
        supportedCorrect: 0,
      }).success,
    ).toBe(false);
  });
});

describe("Dexie repositories", () => {
  it("upgrade een v1-sessie naar database v2 met een expliciete legacy-contentversie", async () => {
    const name = `game-wereld-v1-${crypto.randomUUID()}`;
    databaseNames.push(name);
    const legacyDatabase = new Dexie(name);
    legacyDatabase
      .version(1)
      .stores({ gameSessions: "&id, profileId, gameId, startedAt, [profileId+startedAt]" });
    await legacyDatabase.table("gameSessions").put({
      contractVersion: 1,
      gameId,
      id: sessionId,
      profileId,
      startedAt: now,
      status: "started",
    });
    legacyDatabase.close();

    const upgraded = createGameWorldDatabase(name);
    await upgraded.db.open();
    expect(await upgraded.tables.gameSessions.get(sessionId)).toMatchObject({
      contentVersion: "legacy-unknown",
    });
    upgraded.db.close();
  });

  it("voert CRUD, idempotente events, projectie en cascade delete uit", async () => {
    const database = createTestDatabase();
    await database.db.open();
    const repositories = createDexieRepositoryBundle(database);
    await repositories.profiles.create(createProfileFixture(), createSettingsFixture());
    await repositories.sessions.start(
      gameSessionRecordSchema.parse({
        contentVersion: "test-v1",
        contractVersion: 1,
        gameId,
        id: sessionId,
        profileId,
        startedAt: now,
        status: "started",
      }),
    );

    expect(await repositories.practice.append(createEventFixture())).toEqual({
      status: "accepted",
    });
    expect(await repositories.practice.append(createEventFixture())).toEqual({
      status: "duplicate",
    });
    expect(await repositories.practice.listForSession(sessionId)).toHaveLength(1);
    expect(await repositories.progress.get(profileId, gameId)).toMatchObject({
      attempts: 1,
      independentCorrect: 1,
    });
    const incrementalProjection = await repositories.progress.get(profileId, gameId);
    await database.tables.progressProjections.delete([profileId, gameId]);
    expect(await repositories.progress.rebuild(profileId, gameId, now)).toEqual(
      incrementalProjection,
    );

    await repositories.profiles.deleteCascade(profileId);
    expect(await repositories.profiles.get(profileId)).toBeNull();
    expect(await repositories.settings.getProfileSettings(profileId)).toBeNull();
    expect(await repositories.sessions.get(sessionId)).toBeNull();
    expect(await repositories.practice.listForProfile(profileId)).toEqual([]);
    expect(await repositories.progress.listForProfile(profileId)).toEqual([]);
  });

  it("rolt een transactionele profielcreate terug bij ongeldige settings", async () => {
    const database = createTestDatabase();
    await database.db.open();
    const repositories = createDexieRepositoryBundle(database);

    await expect(
      repositories.profiles.create(createProfileFixture(), {
        ...createSettingsFixture(),
        profileId: createProfileId("other-profile"),
      }),
    ).rejects.toMatchObject({ code: "invalid-persisted-data" });
    expect(await repositories.profiles.list()).toEqual([]);
  });

  it("bewaart atomair alleen de eerste duurzame sessie-eindstatus", async () => {
    const database = createTestDatabase();
    await database.db.open();
    const repositories = createDexieRepositoryBundle(database);
    const durableSessionId = createSessionId("concurrent-session");
    await repositories.sessions.start(
      gameSessionRecordSchema.parse({
        contentVersion: "test-v1",
        contractVersion: 1,
        gameId,
        id: durableSessionId,
        profileId,
        startedAt: now,
        status: "started",
      }),
    );

    await Promise.all([
      repositories.sessions.finish(durableSessionId, "completed", "2026-07-23T10:10:00.000Z"),
      repositories.sessions.finish(durableSessionId, "crashed", "2026-07-23T10:11:00.000Z"),
    ]);

    expect(await repositories.sessions.get(durableSessionId)).toMatchObject({
      endedAt: "2026-07-23T10:10:00.000Z",
      status: "completed",
    });
  });

  it("geeft een sessie maximaal één eindstatus en herstelt open sessies", async () => {
    const repositories = createMemoryRepositoryBundle();
    const createSession = (id: string) =>
      gameSessionRecordSchema.parse({
        contentVersion: "test-v1",
        contractVersion: 1,
        gameId,
        id: createSessionId(id),
        profileId,
        startedAt: now,
        status: "started",
      });
    await repositories.sessions.start(createSession("completed-session"));
    await repositories.sessions.finish(
      createSessionId("completed-session"),
      "completed",
      "2026-07-23T10:10:00.000Z",
    );
    await repositories.sessions.finish(
      createSessionId("completed-session"),
      "crashed",
      "2026-07-23T10:11:00.000Z",
    );
    expect(await repositories.sessions.get(createSessionId("completed-session"))).toMatchObject({
      status: "completed",
    });

    await repositories.sessions.start(createSession("open-session"));
    await expect(repositories.sessions.recoverOpen("2026-07-23T10:20:00.000Z")).resolves.toBe(1);
    expect(await repositories.sessions.get(createSessionId("open-session"))).toMatchObject({
      endedAt: "2026-07-23T10:20:00.000Z",
      status: "abandoned",
    });
  });
});

describe("legacy importmigratie", () => {
  const legacyProfile = {
    avatar: { color: "blue", emoji: "🧒", id: "avatar-1", name: "Blauw" },
    createdAt: now,
    id: profileId,
    name: "Migratiespeler",
    progress: [
      {
        completed: true,
        gameId,
        lastPlayed: now,
        score: 200,
        stars: 2,
      },
    ],
    settings: { musicEnabled: false, soundEnabled: true },
  };

  it("importeert semantisch gelijk en verandert niets bij een tweede run", async () => {
    const database = createTestDatabase();
    await database.db.open();
    const values = new Map<string, string>([
      ["kids-game-profiles", JSON.stringify([legacyProfile])],
      [
        `strand-bezem-escape:${profileId}:settings`,
        JSON.stringify({
          audioEnabled: true,
          hintsEnabled: false,
          musicEnabled: false,
          reducedMotion: true,
        }),
      ],
      [`strand-bezem-escape:${profileId}:unlocked-rewards`, JSON.stringify(["sticker-1"])],
      [`strand-bezem-escape:${profileId}:selected-world`, "beach-world-1"],
    ]);
    const source = { getItem: (key: string) => values.get(key) ?? null };

    const first = await migrateLegacyStorage(database, source);
    const second = await migrateLegacyStorage(database, source);

    expect(first).toMatchObject({ migratedProfiles: 1, status: "migrated" });
    expect(second).toMatchObject({ migratedProfiles: 0, status: "unchanged" });
    expect(await database.tables.profiles.get(profileId)).toMatchObject({
      name: "Migratiespeler",
    });
    expect(await database.tables.progressProjections.get([profileId, gameId])).toMatchObject({
      score: 200,
      stars: 2,
      status: "confident",
    });
    expect(await database.tables.settings.where("profileId").equals(profileId).count()).toBe(3);
  });

  it("behoudt de oude bron en rolt terug bij corrupte profieldata", async () => {
    const database = createTestDatabase();
    await database.db.open();
    const source = { getItem: (key: string) => (key === "kids-game-profiles" ? "{kapot" : null) };

    await expect(migrateLegacyStorage(database, source)).rejects.toMatchObject({
      code: "migration-failed",
    });
    expect(await database.tables.profiles.count()).toBe(0);
  });

  it("rolt alle geschreven records terug wanneer een latere legacy-key corrupt is", async () => {
    const database = createTestDatabase();
    await database.db.open();
    const values = new Map<string, string>([
      ["kids-game-profiles", JSON.stringify([legacyProfile])],
      [`strand-bezem-escape:${profileId}:settings`, "{kapot"],
    ]);
    const source = { getItem: (key: string) => values.get(key) ?? null };

    await expect(migrateLegacyStorage(database, source)).rejects.toMatchObject({
      code: "migration-failed",
    });
    expect(await database.tables.profiles.count()).toBe(0);
    expect(await database.tables.profileSettings.count()).toBe(0);
    expect(await database.tables.progressProjections.count()).toBe(0);
    expect(await database.tables.databaseMeta.count()).toBe(0);
  });

  it("weigert semantisch corrupte legacyprogressie zonder gedeeltelijke import", async () => {
    const database = createTestDatabase();
    await database.db.open();
    const values = new Map<string, string>([
      ["kids-game-profiles", JSON.stringify([legacyProfile])],
      [`strand-bezem-escape:${profileId}:progress`, JSON.stringify(["geen", "progressie"])],
    ]);

    await expect(
      migrateLegacyStorage(database, { getItem: (key: string) => values.get(key) ?? null }),
    ).rejects.toMatchObject({ code: "migration-failed" });
    expect(await database.tables.profiles.count()).toBe(0);
    expect(await database.tables.progressProjections.count()).toBe(0);
  });

  it("migreert gedeeltelijke oude profielen met expliciete veilige defaults", async () => {
    const database = createTestDatabase();
    await database.db.open();
    const partialProfile = {
      avatar: legacyProfile.avatar,
      createdAt: now,
      id: profileId,
      name: "Oud profiel",
    };
    const source = {
      getItem: (key: string) =>
        key === "kids-game-profiles" ? JSON.stringify([partialProfile]) : null,
    };

    await expect(migrateLegacyStorage(database, source)).resolves.toMatchObject({
      migratedProfiles: 1,
      status: "migrated",
    });
    expect(await database.tables.profileSettings.get(profileId)).toMatchObject({
      musicEnabled: true,
      soundEnabled: true,
    });
    expect(await database.tables.progressProjections.count()).toBe(0);
  });

  it("migreert legacy privacy, gameprogressie en beide oefeneventformaten", async () => {
    const database = createTestDatabase();
    await database.db.open();
    const values = new Map<string, string>([
      ["kids-game-profiles", JSON.stringify([legacyProfile])],
      [`strand-bezem-escape:${profileId}:voice-privacy:2026-06-01`, "accepted"],
      [
        `strand-bezem-escape:${profileId}:progress`,
        JSON.stringify({
          attempts: [
            {
              assistance: "none",
              attempts: 1,
              id: "legacy-attempt",
              isCorrect: true,
              playedAt: now,
              targetWords: ["boven"],
              taskId: "legacy-task",
            },
          ],
          totalSpeed: 2,
          totalWordStars: 3,
        }),
      ],
      [
        `game-runtime:practice:${profileId}:strand-bezem-escape`,
        JSON.stringify([
          {
            assistance: "hint",
            attempts: 2,
            eventId: "runtime-event",
            recordedAt: now,
            result: "needs-more-practice",
            sessionId: "runtime-session",
            targetWords: ["onder"],
            taskId: "runtime-task",
          },
        ]),
      ],
    ]);
    const source = { getItem: (key: string) => values.get(key) ?? null };

    await expect(migrateLegacyStorage(database, source)).resolves.toMatchObject({
      migratedEvents: 2,
      migratedProfiles: 1,
    });
    expect(
      await database.tables.settings.get([profileId, "strand-bezem-escape.voice-privacy"]),
    ).toMatchObject({ values: { raw: "accepted" } });
    expect(await database.tables.practiceEvents.where("profileId").equals(profileId).count()).toBe(
      2,
    );
    expect(await database.tables.progressProjections.get([profileId, gameId])).toMatchObject({
      attempts: 1,
      independentCorrect: 1,
      score: 200,
      stars: 3,
    });
  });
});

describe("tijdelijke repositories", () => {
  it("begrenzen de eventbuffer en maken quota-falen zichtbaar", async () => {
    const repositories = createMemoryRepositoryBundle({ eventLimit: 1 });
    await repositories.practice.append(createEventFixture());
    await expect(
      repositories.practice.append({
        ...createEventFixture(),
        id: createEventId("event-2"),
      }),
    ).rejects.toMatchObject({ code: "quota-exceeded" });
  });

  it("kunnen unavailable writes deterministisch simuleren", async () => {
    const repositories = createMemoryRepositoryBundle({
      failWritesWith: "storage-unavailable",
    });
    await expect(
      repositories.profiles.create(createProfileFixture(), createSettingsFixture()),
    ).rejects.toMatchObject({ code: "storage-unavailable" });
  });
});

describe("repository-backed gameopslag", () => {
  it("bewaart duurzame gamescopes en houdt sessie- en devdata vluchtig", async () => {
    const repositories = createMemoryRepositoryBundle();
    const firstRuntime = createRepositoryRuntimeStorage({
      initialRecords: [],
      profileId,
      settings: repositories.settings,
    });
    const preferencesKey = `strand-bezem-escape:${profileId}:settings`;
    const rewardsKey = `strand-bezem-escape:${profileId}:unlocked-rewards`;
    const worldKey = `strand-bezem-escape:${profileId}:selected-world`;
    const rewardResultKey = `strand-bezem-escape:${profileId}:reward-result`;
    const zoneDevKey = "strand-bezem-escape:zone-visual-hint-overrides";

    firstRuntime.set(preferencesKey, '{"musicEnabled":false}');
    firstRuntime.set(rewardsKey, '["sticker-1"]');
    firstRuntime.set(worldKey, "beach-world-1");
    firstRuntime.set(rewardResultKey, '{"stars":2}', "session");
    firstRuntime.set(zoneDevKey, '{"zone":"debug"}');

    const persisted = await repositories.settings.listForProfile(profileId);
    const reloadedRuntime = createRepositoryRuntimeStorage({
      initialRecords: persisted,
      profileId,
      settings: repositories.settings,
    });

    expect(reloadedRuntime.get(preferencesKey)).toBe('{"musicEnabled":false}');
    expect(reloadedRuntime.get(rewardsKey)).toBe('["sticker-1"]');
    expect(reloadedRuntime.get(worldKey)).toBe("beach-world-1");
    expect(reloadedRuntime.get(rewardResultKey, "session")).toBeNull();
    expect(reloadedRuntime.get(zoneDevKey)).toBeNull();
  });
});

describe("privacy-export en retentie", () => {
  it("exporteert voortgang zonder naam, avatar of lokale profiel-id", async () => {
    const repositories = createMemoryRepositoryBundle();
    await repositories.profiles.create(createProfileFixture(), createSettingsFixture());
    await repositories.practice.append(createEventFixture());
    await repositories.sessions.start(
      gameSessionRecordSchema.parse({
        contentVersion: "test-v1",
        contractVersion: 1,
        gameId,
        id: sessionId,
        profileId,
        startedAt: now,
        status: "started",
      }),
    );
    const exported = await createProfileProgressExport(repositories, profileId, now);
    const serialized = JSON.stringify(exported);

    expect(exported).toMatchObject({
      exportVersion: 1,
      profileAlias: "local-profile",
    });
    expect(exported.practiceEvents).toHaveLength(1);
    expect(serialized).not.toContain("Testspeler");
    expect(serialized).not.toContain(profileId);
    expect(serialized).not.toContain("avatar-1");
  });

  it("markeert events pas na 24 maanden voor handmatige compactiereview", () => {
    expect(
      evaluatePracticeEventRetention(
        { ...createEventFixture(), occurredAt: "2024-06-01T00:00:00.000Z" },
        new Date("2026-07-23T00:00:00.000Z"),
      ),
    ).toBe("review-for-compaction");
    expect(
      evaluatePracticeEventRetention(createEventFixture(), new Date("2026-07-23T00:00:00.000Z")),
    ).toBe("retain");
  });
});
