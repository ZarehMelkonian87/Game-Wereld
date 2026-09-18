import { useEffect, useState } from "react";

const LANDSCAPE_QUERY = "(orientation: landscape)";

const readIsLandscape = (): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia(LANDSCAPE_QUERY).matches;
  } catch {
    return false;
  }
};

/** Reactief: is het toestel/venster momenteel liggend? */
export const useIsLandscape = (): boolean => {
  const [isLandscape, setIsLandscape] = useState(readIsLandscape);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const query = window.matchMedia(LANDSCAPE_QUERY);
    const update = () => setIsLandscape(query.matches);
    update();
    query.addEventListener?.("change", update);
    window.addEventListener("orientationchange", update);
    window.addEventListener("resize", update);
    return () => {
      query.removeEventListener?.("change", update);
      window.removeEventListener("orientationchange", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return isLandscape;
};
