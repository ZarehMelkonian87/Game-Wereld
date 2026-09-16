import { describe, expect, it } from "vitest";
import { practiceEventEnvelopeSchema } from "../../storage";
import { getProgressData } from "./progressData";

const createEvent = (gameId: string, id: string) =>
  practiceEventEnvelopeSchema.parse({
    assistance: [],
    attemptNumber: 1,
    contentVersion: `${gameId}-2026.07`,
    gameId,
    id,
    occurredAt: "2026-07-23T10:00:00.000Z",
    outcome: "correct",
    profileId: "profile-1",
    responseTimeMs: 500,
    schemaVersion: 1,
    sessionId: "session-1",
    skillIds: [gameId === "rekenen-strand-avontuur" ? "number-quantity-1-5" : "vocabulary"],
    taskId: `${gameId}-task`,
  });

describe("voortgang over meerdere games", () => {
  it("projecteert iedere game met de themakoppeling uit het manifest", () => {
    const result = getProgressData(
      "alltime",
      [
        createEvent("magisch-strand-avontuur", "event-vocabulary"),
        createEvent("rekenen-strand-avontuur", "event-math"),
      ],
      new Date("2026-07-23T12:00:00.000Z"),
    );

    expect(result.map(({ themeId }) => themeId).sort()).toEqual(["math", "vocabulary"]);
    expect(result.every(({ evidence }) => evidence.eventCount === 1)).toBe(true);
  });

  it("toont een categorie-uitsplitsing en tempo uit het observatiemodel (T-17)", () => {
    const richEvent = practiceEventEnvelopeSchema.parse({
      assistance: [],
      attemptNumber: 1,
      contentVersion: "magisch-strand-avontuur-2026.07",
      gameId: "magisch-strand-avontuur",
      id: "event-rich",
      occurredAt: "2026-07-23T10:00:00.000Z",
      outcome: "correct",
      profileId: "profile-1",
      responseTimeMs: 4000,
      schemaVersion: 1,
      sessionId: "session-1",
      skillIds: ["spatial-language", "spatial:op", "vocabulary:boot"],
      taskId: "magisch-strand-avontuur-task",
    });

    const [theme] = getProgressData("alltime", [richEvent], new Date("2026-07-23T12:00:00.000Z"));

    expect(theme?.categoryBreakdown.map((category) => category.name)).toEqual(
      expect.arrayContaining([
        "Ruimtelijke taal",
        "Ruimtebegrip ‘op’",
        "Woordenschat (losse woorden)",
      ]),
    );
    expect(theme?.tempo).toEqual({ averageSeconds: 4, measuredResponses: 1 });
  });

  it("laat tempo weg wanneer er geen responstijd is gemeten (T-17)", () => {
    const eventWithoutTime = practiceEventEnvelopeSchema.parse({
      assistance: [],
      attemptNumber: 1,
      contentVersion: "magisch-strand-avontuur-2026.07",
      gameId: "magisch-strand-avontuur",
      id: "event-no-time",
      occurredAt: "2026-07-23T10:00:00.000Z",
      outcome: "correct",
      profileId: "profile-1",
      schemaVersion: 1,
      sessionId: "session-1",
      skillIds: ["vocabulary:boot"],
      taskId: "magisch-strand-avontuur-task",
    });

    const [theme] = getProgressData(
      "alltime",
      [eventWithoutTime],
      new Date("2026-07-23T12:00:00.000Z"),
    );

    expect(theme?.tempo).toBeUndefined();
  });
});
