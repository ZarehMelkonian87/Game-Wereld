import { describe, expect, it } from "vitest";
import { KNOWN_DUTCH_GAME_WORDS, matchAcousticFeaturesToWord } from "./localSpeechEngine";

describe("localSpeechEngine", () => {
  it("bevat de kernwoordenschat van het spel", () => {
    expect(KNOWN_DUTCH_GAME_WORDS).toContain("bal");
    expect(KNOWN_DUTCH_GAME_WORDS).toContain("boot");
    expect(KNOWN_DUTCH_GAME_WORDS).toContain("dolfijn");
    expect(KNOWN_DUTCH_GAME_WORDS).toContain("boven");
    expect(KNOWN_DUTCH_GAME_WORDS).toContain("onder");
  });

  it("matchAcousticFeaturesToWord kiest een kandidaatwoord en levert alternatieven", () => {
    const features = {
      durationMs: 400,
      energy: 50,
      highFreqRatio: 0.4,
      lowFreqRatio: 0.2,
      midFreqRatio: 0.4,
      zeroCrossings: 10,
    };

    const match = matchAcousticFeaturesToWord(features);
    expect(match.word).toBeDefined();
    expect(typeof match.word).toBe("string");
    expect(match.confidence).toBeGreaterThanOrEqual(0.5);
    expect(match.alternatives.length).toBeGreaterThan(0);
  });

  it("geeft hogere score aan sisklanken bij hoge frequentieratio", () => {
    const sibilantFeatures = {
      durationMs: 300,
      energy: 40,
      highFreqRatio: 0.6,
      lowFreqRatio: 0.1,
      midFreqRatio: 0.3,
      zeroCrossings: 20,
    };

    const candidates = ["boot", "schelp"];
    const match = matchAcousticFeaturesToWord(sibilantFeatures, candidates);
    expect(match.word).toBe("schelp");
  });
});
