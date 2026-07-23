import { describe, expect, it } from "vitest";
import {
  createEventId,
  createGameId,
  createProfileId,
  createSessionId,
  createTaskId,
} from "../game-platform/contracts";
import {
  applyPracticeEvent,
  createEmptyProgressProjection,
  projectPracticeEvents,
} from "./progressProjector";
import { practiceEventEnvelopeSchema, type PracticeEventEnvelope } from "./schemas";

const profileId = createProfileId("profile-projector");
const gameId = createGameId("strand-bezem-escape");
const sessionId = createSessionId("session-projector");
const calculatedAt = "2026-07-23T12:00:00.000Z";

const eventFixture = (
  id: string,
  occurredAt: string,
  patch: Partial<PracticeEventEnvelope> = {},
): PracticeEventEnvelope =>
  practiceEventEnvelopeSchema.parse({
    assistance: [],
    attemptNumber: 1,
    contentVersion: "content-v1",
    gameId,
    id: createEventId(id),
    occurredAt,
    outcome: "correct",
    profileId,
    responseTimeMs: 500,
    schemaVersion: 1,
    sessionId,
    skillIds: ["receptive-vocabulary"],
    taskId: createTaskId(`task-${id}`),
    ...patch,
  });

describe("practice projector", () => {
  it("levert een uitlegbare lege projectie", () => {
    expect(createEmptyProgressProjection(profileId, gameId, calculatedAt)).toMatchObject({
      attempts: 0,
      projectorVersion: 1,
      sourceSelection: { eventCount: 0 },
      status: "not-started",
    });
  });

  it("onderscheidt zelfstandig, ondersteund, incorrect en skipped", () => {
    const projection = projectPracticeEvents({
      calculatedAt,
      events: [
        eventFixture("1", "2026-07-20T10:00:00.000Z"),
        eventFixture("2", "2026-07-20T10:01:00.000Z"),
        eventFixture("3", "2026-07-20T10:02:00.000Z"),
        eventFixture("4", "2026-07-20T10:03:00.000Z", {
          assistance: ["instruction-replay", "visual-hint", "spoken-help"],
        }),
        eventFixture("5", "2026-07-20T10:04:00.000Z", { outcome: "incorrect" }),
        eventFixture("6", "2026-07-20T10:05:00.000Z", { outcome: "skipped" }),
      ],
      gameId,
      profileId,
    });

    expect(projection).toMatchObject({
      attempts: 6,
      hintsUsed: 1,
      incorrect: 1,
      independentCorrect: 3,
      instructionReplays: 1,
      measuredResponses: 6,
      score: 360,
      skipped: 1,
      spokenHelp: 1,
      stars: 3,
      status: "practicing",
      supportedCorrect: 1,
      totalResponseTimeMs: 3000,
    });
  });

  it("wordt confident vanaf drie zelfstandige successen en minimaal zestig procent bewijs", () => {
    const projection = projectPracticeEvents({
      calculatedAt,
      events: [
        eventFixture("1", "2026-07-20T10:00:00.000Z"),
        eventFixture("2", "2026-07-20T10:01:00.000Z"),
        eventFixture("3", "2026-07-20T10:02:00.000Z"),
        eventFixture("4", "2026-07-20T10:03:00.000Z", { outcome: "incorrect" }),
      ],
      gameId,
      profileId,
    });
    expect(projection.status).toBe("confident");
  });

  it("dedupliceert, sorteert en selecteert een tijdsvenster deterministisch", () => {
    const included = eventFixture("included", "2026-07-20T10:00:00.000Z");
    const projection = projectPracticeEvents({
      calculatedAt,
      events: [
        eventFixture("late", "2026-07-22T10:00:00.000Z"),
        included,
        included,
        eventFixture("early", "2026-07-18T10:00:00.000Z"),
      ],
      gameId,
      profileId,
      selection: {
        fromOccurredAt: "2026-07-19T00:00:00.000Z",
        throughOccurredAt: "2026-07-21T00:00:00.000Z",
      },
    });
    expect(projection).toMatchObject({
      attempts: 1,
      lastPracticedAt: included.occurredAt,
      sourceSelection: {
        eventCount: 1,
        fromOccurredAt: included.occurredAt,
        throughOccurredAt: included.occurredAt,
      },
    });
  });

  it("maakt incremental en volledige rebuild identiek", () => {
    const events = [
      eventFixture("1", "2026-07-20T10:00:00.000Z", {
        skillIds: ["receptive-vocabulary", "spatial:in"],
      }),
      eventFixture("2", "2026-07-20T10:01:00.000Z", {
        assistance: ["visual-hint"],
        skillIds: ["spatial:in"],
      }),
    ];
    const incremental = events.reduce(
      (current, event) => applyPracticeEvent(current, event, calculatedAt),
      createEmptyProgressProjection(profileId, gameId, calculatedAt),
    );
    const rebuilt = projectPracticeEvents({
      calculatedAt,
      events: [...events].reverse(),
      gameId,
      profileId,
    });
    expect(incremental).toEqual(rebuilt);
    expect(rebuilt.skillSummaries).toHaveLength(2);
  });

  it("weigert events voor een andere projectie en privacyvreemde velden", () => {
    const projection = createEmptyProgressProjection(profileId, gameId, calculatedAt);
    expect(() =>
      applyPracticeEvent(
        projection,
        eventFixture("other", calculatedAt, { profileId: createProfileId("other") }),
      ),
    ).toThrow("hoort niet");
    expect(
      practiceEventEnvelopeSchema.safeParse({
        ...eventFixture("privacy", calculatedAt),
        transcript: "niet bewaren",
      }).success,
    ).toBe(false);
  });
});
