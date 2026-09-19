import { useEffect } from "react";
import { shouldShowPortraitGuard, tryLockPortrait } from "./portraitGuardLogic";
import { usePlatform } from "./usePlatform";
import { useIsLandscape } from "./useOrientation";

/**
 * Portret-guard voor de telefoon (T-42 §1.1): zodra een telefoon liggend wordt
 * gehouden, legt dit scherm zich over de game heen en blokkeert alle invoer,
 * tot het toestel weer rechtop staat. Op tablet (T-44) en desktop doet hij niets.
 *
 * Probeert bij mount ook `screen.orientation.lock("portrait")` — op Android/
 * Samsung voorkomt dat het draaien helemaal; op iOS faalt dat stil en vangt de
 * overlay het op.
 */
export const PortraitGuard = () => {
  const platform = usePlatform();
  const isLandscape = useIsLandscape();
  const isPhone = platform.formFactor === "phone";

  useEffect(() => {
    if (!isPhone) return;
    void tryLockPortrait();
  }, [isPhone]);

  if (!shouldShowPortraitGuard(platform, isLandscape)) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="pointer-events-auto fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-sky-100 px-8 text-center text-slate-900"
      data-component="PortraitGuard"
      data-testid="portrait-guard"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portrait-guard-title"
    >
      <div aria-hidden="true" className="text-7xl bezem-start-mascot">
        📱
      </div>
      <h2 className="text-2xl font-black" id="portrait-guard-title">
        Draai je telefoon rechtop
      </h2>
      <p className="max-w-xs text-base font-bold leading-snug text-slate-700">
        Rechtop hoort de microfoon je het best — en kun je fijn met je duimen spelen.
      </p>
      <p className="text-sm font-bold text-slate-500">Het spel gaat vanzelf verder.</p>
    </div>
  );
};

PortraitGuard.displayName = "PortraitGuard";
