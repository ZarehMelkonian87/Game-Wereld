import { Home, Pause, Play, RotateCcw, Zap } from "lucide-react";
import { HudIconButton, PanelCard, ProgressBar, StarCounter } from "../../components/ui";
import type { VoiceSideScrollerGameState } from "./voiceSideScrollerModel";
import {
  getVoiceScrollerProgressPercent,
  getVoiceScrollerTimeLeftSeconds,
} from "./voiceSideScrollerSelectors";

interface VoiceSideScrollerHudProps {
  onBackToMenu: () => void;
  onPause: () => void;
  onReset: () => void;
  onResume: () => void;
  onStart: () => void;
  state: VoiceSideScrollerGameState;
}

export const VoiceSideScrollerHud = ({
  onBackToMenu,
  onPause,
  onReset,
  onResume,
  onStart,
  state,
}: VoiceSideScrollerHudProps) => {
  const timeLeftSeconds = getVoiceScrollerTimeLeftSeconds(state);
  const progressPercent = getVoiceScrollerProgressPercent(state);
  const isRunning = state.status === "running";
  const isPaused = state.status === "paused";
  const canResume = isPaused;
  const primaryAction = isRunning ? onPause : canResume ? onResume : onStart;
  const primaryLabel = isRunning ? "Pauze" : canResume ? "Verder" : "Start";
  const PrimaryIcon = isRunning ? Pause : Play;

  return (
    <PanelCard
      aria-label="Zeg en Vlieg status"
      className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-2 !rounded-[1.35rem] !p-2"
      data-component="VoiceSideScrollerHud"
      data-testid="voice-side-scroller-hud"
    >
      <HudIconButton
        icon={<Home className="h-5 w-5" strokeWidth={3} />}
        label="Terug naar menu"
        onClick={onBackToMenu}
        tone="white"
      />
      <ProgressBar
        icon={<Zap className="h-4 w-4 text-amber-500" fill="currentColor" strokeWidth={2.5} />}
        label={`Tijd ${timeLeftSeconds}s`}
        max={100}
        tone="yellow"
        value={progressPercent}
      />
      <StarCounter label="Woordsterren" value={state.stars} />
      <HudIconButton
        icon={
          <PrimaryIcon
            className="h-5 w-5"
            fill={isRunning ? "currentColor" : "none"}
            strokeWidth={3}
          />
        }
        label={primaryLabel}
        onClick={primaryAction}
        tone={isRunning ? "yellow" : "green"}
      />
      <HudIconButton
        icon={<RotateCcw className="h-5 w-5" strokeWidth={3} />}
        label="Opnieuw"
        onClick={onReset}
        tone="white"
      />
    </PanelCard>
  );
};

VoiceSideScrollerHud.displayName = "VoiceSideScrollerHud";
