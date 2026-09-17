import type { OfflinePackageState } from "../pwa/offlinePackages";
import type { PlatformInfo } from "./platformDetection";
import { requiresDownloadGate } from "./platformDetection";

/**
 * Download-gating-architectuur (T-39, GDD §13.2). Zet de status van de offline-
 * pakketten van één game om in één **gate-beslissing**:
 *
 * - **Webbrowser (desktop):** `mode: "streaming"` — direct speelbaar, geen gate
 *   (het huidige gedrag blijft).
 * - **Telefoon/tablet:** `mode: "gated"` — de speler kan pas spelen
 *   (`canPlay: true`) wanneer ALLE verplichte content is gedownload en
 *   geverifieerd. Tot die tijd geeft `phase` aan wat er moet gebeuren
 *   (downloaden, controleren, fout) met een duidelijke voortgang.
 *
 * De policy is een **pure functie** zodat ze zonder DOM/netwerk te testen is;
 * `useGameDownloadGate` bedraadt hem aan de echte offline-pakket-laag.
 */

export type DownloadGatePhase =
  | "checking" // status wordt nog bepaald
  | "needs-download" // nog niet (volledig) gedownload → moet downloaden
  | "sizing" // downloadgrootte wordt bepaald
  | "confirm" // wacht op bewuste bevestiging (bv. groot pakket)
  | "downloading" // bezig
  | "verifying" // gedownload, wordt gecontroleerd
  | "ready" // klaar → speelbaar
  | "error"; // er ging iets mis (herstelbaar)

export interface DownloadGateProgress {
  downloadedBytes: number;
  totalBytes: number;
  percent: number;
}

export interface DownloadGateState {
  mode: "streaming" | "gated";
  phase: DownloadGatePhase;
  /** Mag de speler nu spelen? Op web altijd true; op telefoon/tablet pas na 100%. */
  canPlay: boolean;
  /** Geaggregeerde voortgang over alle pakketten (bij downloaden/controleren). */
  progress?: DownloadGateProgress;
  /** Totaal aantal te downloaden bytes (voor "grootte controleren"/bevestigen). */
  requiredBytes?: number;
  /** Vrije ruimte op het toestel, indien bekend (bij bevestigen). */
  availableBytes?: number;
  /** Foutmelding bij `phase: "error"`. */
  message?: string;
}

export const STREAMING_GATE: DownloadGateState = {
  canPlay: true,
  mode: "streaming",
  phase: "ready",
};

const packageDownloadedBytes = (state: OfflinePackageState): number => {
  if (state.status === "downloading") return state.downloadedBytes;
  if (state.status === "verifying") return state.totalBytes;
  if (state.status === "ready") return state.manifest.totalBytes;
  return 0;
};

const packageTotalBytes = (state: OfflinePackageState): number | undefined => {
  if (state.status === "downloading") return state.totalBytes;
  if (state.status === "verifying") return state.totalBytes;
  if (state.status === "ready") return state.manifest.totalBytes;
  if (state.status === "awaiting-confirmation") return state.manifest.totalBytes;
  return undefined;
};

/**
 * Bepaalt de gate-status uit het platform en de status van de offline-pakketten
 * van de game. `packageStates` is leeg wanneer de game geen offline-pakket kent.
 */
export const resolveDownloadGate = ({
  packageStates,
  requiresGate,
}: {
  packageStates: OfflinePackageState[];
  requiresGate: boolean;
}): DownloadGateState => {
  // Web (desktop) of een game zonder verplichte content → streamen, direct spelen.
  if (!requiresGate || packageStates.length === 0) {
    return STREAMING_GATE;
  }

  const hasStatus = (status: OfflinePackageState["status"]) =>
    packageStates.some((state) => state.status === status);
  const allReady = packageStates.every((state) => state.status === "ready");

  let downloadedBytes = 0;
  let totalBytes = 0;
  for (const state of packageStates) {
    const packageTotal = packageTotalBytes(state);
    if (packageTotal !== undefined) {
      totalBytes += packageTotal;
      downloadedBytes += packageDownloadedBytes(state);
    }
  }
  const progress: DownloadGateProgress | undefined =
    totalBytes > 0
      ? { downloadedBytes, percent: Math.round((downloadedBytes / totalBytes) * 100), totalBytes }
      : undefined;

  const availableBytes = packageStates.reduce<number | undefined>((available, state) => {
    if (state.status === "awaiting-confirmation" && state.availableBytes !== undefined) {
      return available === undefined
        ? state.availableBytes
        : Math.min(available, state.availableBytes);
    }
    return available;
  }, undefined);

  const failed = packageStates.find((state) => state.status === "failed");

  let phase: DownloadGatePhase;
  if (failed) {
    phase = "error";
  } else if (hasStatus("downloading")) {
    phase = "downloading";
  } else if (hasStatus("verifying")) {
    phase = "verifying";
  } else if (hasStatus("estimating")) {
    phase = "sizing";
  } else if (hasStatus("awaiting-confirmation")) {
    phase = "confirm";
  } else if (allReady) {
    phase = "ready";
  } else {
    // not-downloaded / partial / outdated
    phase = "needs-download";
  }

  return {
    availableBytes,
    canPlay: allReady,
    message: failed?.status === "failed" ? failed.message : undefined,
    mode: "gated",
    phase,
    progress: phase === "downloading" || phase === "verifying" ? progress : undefined,
    requiredBytes: totalBytes > 0 ? totalBytes : undefined,
  };
};

/** Handig: bepaalt of dit platform überhaupt een gate nodig heeft. */
export const platformRequiresDownloadGate = (platform: PlatformInfo): boolean =>
  requiresDownloadGate(platform);
