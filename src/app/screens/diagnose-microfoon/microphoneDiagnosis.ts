import type { PlatformInfo } from "../../platform";

/**
 * Pure hulplogica voor de microfoon-diagnose (T-52): browser/OS herkennen uit
 * de user-agent, en de omgevings- en logregels tot één plakbaar rapport
 * samenvoegen. Geen DOM, zodat het los te testen is.
 */

export type DiagnosisBrowser =
  "chrome" | "edge" | "firefox" | "onbekend" | "safari" | "samsung-internet";

export type DiagnosisOs = "android" | "ipados" | "ios" | "linux" | "macos" | "onbekend" | "windows";

export interface DiagnosisEnvironment {
  browser: DiagnosisBrowser;
  displayMode: PlatformInfo["displayMode"];
  formFactor: PlatformInfo["formFactor"];
  hasGetUserMedia: boolean;
  hasPermissionsApi: boolean;
  hasSpeechRecognition: boolean;
  hasSpeechSynthesis: boolean;
  isOnline: boolean;
  isSecureContext: boolean;
  os: DiagnosisOs;
  /** "SpeechRecognition", "webkitSpeechRecognition" of "geen". */
  speechRecognitionGlobal: string;
  userAgent: string;
}

export interface DiagnosisLogLine {
  /** Milliseconden sinds het openen van het scherm. */
  at: number;
  step: string;
  text: string;
}

export const detectBrowser = (userAgent: string): DiagnosisBrowser => {
  const ua = userAgent.toLowerCase();
  if (ua.includes("samsungbrowser")) return "samsung-internet";
  if (ua.includes("edg/") || ua.includes("edgios") || ua.includes("edga")) return "edge";
  if (ua.includes("firefox") || ua.includes("fxios")) return "firefox";
  if (ua.includes("crios") || (ua.includes("chrome") && !ua.includes("edg"))) return "chrome";
  if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("crios")) return "safari";
  return "onbekend";
};

export const detectOs = (
  userAgent: string,
  { maxTouchPoints = 0, platform = "" }: { maxTouchPoints?: number; platform?: string } = {},
): DiagnosisOs => {
  const ua = userAgent.toLowerCase();
  if (ua.includes("android")) return "android";
  if (ua.includes("ipad")) return "ipados";
  if (ua.includes("iphone") || ua.includes("ipod")) return "ios";
  // iPadOS 13+ doet zich voor als een Mac; alleen het aantal touchpunten verraadt hem.
  if ((ua.includes("mac os") || platform.toLowerCase().startsWith("mac")) && maxTouchPoints > 1) {
    return "ipados";
  }
  if (ua.includes("mac os")) return "macos";
  if (ua.includes("windows")) return "windows";
  if (ua.includes("linux")) return "linux";
  return "onbekend";
};

const browserLabels: Record<DiagnosisBrowser, string> = {
  chrome: "Chrome",
  edge: "Edge",
  firefox: "Firefox",
  onbekend: "Onbekende browser",
  safari: "Safari",
  "samsung-internet": "Samsung Internet",
};

const osLabels: Record<DiagnosisOs, string> = {
  android: "Android",
  ipados: "iPadOS",
  ios: "iOS",
  linux: "Linux",
  macos: "macOS",
  onbekend: "Onbekend OS",
  windows: "Windows",
};

/** Bijv. "iOS · Safari · telefoon · geïnstalleerde app". */
export const describeEnvironment = (environment: DiagnosisEnvironment): string =>
  [
    osLabels[environment.os],
    browserLabels[environment.browser],
    environment.formFactor === "phone"
      ? "telefoon"
      : environment.formFactor === "tablet"
        ? "tablet"
        : "desktop",
    environment.displayMode === "standalone" ? "geïnstalleerde app" : "browsertab",
  ].join(" · ");

const yesNo = (value: boolean) => (value ? "ja" : "nee");

const formatSeconds = (milliseconds: number) => `${(milliseconds / 1000).toFixed(1)}s`;

export const buildDiagnosisReport = ({
  appVersion,
  environment,
  lines,
  permissionState,
  supportReason,
}: {
  appVersion: string;
  environment: DiagnosisEnvironment;
  lines: DiagnosisLogLine[];
  permissionState: string;
  supportReason: string;
}): string => {
  const header = [
    `Microfoon-diagnose Game Wereld (T-52) — app ${appVersion}`,
    `Omgeving: ${describeEnvironment(environment)}`,
    `User-agent: ${environment.userAgent}`,
    `Beveiligde context (https): ${yesNo(environment.isSecureContext)} · online: ${yesNo(environment.isOnline)}`,
    `SpeechRecognition aanwezig: ${yesNo(environment.hasSpeechRecognition)} (${environment.speechRecognitionGlobal}) · ondersteuning: ${supportReason}`,
    `getUserMedia aanwezig: ${yesNo(environment.hasGetUserMedia)} · Permissions API: ${yesNo(environment.hasPermissionsApi)} · mic-toestemming: ${permissionState}`,
    `speechSynthesis aanwezig: ${yesNo(environment.hasSpeechSynthesis)}`,
    "",
    "Logboek:",
  ];
  const body =
    lines.length === 0
      ? ["(nog geen stappen uitgevoerd)"]
      : lines.map((line) => `[${formatSeconds(line.at)}] ${line.step}: ${line.text}`);
  return [...header, ...body].join("\n");
};
