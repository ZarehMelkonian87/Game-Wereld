import { useEffect, useState } from "react";
import { DiagnosticsPanel } from "./DiagnosticsPanel";

export const DIAGNOSTICS_SESSION_KEY = "game-wereld:development-diagnostics";

const getQueryDirective = () => {
  if (typeof window === "undefined") return null;
  return new URL(window.location.href).searchParams.get("diagnostics");
};

const readInitialVisibility = () => {
  if (typeof window === "undefined") return false;
  const directive = getQueryDirective();
  if (directive === "on") return true;
  if (directive === "off") return false;
  return window.sessionStorage.getItem(DIAGNOSTICS_SESSION_KEY) === "on";
};

const removeQueryDirective = () => {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("diagnostics")) return;
  url.searchParams.delete("diagnostics");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
};

export const DevelopmentDiagnostics = () => {
  const [enabled, setEnabled] = useState(readInitialVisibility);

  useEffect(() => {
    const directive = getQueryDirective();
    if (directive === "on") {
      window.sessionStorage.setItem(DIAGNOSTICS_SESSION_KEY, "on");
      setEnabled(true);
    } else if (directive === "off") {
      window.sessionStorage.removeItem(DIAGNOSTICS_SESSION_KEY);
      setEnabled(false);
    }
    removeQueryDirective();
  }, []);

  const disable = () => {
    window.sessionStorage.removeItem(DIAGNOSTICS_SESSION_KEY);
    setEnabled(false);
  };

  return enabled ? <DiagnosticsPanel onDisable={disable} /> : null;
};

DevelopmentDiagnostics.displayName = "DevelopmentDiagnostics";
