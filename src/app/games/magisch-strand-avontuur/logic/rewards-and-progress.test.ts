import { describe, expect, it } from "vitest";
import type { RuntimeStorage } from "../../../game-platform/contracts";
import {
  addProfileTotals,
  readProfileTotals,
  resolveNewRewardUnlocks,
  strandRewards,
} from "./rewards";

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

describe("strandschat-beloningen", () => {
  it("speelt niets vrij onder de eerste drempel", () => {
    expect(resolveNewRewardUnlocks({ totalWordStars: 2, unlockedRewardIds: [] })).toEqual([]);
  });

  it("speelt de eerste beloning vrij op de eerste drempel (3 sterren)", () => {
    const unlocks = resolveNewRewardUnlocks({ totalWordStars: 3, unlockedRewardIds: [] });
    expect(unlocks.map((reward) => reward.id)).toEqual(["sticker-schelp-starter"]);
  });

  it("speelt geleidelijk meer vrij naarmate het totaal stijgt", () => {
    const unlocks = resolveNewRewardUnlocks({ totalWordStars: 10, unlockedRewardIds: [] });
    expect(unlocks.map((reward) => reward.id)).toEqual([
      "sticker-schelp-starter",
      "broom-color-sea-blue",
      "sticker-dolfijn",
    ]);
  });

  it("geeft een reeds vrijgespeelde beloning niet nogmaals terug", () => {
    const unlocks = resolveNewRewardUnlocks({
      totalWordStars: 10,
      unlockedRewardIds: ["sticker-schelp-starter", "broom-color-sea-blue"],
    });
    expect(unlocks.map((reward) => reward.id)).toEqual(["sticker-dolfijn"]);
  });

  it("heeft strikt oplopende drempels (geen alles-tegelijk bij de eerste actie)", () => {
    const thresholds = strandRewards.map((reward) => reward.unlockAfterWordStars);
    const sorted = [...thresholds].sort((a, b) => a - b);
    expect(thresholds).toEqual(sorted);
    expect(thresholds[0]).toBeGreaterThan(1);
  });
});

describe("cumulatieve profieltotalen", () => {
  it("start op nul voor een nieuw profiel", () => {
    const storage = createMemoryStorage();
    expect(readProfileTotals("profiel-1", storage)).toEqual({ speed: 0, wordStars: 0 });
  });

  it("telt verdiende sterren cumulatief op en bewaart per profiel", () => {
    const storage = createMemoryStorage();
    addProfileTotals("profiel-1", storage, { speed: 1, wordStars: 2 });
    const totals = addProfileTotals("profiel-1", storage, { speed: 1, wordStars: 2 });
    expect(totals).toEqual({ speed: 2, wordStars: 4 });
    expect(readProfileTotals("profiel-1", storage)).toEqual({ speed: 2, wordStars: 4 });
    // Ander profiel blijft gescheiden op nul.
    expect(readProfileTotals("profiel-2", storage)).toEqual({ speed: 0, wordStars: 0 });
  });
});
