import { describe, expect, it } from "vitest";
import { matchVoiceSideScrollerWord } from "./voiceSideScrollerWords";

describe("matchVoiceSideScrollerWord", () => {
  it("herkent exacte woorden en verkleinwoorden / meervoudsvormen", () => {
    expect(
      matchVoiceSideScrollerWord({ targetWord: "leeuw", transcript: "leeuwtje" }).isMatch,
    ).toBe(true);
    expect(matchVoiceSideScrollerWord({ targetWord: "aap", transcript: "apen" }).isMatch).toBe(
      true,
    );
    expect(
      matchVoiceSideScrollerWord({ targetWord: "ballon", transcript: "ballonnetje" }).isMatch,
    ).toBe(true);
    expect(matchVoiceSideScrollerWord({ targetWord: "poes", transcript: "katje" }).isMatch).toBe(
      true,
    );
    expect(matchVoiceSideScrollerWord({ targetWord: "hond", transcript: "hondje" }).isMatch).toBe(
      true,
    );
    expect(
      matchVoiceSideScrollerWord({ targetWord: "hoepel", transcript: "hoepels" }).isMatch,
    ).toBe(true);
    expect(
      matchVoiceSideScrollerWord({ targetWord: "bal", transcript: "jongleerbal" }).isMatch,
    ).toBe(true);
  });

  it("herkent een doelwoord binnen een gesproken zin", () => {
    expect(
      matchVoiceSideScrollerWord({ targetWord: "leeuw", transcript: "kijk een leeuw" }).isMatch,
    ).toBe(true);
    expect(
      matchVoiceSideScrollerWord({ targetWord: "aap", transcript: "daar klimt een aap" }).isMatch,
    ).toBe(true);
  });

  it("geeft geen match bij een niet-overeenkomend woord", () => {
    expect(matchVoiceSideScrollerWord({ targetWord: "leeuw", transcript: "olifant" }).isMatch).toBe(
      false,
    );
  });
});
