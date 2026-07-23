import { describe, expect, it } from "vitest";
import { resolveNewRewardUnlocks } from "./rewards";

describe("rewards", () => {
  it("unlocks each earned reward once", () => {
    const firstUnlocks = resolveNewRewardUnlocks({
      totalSpeed: 1,
      totalWordStars: 1,
      unlockedRewardIds: [],
    });

    expect(firstUnlocks.map((reward) => reward.id)).toEqual([
      "sticker-schelp-starter",
      "broom-color-sea-blue",
    ]);
    expect(
      resolveNewRewardUnlocks({
        totalSpeed: 10,
        totalWordStars: 10,
        unlockedRewardIds: firstUnlocks.map((reward) => reward.id),
      }),
    ).toEqual([]);
  });
});
