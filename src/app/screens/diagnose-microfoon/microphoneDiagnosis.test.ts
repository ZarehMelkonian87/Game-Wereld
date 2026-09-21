import { describe, expect, it } from "vitest";
import {
  buildDiagnosisReport,
  describeEnvironment,
  detectBrowser,
  detectOs,
  type DiagnosisEnvironment,
} from "./microphoneDiagnosis";

const iphoneSafariUa =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const ipadOsUa =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";
const androidChromeUa =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";
const samsungInternetUa =
  "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36";
const iphoneChromeUa =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.0.0 Mobile/15E148 Safari/604.1";

describe("detectBrowser / detectOs (T-52)", () => {
  it("herkent Safari op iPhone", () => {
    expect(detectBrowser(iphoneSafariUa)).toBe("safari");
    expect(detectOs(iphoneSafariUa)).toBe("ios");
  });

  it("herkent Chrome op iPhone als Chrome (CriOS), niet als Safari", () => {
    expect(detectBrowser(iphoneChromeUa)).toBe("chrome");
    expect(detectOs(iphoneChromeUa)).toBe("ios");
  });

  it("herkent iPadOS achter een Mac-user-agent via de touchpunten", () => {
    expect(detectOs(ipadOsUa, { maxTouchPoints: 5, platform: "MacIntel" })).toBe("ipados");
    expect(detectOs(ipadOsUa, { maxTouchPoints: 0, platform: "MacIntel" })).toBe("macos");
  });

  it("onderscheidt Samsung Internet van Chrome op Android", () => {
    expect(detectBrowser(androidChromeUa)).toBe("chrome");
    expect(detectBrowser(samsungInternetUa)).toBe("samsung-internet");
    expect(detectOs(samsungInternetUa)).toBe("android");
  });
});

const environment: DiagnosisEnvironment = {
  browser: "safari",
  displayMode: "standalone",
  formFactor: "phone",
  hasGetUserMedia: true,
  hasPermissionsApi: false,
  hasSpeechRecognition: false,
  hasSpeechSynthesis: true,
  isOnline: true,
  isSecureContext: true,
  os: "ios",
  speechRecognitionGlobal: "geen",
  userAgent: iphoneSafariUa,
};

describe("buildDiagnosisReport", () => {
  it("beschrijft de omgeving leesbaar", () => {
    expect(describeEnvironment(environment)).toBe("iOS · Safari · telefoon · geïnstalleerde app");
  });

  it("zet omgeving, ondersteuning en logregels in één plakbaar rapport", () => {
    const report = buildDiagnosisReport({
      appVersion: "2026-09-21T10:00:00.000Z",
      environment,
      lines: [
        { at: 1234, step: "Stap 1 · toestemming", text: "resultaat: granted" },
        { at: 8000, step: "Stap 2 · korte herkenning", text: "onerror: not-allowed" },
      ],
      permissionState: "granted — Microfoon is toegestaan.",
      supportReason: "api-missing",
    });
    expect(report).toContain("app 2026-09-21T10:00:00.000Z");
    expect(report).toContain("Omgeving: iOS · Safari · telefoon · geïnstalleerde app");
    expect(report).toContain("SpeechRecognition aanwezig: nee (geen) · ondersteuning: api-missing");
    expect(report).toContain("mic-toestemming: granted — Microfoon is toegestaan.");
    expect(report).toContain("[1.2s] Stap 1 · toestemming: resultaat: granted");
    expect(report).toContain("[8.0s] Stap 2 · korte herkenning: onerror: not-allowed");
  });

  it("meldt wanneer er nog geen stappen zijn uitgevoerd", () => {
    const report = buildDiagnosisReport({
      appVersion: "x",
      environment,
      lines: [],
      permissionState: "unknown",
      supportReason: "api-missing",
    });
    expect(report).toContain("(nog geen stappen uitgevoerd)");
  });
});
