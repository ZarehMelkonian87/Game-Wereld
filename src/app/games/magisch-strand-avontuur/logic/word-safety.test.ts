import { describe, expect, it } from "vitest";
import {
  containsUnwantedWord,
  filterUnwantedCandidates,
  findUnwantedWord,
  sanitizeSpokenText,
} from "./word-safety";

describe("word-safety", () => {
  it("herkent een ongewenst woord als heel woord", () => {
    expect(containsUnwantedWord("kut")).toBe(true);
    expect(containsUnwantedWord("dat is echt shit")).toBe(true);
    expect(findUnwantedWord("hou je kop klootzak")).toBe("klootzak");
  });

  it("blokkeert nette strandwoorden niet", () => {
    for (const word of ["bal", "boot", "zon", "schelp", "krab", "parasol", "dolfijn", "zee"]) {
      expect(containsUnwantedWord(word)).toBe(false);
    }
  });

  it("voorkomt de Scunthorpe-valkuil (deelstring in net woord)", () => {
    // "hoer" zit in "hoera", maar "hoera" is een net woord.
    expect(containsUnwantedWord("hoera")).toBe(false);
    // "klote" mag niet matchen binnen "kloten"? -> "kloten" staat niet in de
    // lijst en "klote" is een heel woord, dus "kloterig" matcht niet.
    expect(containsUnwantedWord("kloterig")).toBe(false);
  });

  it("maskeert alleen het ongewenste woord in de weergave", () => {
    expect(sanitizeSpokenText("stomme kut bal")).toBe("stomme … bal");
    expect(sanitizeSpokenText("zet de bal boven de zee")).toBe("zet de bal boven de zee");
  });

  it("filtert ongewenste kandidaten maar houdt het geldige woord", () => {
    const { clean, hadUnwanted } = filterUnwantedCandidates(["stomme bal", "shit", "bal"]);

    expect(hadUnwanted).toBe(true);
    expect(clean).toContain("bal");
    expect(clean).not.toContain("shit");
  });

  it("meldt geen ongewenst woord bij schone kandidaten", () => {
    const { hadUnwanted } = filterUnwantedCandidates(["bal", "boot"]);

    expect(hadUnwanted).toBe(false);
  });
});
