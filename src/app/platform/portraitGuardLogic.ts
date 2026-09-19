import type { PlatformInfo } from "./platformDetection";

/**
 * Portret-only op de telefoon (T-42 §1.1): de telefoonversie ondersteunt de
 * liggende stand niet. Omdat iOS de manifest-`orientation` negeert en
 * `screen.orientation.lock()` niet overal werkt, is een in-app guard de enige
 * laag die op élk toestel betrouwbaar is.
 *
 * Bewust ALLEEN `phone`: tablet bepaalt z'n eigen stand in `T-44` (de e2e
 * draait bovendien als liggende touch-tablet, 1024×768) en desktop is nooit
 * een aanraaktoestel in portret-zin.
 *
 * Pure beslisfunctie zodat hij zonder DOM te testen is.
 */
export const shouldShowPortraitGuard = (platform: PlatformInfo, isLandscape: boolean): boolean =>
  platform.formFactor === "phone" && isLandscape;

/**
 * Best-effort vergrendeling op portret. Werkt op Android/Samsung in een
 * geïnstalleerde of fullscreen PWA; iOS ondersteunt dit niet en gooit dan —
 * daarom altijd stil falen en op de guard vertrouwen.
 */
export const tryLockPortrait = async (): Promise<boolean> => {
  if (typeof screen === "undefined") return false;
  const orientation = (
    screen as Screen & {
      orientation?: { lock?: (mode: string) => Promise<void> };
    }
  ).orientation;
  if (!orientation?.lock) return false;
  try {
    await orientation.lock("portrait");
    return true;
  } catch {
    return false;
  }
};
