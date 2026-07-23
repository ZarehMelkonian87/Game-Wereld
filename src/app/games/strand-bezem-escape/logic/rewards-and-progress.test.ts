import { beforeEach, describe, expect, it } from "vitest";
import { appendPracticeEvent, readBezemEscapeProgress } from "./progress";
import { resolveNewRewardUnlocks } from "./rewards";

describe("rewards and progress", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

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

  it("persists a practice event and applies an event id only once", () => {
    const profileId = "test-profile";
    const event = {
      assistance: "none" as const,
      attempts: 1,
      audioRepeats: 0,
      hintsUsed: 0,
      id: "event-1",
      instructionId: "place-boat",
      isCorrect: true,
      languageDomains: ["spatial-language" as const],
      mode: "listen-and-place" as const,
      result: "correct-without-help" as const,
      spatialConcepts: ["in" as const],
      speedEarned: 2,
      targetWords: ["boot"],
      wordStarsEarned: 1,
    };

    appendPracticeEvent(profileId, event);
    appendPracticeEvent(profileId, event);

    const progress = readBezemEscapeProgress(profileId);

    expect(progress.attempts).toHaveLength(1);
    expect(progress.totalSpeed).toBe(2);
    expect(progress.totalWordStars).toBe(1);
    expect(progress.practicedWords.boot).toBe(1);
    expect(progress.spatialConcepts.in).toMatchObject({
      correctWithoutHelp: 1,
      practiced: 1,
    });
  });
});
