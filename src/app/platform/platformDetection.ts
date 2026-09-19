/**
 * Platformdetectie (T-38) — één bron van waarheid voor de multiplatform-
 * ondersteuning (GDD §13). Onderscheidt de drie platforms in scope:
 *
 * - `desktop`  → Webbrowser op laptop/desktop (behoudt streaming, geen gate)
 * - `phone`    → Mobiele telefoon
 * - `tablet`   → Tablet
 *
 * plus of de app als **geïnstalleerde PWA** draait (`standalone`) of in een
 * gewone browsertab. `T-39` (download-gating) en de per-platform UX-sporen
 * (`T-40`..`T-45`) bouwen hierop voort.
 *
 * De classificatie is een **pure functie** (`classifyPlatform`) zodat ze zonder
 * DOM getest kan worden; `detectPlatform` leest de echte omgeving uit.
 */

export type PlatformFormFactor = "desktop" | "phone" | "tablet";
export type PlatformDisplayMode = "browser" | "standalone";

export interface PlatformInfo {
  /** Vorm van het toestel. */
  formFactor: PlatformFormFactor;
  /** Draait de app als geïnstalleerde PWA (`standalone`) of in een browsertab? */
  displayMode: PlatformDisplayMode;
  /** Kortweg: is dit een aanraakgestuurd toestel? */
  isTouch: boolean;
  /** Kortweg: geïnstalleerd (startscherm-app). */
  isInstalled: boolean;
}

/** Ruwe omgevingssignalen die de classificatie voedt (testbaar). */
export interface PlatformEnv {
  userAgent: string;
  maxTouchPoints: number;
  hasTouchStart: boolean;
  coarsePointer: boolean;
  standalone: boolean;
  /** De korte zijde van het viewport (`min(breedte, hoogte)`) in px. */
  minViewportSide: number;
}

const PHONE_UA = /Mobi|iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry|IEMobile|Opera Mini/i;
const TABLET_UA = /iPad|Tablet|PlayBook|Silk|Kindle|Nexus 7|Nexus 10|SM-T/i;
// iPadOS-Safari doet zich voor als "Macintosh" maar heeft aanraakpunten.
const IPAD_AS_MAC = /Macintosh/i;

// Onder deze korte-zijde-grens (px) rekenen we een aanraaktoestel tot telefoon,
// erboven tot tablet — als UA geen uitsluitsel geeft. ~600px scheidt telefoons
// van de kleinste tablets.
const PHONE_TABLET_MIN_SIDE_BREAKPOINT = 600;

export const classifyPlatform = (env: PlatformEnv): PlatformInfo => {
  const isTouch = env.maxTouchPoints > 0 || env.hasTouchStart || env.coarsePointer;
  const displayMode: PlatformDisplayMode = env.standalone ? "standalone" : "browser";

  const isPhoneUa = PHONE_UA.test(env.userAgent);
  const isTabletUa =
    TABLET_UA.test(env.userAgent) || (IPAD_AS_MAC.test(env.userAgent) && env.maxTouchPoints > 1);

  let formFactor: PlatformFormFactor;
  if (isTabletUa) {
    formFactor = "tablet";
  } else if (isPhoneUa) {
    formFactor = "phone";
  } else if (!isTouch) {
    formFactor = "desktop";
  } else {
    // Aanraaktoestel zonder duidelijke UA-hint → schat op schermgrootte.
    formFactor = env.minViewportSide < PHONE_TABLET_MIN_SIDE_BREAKPOINT ? "phone" : "tablet";
  }

  return {
    displayMode,
    formFactor,
    isInstalled: displayMode === "standalone",
    isTouch,
  };
};

/**
 * Vereist dit platform de verplichte download-gate vóór spelen (T-39)? Ja voor
 * telefoon en tablet; de webbrowser (desktop) behoudt streaming.
 */
export const requiresDownloadGate = (info: PlatformInfo): boolean =>
  info.formFactor === "phone" || info.formFactor === "tablet";

const matchesMedia = (query: string): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
};

const readStandalone = (): boolean =>
  matchesMedia("(display-mode: standalone)") ||
  matchesMedia("(display-mode: fullscreen)") ||
  matchesMedia("(display-mode: minimal-ui)") ||
  // iOS-Safari zet dit non-standaard vlaggetje op een startscherm-app.
  (typeof navigator !== "undefined" &&
    (navigator as unknown as { standalone?: boolean }).standalone === true);

export const readPlatformEnv = (): PlatformEnv => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      coarsePointer: false,
      hasTouchStart: false,
      maxTouchPoints: 0,
      minViewportSide: 1024,
      standalone: false,
      userAgent: "",
    };
  }

  const searchParams =
    typeof window !== "undefined" && window.location
      ? new URLSearchParams(window.location.search)
      : null;
  const forceMobile = searchParams?.get("platform") === "mobile";
  const forceDesktop = searchParams?.get("platform") === "desktop";

  return {
    coarsePointer: forceMobile || matchesMedia("(pointer: coarse)"),
    hasTouchStart: forceMobile || "ontouchstart" in window,
    maxTouchPoints: forceMobile ? 5 : forceDesktop ? 0 : (navigator.maxTouchPoints ?? 0),
    minViewportSide: forceMobile ? 390 : Math.min(window.innerWidth, window.innerHeight),
    standalone: readStandalone(),
    userAgent: forceMobile
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605 Mobile/15E148"
      : forceDesktop
        ? "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        : (navigator.userAgent ?? ""),
  };
};

export const detectPlatform = (): PlatformInfo => classifyPlatform(readPlatformEnv());
