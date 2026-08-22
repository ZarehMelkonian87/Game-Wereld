import type { VoiceSideScrollerGameState } from "./voiceSideScrollerModel";
import { VoiceSideScrollerBackground } from "./VoiceSideScrollerBackground";
import { VoiceSideScrollerObstacleLayer } from "./VoiceSideScrollerObstacleLayer";
import { VoiceSideScrollerPlayer } from "./VoiceSideScrollerPlayer";
import { VoiceSideScrollerRoundSummary } from "./VoiceSideScrollerRoundSummary";
import { VoiceSideScrollerStartOverlay } from "./VoiceSideScrollerStartOverlay";
import { VoiceSideScrollerTargetLayer } from "./VoiceSideScrollerTargetLayer";

interface VoiceSideScrollerStageProps {
  fullBleed?: boolean;
  onBackToMenu: () => void;
  onRestart: () => void;
  onStart: () => void;
  state: VoiceSideScrollerGameState;
}

export const VoiceSideScrollerStage = ({
  fullBleed = false,
  onBackToMenu,
  onRestart,
  onStart,
  state,
}: VoiceSideScrollerStageProps) => (
  <div
    className={
      fullBleed
        ? "absolute inset-0 overflow-hidden bg-sky-200"
        : "relative min-h-0 overflow-hidden rounded-[1.4rem] border-[4px] border-white bg-sky-200 shadow-[0_6px_0_rgba(21,48,74,0.16)]"
    }
    data-component="VoiceSideScrollerStage"
    data-obstacle-hits={state.obstacleHits}
    data-player-y={state.playerY.toFixed(3)}
    data-scroll-x={state.scrollX.toFixed(3)}
    data-testid="voice-side-scroller-stage"
  >
    <VoiceSideScrollerBackground scrollX={state.scrollX} />
    <VoiceSideScrollerObstacleLayer obstacles={state.obstacles} />
    <VoiceSideScrollerTargetLayer targets={state.targets} />
    <VoiceSideScrollerPlayer
      isSlowed={state.collisionSlowdownMs > 0}
      playerY={state.playerY}
      speed={state.speed}
    />
    {state.status === "ready" ? (
      <VoiceSideScrollerStartOverlay onStart={onStart} state={state} />
    ) : null}
    {state.status === "game-over" ? (
      <VoiceSideScrollerRoundSummary
        onBackToMenu={onBackToMenu}
        onRestart={onRestart}
        state={state}
      />
    ) : null}
  </div>
);

VoiceSideScrollerStage.displayName = "VoiceSideScrollerStage";
