import { describe, expect, it } from "vitest";
import type { RuntimeStorage } from "../../../../game-platform/contracts";
import {
  emptyVoiceScrollerRecord,
  readVoiceScrollerRecord,
  resetVoiceScrollerRecord,
  saveVoiceScrollerRecord,
  updateVoiceScrollerRecord,
} from "./voiceSideScrollerRecord";

const createMemoryStorage = (): RuntimeStorage => {
  const store = new Map<string, string>();
  return {
    get: (key: string) => store.get(key) ?? null,
    set: (key: string, value: string) => {
      store.set(key, value);
    },
    remove: (key: string) => {
      store.delete(key);
    },
  } as unknown as RuntimeStorage;
};

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

  it("wist het record van een profiel bij een reset (T-11)", () => {
    const storage = createMemoryStorage();
    saveVoiceScrollerRecord("profiel-1", { bestCombo: 4, bestDistanceMeters: 88 }, storage);
    expect(readVoiceScrollerRecord("profiel-1", storage).bestDistanceMeters).toBe(88);

    resetVoiceScrollerRecord("profiel-1", storage);

    expect(readVoiceScrollerRecord("profiel-1", storage)).toEqual(emptyVoiceScrollerRecord);
  });

  it("houdt records strikt per profiel gescheiden (T-12)", () => {
    const storage = createMemoryStorage();
    saveVoiceScrollerRecord("profiel-1", { bestCombo: 4, bestDistanceMeters: 88 }, storage);
    saveVoiceScrollerRecord("profiel-2", { bestCombo: 1, bestDistanceMeters: 10 }, storage);

    // Reset van profiel-1 laat profiel-2 ongemoeid.
    resetVoiceScrollerRecord("profiel-1", storage);

    expect(readVoiceScrollerRecord("profiel-1", storage)).toEqual(emptyVoiceScrollerRecord);
    expect(readVoiceScrollerRecord("profiel-2", storage)).toEqual({
      bestCombo: 1,
      bestDistanceMeters: 10,
    });
  });
});
