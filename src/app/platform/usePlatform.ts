import { useEffect, useState } from "react";
import { detectPlatform, type PlatformInfo } from "./platformDetection";

const arePlatformInfosEqual = (left: PlatformInfo, right: PlatformInfo): boolean =>
  left.formFactor === right.formFactor &&
  left.displayMode === right.displayMode &&
  left.isTouch === right.isTouch &&
  left.isInstalled === right.isInstalled;

/**
 * Reactieve platformdetectie (T-38). Herberekent bij het roteren/verkleinen van
 * het venster en bij een wisseling van weergavemodus (bv. de app wordt als PWA
 * geïnstalleerd of geopend). Geeft een stabiele referentie zolang de uitkomst
 * niet verandert, zodat afhankelijke componenten niet onnodig herrenderen.
 */
export const usePlatform = (): PlatformInfo => {
  const [platform, setPlatform] = useState<PlatformInfo>(() => detectPlatform());

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const update = () => {
      setPlatform((current) => {
        const next = detectPlatform();
        return arePlatformInfosEqual(current, next) ? current : next;
      });
    };

    // Bij mount één keer synchroniseren (viewport kan sinds de eerste render zijn
    // veranderd, bv. na een oriëntatiewissel tijdens het laden).
    update();

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    const displayModeQueries =
      typeof window.matchMedia === "function"
        ? [
            window.matchMedia("(display-mode: standalone)"),
            window.matchMedia("(display-mode: fullscreen)"),
            window.matchMedia("(display-mode: minimal-ui)"),
          ]
        : [];
    displayModeQueries.forEach((query) => query.addEventListener?.("change", update));

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      displayModeQueries.forEach((query) => query.removeEventListener?.("change", update));
    };
  }, []);

  return platform;
};
