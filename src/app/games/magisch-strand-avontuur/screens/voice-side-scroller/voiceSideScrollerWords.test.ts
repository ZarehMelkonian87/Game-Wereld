import { describe, expect, it } from "vitest";
import { matchVoiceSideScrollerWord } from "./voiceSideScrollerWords";

describe("matchVoiceSideScrollerWord", () => {
  it("herkent exacte woorden en verkleinwoorden / meervoudsvormen", () => {
    expect(matchVoiceSideScrollerWord({ targetWord: "boot", transcript: "bootje" }).isMatch).toBe(
      true,
    );
    expect(matchVoiceSideScrollerWord({ targetWord: "krab", transcript: "krabben" }).isMatch).toBe(
      true,
    );
    expect(matchVoiceSideScrollerWord({ targetWord: "zon", transcript: "zonnetje" }).isMatch).toBe(
      true,
    );
    expect(
      matchVoiceSideScrollerWord({ targetWord: "parasol", transcript: "strandparasol" }).isMatch,
    ).toBe(true);
    expect(
      matchVoiceSideScrollerWord({ targetWord: "dolfijn", transcript: "dolfijntje" }).isMatch,
    ).toBe(true);
    expect(
      matchVoiceSideScrollerWord({ targetWord: "schelp", transcript: "schelpjes" }).isMatch,
    ).toBe(true);
    expect(matchVoiceSideScrollerWord({ targetWord: "bal", transcript: "strandbal" }).isMatch).toBe(
      true,
    );
  });

  it("herkent een doelwoord binnen een gesproken zin", () => {
    expect(
      matchVoiceSideScrollerWord({ targetWord: "boot", transcript: "kijk een boot" }).isMatch,
    ).toBe(true);
    expect(
      matchVoiceSideScrollerWord({ targetWord: "dolfijn", transcript: "daar zwemt een dolfijn" })
        .isMatch,
    ).toBe(true);
  });

  it("geeft geen match bij een niet-overeenkomend woord", () => {
    expect(matchVoiceSideScrollerWord({ targetWord: "boot", transcript: "zeester" }).isMatch).toBe(
      false,
    );
  });
});
