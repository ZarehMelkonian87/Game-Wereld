import { describe, expect, it } from "vitest";
import { emptyVoiceScrollerRecord, updateVoiceScrollerRecord } from "./voiceSideScrollerRecord";

describe("voiceSideScrollerRecord (T-30)", () => {
  it("markeert een nieuw afstandsrecord", () => {
    const result = updateVoiceScrollerRecord(emptyVoiceScrollerRecord, {
      comboReached: 2,
      distanceMeters: 42,
    });

    expect(result.isNewDistanceRecord).toBe(true);
    expect(result.record.bestDistanceMeters).toBe(42);
  });

  it("behoudt het bestaande record als de ronde korter was", () => {
    const result = updateVoiceScrollerRecord(
      { bestCombo: 5, bestDistanceMeters: 100 },
      { comboReached: 3, distanceMeters: 40 },
    );

    expect(result.isNewDistanceRecord).toBe(false);
    expect(result.isNewComboRecord).toBe(false);
    expect(result.record.bestDistanceMeters).toBe(100);
    expect(result.record.bestCombo).toBe(5);
  });

  it("markeert een nieuw comborecord los van de afstand", () => {
    const result = updateVoiceScrollerRecord(
      { bestCombo: 2, bestDistanceMeters: 100 },
      { comboReached: 6, distanceMeters: 30 },
    );

    expect(result.isNewComboRecord).toBe(true);
    expect(result.record.bestCombo).toBe(6);
    expect(result.record.bestDistanceMeters).toBe(100);
  });
});
