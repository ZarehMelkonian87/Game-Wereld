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
    skillIds: [gameId === "rekenen-strand-bezem-escape" ? "number-quantity-1-5" : "vocabulary"],
    taskId: `${gameId}-task`,
  });

describe("voortgang over meerdere games", () => {
  it("projecteert iedere game met de themakoppeling uit het manifest", () => {
    const result = getProgressData(
      "alltime",
      [
        createEvent("strand-bezem-escape", "event-vocabulary"),
        createEvent("rekenen-strand-bezem-escape", "event-math"),
      ],
      new Date("2026-07-23T12:00:00.000Z"),
    );

    expect(result.map(({ themeId }) => themeId).sort()).toEqual(["math", "vocabulary"]);
    expect(result.every(({ evidence }) => evidence.eventCount === 1)).toBe(true);
  });
});
