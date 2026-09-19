import { describe, expect, it } from "vitest";
import { classifyPlatform, requiresDownloadGate, type PlatformEnv } from "./platformDetection";

const baseEnv: PlatformEnv = {
  coarsePointer: false,
  hasTouchStart: false,
  maxTouchPoints: 0,
  minViewportSide: 1280,
  standalone: false,
  userAgent: "",
};

const env = (overrides: Partial<PlatformEnv>): PlatformEnv => ({ ...baseEnv, ...overrides });

describe("classifyPlatform (T-38)", () => {
  it("herkent een desktop-browser (geen aanraking)", () => {
    const info = classifyPlatform(
      env({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      }),
    );

    expect(info.formFactor).toBe("desktop");
    expect(info.displayMode).toBe("browser");
    expect(info.isInstalled).toBe(false);
    expect(requiresDownloadGate(info)).toBe(false);
  });

  it("herkent een Android-telefoon (Mobile-UA + aanraking)", () => {
    const info = classifyPlatform(
      env({
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36",
        maxTouchPoints: 5,
        coarsePointer: true,
        minViewportSide: 412,
      }),
    );

    expect(info.formFactor).toBe("phone");
    expect(info.isTouch).toBe(true);
    expect(requiresDownloadGate(info)).toBe(true);
  });

  it("herkent een iPhone", () => {
    const info = classifyPlatform(
      env({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605 Mobile/15E148",
        maxTouchPoints: 5,
        minViewportSide: 390,
      }),
    );

    expect(info.formFactor).toBe("phone");
  });

  it("herkent een iPad (klassieke UA)", () => {
    const info = classifyPlatform(
      env({
        userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605 Mobile/15E148",
        maxTouchPoints: 5,
        minViewportSide: 768,
      }),
    );

    expect(info.formFactor).toBe("tablet");
    expect(requiresDownloadGate(info)).toBe(true);
  });

  it("herkent een iPadOS-tablet die zich als Macintosh voordoet", () => {
    const info = classifyPlatform(
      env({
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605 Version/17 Safari/605",
        maxTouchPoints: 5,
        coarsePointer: true,
        minViewportSide: 834,
      }),
    );

    expect(info.formFactor).toBe("tablet");
  });

  it("valt terug op schermgrootte bij een aanraaktoestel zonder UA-hint", () => {
    const smallTouch = classifyPlatform(
      env({ userAgent: "Onbekend", maxTouchPoints: 5, minViewportSide: 420 }),
    );
    const largeTouch = classifyPlatform(
      env({ userAgent: "Onbekend", maxTouchPoints: 5, minViewportSide: 900 }),
    );

    expect(smallTouch.formFactor).toBe("phone");
    expect(largeTouch.formFactor).toBe("tablet");
  });

  it("markeert een geïnstalleerde PWA als standalone/geïnstalleerd", () => {
    const info = classifyPlatform(
      env({
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36",
        maxTouchPoints: 5,
        minViewportSide: 412,
        standalone: true,
      }),
    );

    expect(info.displayMode).toBe("standalone");
    expect(info.isInstalled).toBe(true);
  });
});
