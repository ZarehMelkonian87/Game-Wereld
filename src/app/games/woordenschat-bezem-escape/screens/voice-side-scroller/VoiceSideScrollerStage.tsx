import type { VoiceSideScrollerGameState, VoiceSideScrollerTarget } from "./voiceSideScrollerModel";
import { VoiceSideScrollerBackground } from "./VoiceSideScrollerBackground";
import { VoiceSideScrollerObstacleLayer } from "./VoiceSideScrollerObstacleLayer";
import { VoiceSideScrollerPlayer } from "./VoiceSideScrollerPlayer";
import { VoiceSideScrollerRoundSummary } from "./VoiceSideScrollerRoundSummary";
import { VoiceSideScrollerStartOverlay } from "./VoiceSideScrollerStartOverlay";
import { VoiceSideScrollerTargetLayer } from "./VoiceSideScrollerTargetLayer";
import type { VoiceSideScrollerMicrophoneState } from "./useVoiceSideScrollerMicrophone";

interface VoiceSideScrollerStageProps {
  activeTarget?: VoiceSideScrollerTarget;
  microphone: VoiceSideScrollerMicrophoneState;
  onBackToMenu: () => void;
  onRestart: () => void;
  onStart: () => void;
  state: VoiceSideScrollerGameState;
}

export const VoiceSideScrollerStage = ({
  activeTarget,
  microphone,
  onBackToMenu,
  onRestart,
  onStart,
  state,
}: VoiceSideScrollerStageProps) => (
  <div
    className="relative min-h-0 overflow-hidden rounded-[1.4rem] border-[4px] border-white bg-sky-200 shadow-[0_6px_0_rgba(21,48,74,0.16)]"
    data-component="VoiceSideScrollerStage"
    data-obstacle-hits={state.obstacleHits}
    data-player-y={state.playerY.toFixed(3)}
    data-scroll-x={state.scrollX.toFixed(3)}
    data-testid="voice-side-scroller-stage"
  >
    <VoiceSideScrollerBackground scrollX={state.scrollX} />
    <VoiceSideScrollerObstacleLayer obstacles={state.obstacles} />
    <VoiceSideScrollerTargetLayer
      activeTargetId={activeTarget?.id}
      targets={state.targets}
    />
    <VoiceSideScrollerPlayer
      isSlowed={state.collisionSlowdownMs > 0}
      playerY={state.playerY}
      speed={state.speed}
    />
    {state.status === "ready" ? (
      <VoiceSideScrollerStartOverlay
        microphone={microphone}
        onStart={onStart}
        state={state}
      />
    ) : null}
    {state.status === "finished" ? (
      <VoiceSideScrollerRoundSummary
        onBackToMenu={onBackToMenu}
        onRestart={onRestart}
        state={state}
      />
    ) : null}
  </div>
);

VoiceSideScrollerStage.displayName = "VoiceSideScrollerStage";
