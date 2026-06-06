export type GameScreenPreview =
  | "dashboard"
  | "mode-select"
  | "reward"
  | "scene-builder"
  | "settings"
  | "start"
  | "word-choice"
  | "world-select";

const getSearchParams = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return new URLSearchParams(window.location.search);
};

export const shouldShowUiPreview = () => getSearchParams()?.get("preview") === "ui";

export const getInstructionPreviewText = () => {
  const longInstruction = "Zet de boot in het water en leg daarna de bal naast de parasol.";
  const instructionPreview = getSearchParams()?.get("instructionPreview");

  if (instructionPreview === "long") {
    return longInstruction;
  }

  return undefined;
};

export const shouldShowTrayLabels = () => getSearchParams()?.get("trayLabels") === "true";

export const shouldShowZoneDevTools = () => getSearchParams()?.get("zoneDevTools") === "true";

export const getSpokenCommandPreviewText = () =>
  getSearchParams()?.get("spokenCommandPreview") ?? undefined;

export const getScreenPreview = (): GameScreenPreview => {
  const screen = getSearchParams()?.get("screen");

  if (screen === "word-choice") {
    return "word-choice";
  }

  if (screen === "reward") {
    return "reward";
  }

  if (screen === "dashboard") {
    return "dashboard";
  }

  if (screen === "settings") {
    return "settings";
  }

  if (screen === "mode-select" || screen === "menu") {
    return "mode-select";
  }

  if (screen === "start") {
    return "start";
  }

  if (screen === "world-select") {
    return "world-select";
  }

  if (screen === "scene-builder" || screen === "listen-and-place") {
    return "scene-builder";
  }

  return "start";
};
