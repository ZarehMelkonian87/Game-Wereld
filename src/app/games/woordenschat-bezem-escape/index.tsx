import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell, TopHud, UiBuildingBlocksPreview } from "./components";
import { beachWorld } from "./content";

function shouldShowUiPreview() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("preview") === "ui";
}

export function WoordenschatBezemEscapeGame() {
  const showUiPreview = shouldShowUiPreview();

  return (
    <BezemEscapeShell world={beachWorld}>
      <BeachBackground
        landscapeUrl={beachBackgrounds.landscape}
        portraitUrl={beachBackgrounds.portrait}
      />
      {showUiPreview ? <UiBuildingBlocksPreview /> : <TopHud showHint starCount={0} />}
    </BezemEscapeShell>
  );
}
