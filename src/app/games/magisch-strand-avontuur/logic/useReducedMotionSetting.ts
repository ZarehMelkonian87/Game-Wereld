import { useEffect, useState } from "react";
import { useGameRuntime } from "../runtime/GameRuntimeContext";
import {
  MAGISCH_STRAND_AVONTUUR_SETTINGS_CHANGED_EVENT,
  readBezemEscapeSettings,
} from "./settings";

/**
 * Leest de in-game "Rustige animaties"-instelling (`reducedMotion`) reactief
 * (T-14). De `motion-reduce:`-utilities en de `@media (prefers-reduced-motion)`
 * in `theme.css` reageren alleen op de OS-instelling; deze hook laat de in-app
 * toggle óók de zware animaties (parallax, sparkles, vlieg-loop) dempen via het
 * `[data-app-reduced-motion]`-attribuut op de spel-shell.
 */
export const useReducedMotionSetting = (): boolean => {
  const { identity, storage } = useGameRuntime();
  const profileId = identity.profileId;
  const [reducedMotion, setReducedMotion] = useState(
    () => readBezemEscapeSettings(profileId, storage).reducedMotion,
  );

  useEffect(() => {
    setReducedMotion(readBezemEscapeSettings(profileId, storage).reducedMotion);
  }, [profileId, storage]);

  useEffect(() => {
    const updateFromSettings = () => {
      setReducedMotion(readBezemEscapeSettings(profileId, storage).reducedMotion);
    };
    window.addEventListener(MAGISCH_STRAND_AVONTUUR_SETTINGS_CHANGED_EVENT, updateFromSettings);
    return () =>
      window.removeEventListener(MAGISCH_STRAND_AVONTUUR_SETTINGS_CHANGED_EVENT, updateFromSettings);
  }, [profileId, storage]);

  return reducedMotion;
};
