import { StartActions } from "./StartActions";
import { StartBackground } from "./StartBackground";
import { StartHero } from "./StartHero";
import { StartSparkles } from "./StartSparkles";
import { StartTopBar } from "./StartTopBar";

interface StartScreenProps {
  onExit: () => void;
  onOpenSettings: () => void;
  onPlay: () => void;
  starCount?: number;
}

/**
 * @uxId SCR_MAIN_TITLE
 * @screens SCR_MAIN_TITLE
 * @description Hoofdscherm / Titelmenu (Scherm 1)
 */
export const StartScreen = ({
  onExit,
  onOpenSettings,
  onPlay,
  // TODO(T-01/T-21): koppel aan het echte cumulatieve sterrentotaal van het
  // actieve profiel. Tot dan tonen we 0 i.p.v. de misleidende placeholder 120.
  starCount = 0,
}: StartScreenProps) => (
  <section
    aria-label="Startscherm"
    className="pointer-events-auto absolute inset-0 z-10 overflow-hidden"
    data-testid="start-screen"
  >
    <StartBackground />
    <StartTopBar onExit={onExit} onOpenSettings={onOpenSettings} starCount={starCount} />
    <StartHero />
    <StartSparkles />
    <StartActions onPlay={onPlay} />
  </section>
);

StartScreen.displayName = "StartScreen";
