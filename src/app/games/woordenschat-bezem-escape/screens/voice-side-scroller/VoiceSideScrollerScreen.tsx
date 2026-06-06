import { useProfile } from "../../../../contexts/ProfileContext";
import { useVoiceSideScrollerController } from "./useVoiceSideScrollerController";
import { VoiceSideScrollerFallbackControls } from "./VoiceSideScrollerFallbackControls";
import { VoiceSideScrollerHud } from "./VoiceSideScrollerHud";
import { VoiceSideScrollerStage } from "./VoiceSideScrollerStage";
import { VoiceSideScrollerStatusPanel } from "./VoiceSideScrollerStatusPanel";
import { VoiceSideScrollerVoiceMeter } from "./VoiceSideScrollerVoiceMeter";

interface VoiceSideScrollerScreenProps {
  onBackToMenu: () => void;
}

export const VoiceSideScrollerScreen = ({
  onBackToMenu,
}: VoiceSideScrollerScreenProps) => {
  const { currentProfile } = useProfile();
  const profileId = currentProfile?.id ?? "demo-profile";
  const controller = useVoiceSideScrollerController({ profileId });
  const { state } = controller;
  const controlsDisabled = state.status !== "running";

  return (
    <section
      aria-label="Zeg en Vlieg"
      className="pointer-events-auto absolute inset-0 z-10 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-2 overflow-hidden px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)] text-slate-900 landscape:grid-cols-[minmax(0,1fr)_11rem] landscape:grid-rows-[auto_minmax(0,1fr)] landscape:gap-3"
      data-component="VoiceSideScrollerScreen"
      data-active-word={controller.activeTarget?.word ?? ""}
      data-focus-words={state.education.focusWords.join(",")}
      data-microphone-status={controller.microphone.status}
      data-recognition-status={controller.wordRecognition.status}
      data-status={state.status}
      data-testid="voice-side-scroller-screen"
      data-voice-input={controller.microphone.verticalInput.toFixed(3)}
      data-voice-level={Math.round(controller.microphone.volumeLevel * 100)}
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
      <VoiceSideScrollerStage
        activeTarget={controller.activeTarget}
        microphone={controller.microphone}
        onBackToMenu={onBackToMenu}
        onRestart={controller.startRound}
        onStart={controller.startRound}
        state={state}
      />
      <div className="grid gap-2 landscape:min-h-0 landscape:grid-rows-[auto_auto_1fr]">
        <VoiceSideScrollerStatusPanel
          activeTarget={controller.activeTarget}
          gameplayFeedback={state.gameplayFeedback}
          onRepeatWordPrompt={controller.repeatWordPrompt}
          recognition={controller.wordRecognition}
          status={state.status}
        />
        <VoiceSideScrollerVoiceMeter microphone={controller.microphone} />
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
