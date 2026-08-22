import { describe, expect, it } from "vitest";
import { countingRounds, isCorrectCountingAnswer } from "./counting-rounds";

describe("telopdrachten", () => {
  it("dekt alle hoeveelheden 1 tot en met 5 met stabiele taak-id's", () => {
    expect(countingRounds.map((round) => round.amount).sort()).toEqual([1, 2, 3, 4, 5]);
    expect(new Set(countingRounds.map((round) => round.taskId)).size).toBe(countingRounds.length);
    countingRounds.forEach((round) => {
      expect(round.choices).toContain(round.amount);
      expect(round.skillIds).toEqual(["number-quantity-1-5"]);
    });
  });

  it("beoordeelt uitsluitend het cijfer dat gelijk is aan de hoeveelheid als correct", () => {
    const round = countingRounds[1];
    expect(round).toBeDefined();
    if (!round) return;

    expect(isCorrectCountingAnswer(round, round.amount)).toBe(true);
    expect(isCorrectCountingAnswer(round, round.amount + 1)).toBe(false);
  });
});
