import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell, TopHud, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";
import { SceneBuilderScreen } from "./screens";

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

export function WoordenschatBezemEscapeGame() {
  const showUiPreview = shouldShowUiPreview();
  const instructionText = getInstructionPreviewText();

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
          <SceneBuilderScreen instructionText={instructionText} />
          <TopHud showHint starCount={0} />
        </>
      )}
    </BezemEscapeShell>
  );
}
