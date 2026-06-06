import { getActiveVoiceScrollerTarget } from "./voiceSideScrollerSelectors";
import { useVoiceSideScrollerController } from "./useVoiceSideScrollerController";
import { VoiceSideScrollerFallbackControls } from "./VoiceSideScrollerFallbackControls";
import { VoiceSideScrollerHud } from "./VoiceSideScrollerHud";
import { VoiceSideScrollerStage } from "./VoiceSideScrollerStage";
import { VoiceSideScrollerStatusPanel } from "./VoiceSideScrollerStatusPanel";

interface VoiceSideScrollerScreenProps {
  onBackToMenu: () => void;
}

export const VoiceSideScrollerScreen = ({
  onBackToMenu,
}: VoiceSideScrollerScreenProps) => {
  const controller = useVoiceSideScrollerController();
  const { state } = controller;
  const activeTarget = getActiveVoiceScrollerTarget(state.targets);
  const controlsDisabled = state.status !== "running";

  return (
    <section
      aria-label="Zeg en Vlieg"
      className="pointer-events-auto absolute inset-0 z-10 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-2 overflow-hidden px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)] text-slate-900 landscape:grid-cols-[minmax(0,1fr)_11rem] landscape:grid-rows-[auto_minmax(0,1fr)] landscape:gap-3"
      data-component="VoiceSideScrollerScreen"
      data-status={state.status}
      data-testid="voice-side-scroller-screen"
    >
      <div className="landscape:col-span-2">
        <VoiceSideScrollerHud
          onBackToMenu={onBackToMenu}
          onPause={controller.pauseRound}
          onReset={controller.resetRound}
          onResume={controller.resumeRound}
          onStart={controller.startRound}
          state={state}
        />
      </div>
      <VoiceSideScrollerStage activeTarget={activeTarget} state={state} />
      <div className="grid gap-2 landscape:min-h-0 landscape:grid-rows-[auto_1fr]">
        <VoiceSideScrollerStatusPanel activeTarget={activeTarget} status={state.status} />
        <VoiceSideScrollerFallbackControls
          disabled={controlsDisabled}
          onMoveDown={controller.fallbackDown}
          onMoveUp={controller.fallbackUp}
          onRelease={controller.fallbackNeutral}
        />
      </div>
    </section>
  );
};

VoiceSideScrollerScreen.displayName = "VoiceSideScrollerScreen";
