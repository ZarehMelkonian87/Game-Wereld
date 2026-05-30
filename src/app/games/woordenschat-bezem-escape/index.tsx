import { beachBackgrounds } from "./asset-urls";
import { BeachBackground, BezemEscapeShell } from "./components";
import { beachWorld } from "./content";

export function WoordenschatBezemEscapeGame() {
  return (
    <BezemEscapeShell world={beachWorld}>
      <BeachBackground
        landscapeUrl={beachBackgrounds.landscape}
        portraitUrl={beachBackgrounds.portrait}
      />
    </BezemEscapeShell>
  );
}
