import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell, TopHud, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";
import { SceneBuilderScreen, WordChoiceScreen } from "./screens";

type GameScreenPreview = "scene-builder" | "word-choice";

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

  return new URLSearchParams(window.location.search).get("screen") === "word-choice"
    ? "word-choice"
    : "scene-builder";
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
          {screenPreview === "word-choice" ? (
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
