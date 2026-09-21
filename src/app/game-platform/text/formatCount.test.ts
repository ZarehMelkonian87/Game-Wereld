import { describe, expect, it } from "vitest";
import { formatCount } from "./formatCount";

describe("formatCount", () => {
  it("kiest enkelvoud bij precies één", () => {
    expect(formatCount(1, "bestand", "bestanden")).toBe("1 bestand");
    expect(formatCount(1, "ster", "sterren")).toBe("1 ster");
  });

  it("kiest meervoud bij nul en meer dan één", () => {
    expect(formatCount(0, "bestand", "bestanden")).toBe("0 bestanden");
    expect(formatCount(12, "oefenpoging", "oefenpogingen")).toBe("12 oefenpogingen");
  });
});
