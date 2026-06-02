import { classNames } from "../../components/ui/classNames";
import type { MicrophonePermissionResult } from "../../logic/microphone-permission";

export const getMicrophonePermissionStatusClassName = ({
  canUse,
  state,
}: MicrophonePermissionResult) =>
  classNames(
    "rounded-2xl border-2 p-2 text-xs font-black leading-tight",
    canUse && "border-emerald-300 bg-emerald-50/90 text-emerald-900",
    state === "denied" && "border-amber-300 bg-amber-50/90 text-amber-950",
    state === "insecure-context" && "border-amber-300 bg-amber-50/90 text-amber-950",
    state === "unsupported" && "border-slate-300 bg-slate-50/90 text-slate-700",
    !canUse &&
      state !== "denied" &&
      state !== "insecure-context" &&
      state !== "unsupported" &&
      "border-sky-200 bg-sky-50/90 text-sky-950",
  );

export const getMicrophonePermissionButtonLabel = (
  isCheckingMicrophonePermission: boolean,
  microphonePermission: MicrophonePermissionResult,
) => {
  if (isCheckingMicrophonePermission) {
    return "Controleren...";
  }

  if (microphonePermission.canUse) {
    return "Microfoon klaar";
  }

  if (microphonePermission.state === "denied") {
    return "Controleer opnieuw";
  }

  return "Vraag microfoon";
};

export const getMicrophonePermissionAttemptMessage = ({
  message,
  state,
}: MicrophonePermissionResult) => {
  if (state === "granted") {
    return "Microfoon is klaar. Ga terug naar de game en tik op Zeg zelf.";
  }

  if (state === "insecure-context") {
    return "Er komt geen toestemming-popup, omdat deze pagina niet veilig is geopend. Gebruik HTTPS voor een echte mobiele microfoontest.";
  }

  if (state === "denied") {
    return "De browser heeft microfoon geblokkeerd. Zet microfoon aan in de browserinstellingen en probeer opnieuw.";
  }

  return message;
};

export const getMicrophoneEnvironmentMessage = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "Microfoonstatus kan hier nog niet worden gecontroleerd.";
  }

  if (!window.isSecureContext) {
    return `Je opent deze web-app via ${window.location.protocol}//${window.location.host}. Op een telefoon opent de microfoon-popup meestal alleen via HTTPS.`;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return "Deze browser geeft geen normale microfoon-toegang aan web-apps. Probeer Chrome op Android of Safari/Chrome met HTTPS.";
  }

  return "Deze pagina mag een browser-popup voor microfoontoestemming tonen.";
};
