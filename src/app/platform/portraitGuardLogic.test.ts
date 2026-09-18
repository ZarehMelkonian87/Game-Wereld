import { describe, expect, it } from "vitest";
import type { PlatformInfo } from "./platformDetection";
import { shouldShowPortraitGuard } from "./portraitGuardLogic";

const info = (formFactor: PlatformInfo["formFactor"]): PlatformInfo => ({
  displayMode: "browser",
  formFactor,
  isInstalled: false,
  isTouch: formFactor !== "desktop",
});

describe("shouldShowPortraitGuard (T-42, nooit liggend op mobiel)", () => {
  it("toont de guard op een telefoon in liggende stand", () => {
    expect(shouldShowPortraitGuard(info("phone"), true)).toBe(true);
  });

  it("toont de guard ook op een tablet in liggende stand", () => {
    expect(shouldShowPortraitGuard(info("tablet"), true)).toBe(true);
  });

  it("verbergt de guard zodra het toestel rechtop staat", () => {
    expect(shouldShowPortraitGuard(info("phone"), false)).toBe(false);
  });

  it("doet niets op desktop, ook al is het venster liggend", () => {
    expect(shouldShowPortraitGuard(info("desktop"), true)).toBe(false);
  });
});
