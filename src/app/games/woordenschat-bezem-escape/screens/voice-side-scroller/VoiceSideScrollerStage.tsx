import type { VoiceSideScrollerGameState, VoiceSideScrollerTarget } from "./voiceSideScrollerModel";
import { VoiceSideScrollerBackground } from "./VoiceSideScrollerBackground";
import { VoiceSideScrollerPlayer } from "./VoiceSideScrollerPlayer";
import { VoiceSideScrollerTargetLayer } from "./VoiceSideScrollerTargetLayer";

interface VoiceSideScrollerStageProps {
  activeTarget?: VoiceSideScrollerTarget;
  state: VoiceSideScrollerGameState;
}

export const VoiceSideScrollerStage = ({
  activeTarget,
  state,
}: VoiceSideScrollerStageProps) => (
  <div
    className="relative min-h-0 overflow-hidden rounded-[1.4rem] border-[4px] border-white bg-sky-200 shadow-[0_6px_0_rgba(21,48,74,0.16)]"
    data-component="VoiceSideScrollerStage"
    data-player-y={state.playerY.toFixed(3)}
    data-scroll-x={state.scrollX.toFixed(3)}
    data-testid="voice-side-scroller-stage"
  >
    <VoiceSideScrollerBackground scrollX={state.scrollX} />
    <VoiceSideScrollerTargetLayer
      activeTargetId={activeTarget?.id}
      targets={state.targets}
    />
    <VoiceSideScrollerPlayer playerY={state.playerY} />
  </div>
);

VoiceSideScrollerStage.displayName = "VoiceSideScrollerStage";
