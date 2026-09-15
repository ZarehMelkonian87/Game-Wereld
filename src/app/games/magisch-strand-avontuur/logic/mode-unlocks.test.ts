import { describe, expect, it } from "vitest";
import {
  getStarsUntilModeUnlock,
  isModeUnlocked,
  MODE_UNLOCK_WORD_STARS,
} from "./mode-unlocks";

describe("mode-unlocks (T-31)", () => {
  it("Kies het Woord is altijd open (instapmodus)", () => {
    expect(isModeUnlocked("choose-word", 0)).toBe(true);
  });

  it("Zeg & Zet en Zeg & Vlieg zijn dicht bij 0 sterren", () => {
    expect(isModeUnlocked("listen-and-place", 0)).toBe(false);
    expect(isModeUnlocked("zeg-en-vlieg", 0)).toBe(false);
  });

  it("modi openen zodra de drempel gehaald is", () => {
    expect(isModeUnlocked("listen-and-place", MODE_UNLOCK_WORD_STARS["listen-and-place"])).toBe(
      true,
    );
    expect(isModeUnlocked("zeg-en-vlieg", MODE_UNLOCK_WORD_STARS["zeg-en-vlieg"])).toBe(true);
  });

  it("de drempels volgen de leerlijn (oplopend)", () => {
    expect(MODE_UNLOCK_WORD_STARS["choose-word"]).toBeLessThan(
      MODE_UNLOCK_WORD_STARS["listen-and-place"],
    );
    expect(MODE_UNLOCK_WORD_STARS["listen-and-place"]).toBeLessThan(
      MODE_UNLOCK_WORD_STARS["zeg-en-vlieg"],
    );
  });

  it("berekent hoeveel sterren nog tot ontgrendeling", () => {
    expect(getStarsUntilModeUnlock("zeg-en-vlieg", 2)).toBe(
      MODE_UNLOCK_WORD_STARS["zeg-en-vlieg"] - 2,
    );
    expect(getStarsUntilModeUnlock("choose-word", 0)).toBe(0);
    expect(getStarsUntilModeUnlock("listen-and-place", 999)).toBe(0);
  });
});
