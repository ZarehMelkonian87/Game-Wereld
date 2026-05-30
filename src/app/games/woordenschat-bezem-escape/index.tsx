import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell, TopHud, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";
import { RaceScreen, SceneBuilderScreen, WordChoiceScreen } from "./screens";

type GameScreenPreview = "race" | "scene-builder" | "word-choice";

function shouldShowUiPreview() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("preview") === "ui";
}

function getInstructionPreviewText() {
  const shortInstruction = "Zet de boot in het water.";
  const longInstruction = "Zet de boot in het water en leg daarna de bal naast de parasol.";

  if (typeof window === "undefined") {
    return shortInstruction;
  }

  return new URLSearchParams(window.location.search).get("instructionPreview") === "long"
    ? longInstruction
    : shortInstruction;
}

function shouldShowTrayLabels() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("trayLabels") === "true";
}

function getScreenPreview(): GameScreenPreview {
  if (typeof window === "undefined") {
    return "scene-builder";
  }

  const screen = new URLSearchParams(window.location.search).get("screen");

  if (screen === "word-choice") {
    return "word-choice";
  }

  if (screen === "race") {
    return "race";
  }

  return "scene-builder";
}

export function WoordenschatBezemEscapeGame() {
  const showUiPreview = shouldShowUiPreview();
  const instructionText = getInstructionPreviewText();
  const showTrayLabels = shouldShowTrayLabels();
  const screenPreview = getScreenPreview();

  return (
    <BezemEscapeShell world={beachWorld}>
      <BeachBackground
        landscapeUrl={beachBackgrounds.landscape}
        portraitUrl={beachBackgrounds.portrait}
      />
      {showUiPreview ? (
        <UiBuildingBlocksPreview />
      ) : (
        <>
          {screenPreview === "race" ? (
            <RaceScreen />
          ) : screenPreview === "word-choice" ? (
            <WordChoiceScreen />
          ) : (
            <SceneBuilderScreen instructionText={instructionText} showTrayLabels={showTrayLabels} />
          )}
          <TopHud showHint starCount={0} />
        </>
      )}
    </BezemEscapeShell>
  );
}
