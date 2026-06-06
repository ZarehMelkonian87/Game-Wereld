import { Gauge, Home, Pause, Play, RotateCcw, Star, Trophy } from "lucide-react";
import { HudIconButton, PanelCard, ProgressBar } from "../../components/ui";
import { VOICE_SCROLLER_LEVEL_DISTANCE } from "./voiceSideScrollerModel";
import type { VoiceSideScrollerGameState } from "./voiceSideScrollerModel";
import {
  getVoiceScrollerDifficultyProgress,
  getVoiceScrollerDistanceMeters,
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
  const distanceMeters = getVoiceScrollerDistanceMeters(state);
  const difficultyProgress = getVoiceScrollerDifficultyProgress(state);
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
        icon={<Gauge className="h-4 w-4 text-sky-600" strokeWidth={2.5} />}
        label={`Afstand ${distanceMeters}m`}
        max={VOICE_SCROLLER_LEVEL_DISTANCE}
        tone="yellow"
        value={difficultyProgress}
      />
      <div
        aria-label={`Punten: ${state.score}. Woordsterren: ${state.stars}. Level ${state.difficultyLevel}`}
        className="grid min-h-11 shrink-0 grid-cols-2 gap-x-2 rounded-2xl border-2 border-sky-300 bg-sky-100 px-2 py-1 text-[0.7rem] font-black leading-none text-sky-950 shadow-[0_3px_0_rgba(3,105,161,0.22)]"
        data-component="VoiceSideScrollerScoreCounter"
      >
        <span className="inline-flex items-center gap-1 tabular-nums">
          <Trophy className="h-4 w-4 text-sky-600" fill="currentColor" strokeWidth={2.5} />
          {state.score}
        </span>
        <span className="inline-flex items-center gap-1 tabular-nums">
          <Star className="h-4 w-4 text-amber-500" fill="currentColor" strokeWidth={2.5} />
          {state.stars}
        </span>
        <span className="col-span-2 mt-0.5 text-center text-[0.62rem] text-emerald-900">
          Level {state.difficultyLevel}
        </span>
      </div>
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
