import { StartActions } from "./StartActions";
import { StartBackground } from "./StartBackground";
import { StartHero } from "./StartHero";
import { StartSparkles } from "./StartSparkles";
import { StartTopBar } from "./StartTopBar";

interface StartScreenProps {
  onOpenDashboard: () => void;
  onOpenSettings: () => void;
  onPlay: () => void;
  starCount?: number;
}

export const StartScreen = ({
  onOpenDashboard,
  onOpenSettings,
  onPlay,
  starCount = 120,
}: StartScreenProps) => (
  <section
    aria-label="Startscherm"
    className="pointer-events-auto absolute inset-0 z-10 overflow-hidden"
    data-testid="start-screen"
  >
    <StartBackground />
    <StartTopBar onOpenSettings={onOpenSettings} starCount={starCount} />
    <StartHero />
    <StartSparkles />
    <StartActions onOpenDashboard={onOpenDashboard} onPlay={onPlay} />
  </section>
);

StartScreen.displayName = "StartScreen";
