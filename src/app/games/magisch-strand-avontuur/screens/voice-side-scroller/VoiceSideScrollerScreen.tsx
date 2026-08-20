import { useGameRuntime } from "../../runtime/GameRuntimeContext";
import { useVoiceSideScrollerController } from "./useVoiceSideScrollerController";
import { VoiceSideScrollerHud } from "./VoiceSideScrollerHud";
import { VoiceSideScrollerStage } from "./VoiceSideScrollerStage";
import { VoiceSideScrollerStatusPanel } from "./VoiceSideScrollerStatusPanel";
import { VoiceSideScrollerThumbRail } from "./VoiceSideScrollerThumbRail";

interface VoiceSideScrollerScreenProps {
  onBackToMenu: () => void;
}

/**
 * @uxId SCR_ZEG_VLIEG_ACTIVE
 * @screens SCR_ZEG_VLIEG_ACTIVE
 * @description Zeg & Vlieg Actieve Vlieg Gameplay (Scherm 9)
 */
export const VoiceSideScrollerScreen = ({ onBackToMenu }: VoiceSideScrollerScreenProps) => {
  const runtime = useGameRuntime();
  const { identity } = runtime;
  const profileId = identity.profileId;
  const controller = useVoiceSideScrollerController({ profileId, runtime });
  const { state } = controller;
  const controlsDisabled = state.status !== "running";

  return (
    <section
      aria-label="Zeg en Vlieg"
      className="pointer-events-auto absolute inset-0 z-10 grid grid-rows-[minmax(0,1fr)_auto] overflow-hidden text-slate-900 landscape:grid-cols-[minmax(0,1fr)_10rem] landscape:grid-rows-1"
      data-component="VoiceSideScrollerScreen"
      data-focus-words={state.education.focusWords.join(",")}
      data-recognition-status={controller.wordRecognition.status}
      data-status={state.status}
      data-testid="voice-side-scroller-screen"
    >
      {/* Edge-to-edge speelveld: de HUD en rail zweven eroverheen, de scène
          wint de hoogte van de oude kop-rij terug. */}
      <div className="relative min-h-0">
        <VoiceSideScrollerStage
          fullBleed
          onBackToMenu={onBackToMenu}
          onRestart={controller.startRound}
          onStart={controller.startRound}
          state={state}
        />
        <div className="absolute inset-x-0 top-0 z-20 px-3 pt-[calc(env(safe-area-inset-top)+0.6rem)]">
          <VoiceSideScrollerHud onBackToMenu={onBackToMenu} state={state} />
        </div>
        <VoiceSideScrollerThumbRail
          disabled={controlsDisabled}
          onNeutral={controller.moveNeutral}
          onVerticalInput={controller.setVerticalInput}
        />
      </div>
      <div className="grid gap-2 px-3 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] pt-2 landscape:min-h-0 landscape:content-center landscape:pt-0">
        <VoiceSideScrollerStatusPanel
          gameplayFeedback={state.gameplayFeedback}
          recognition={controller.wordRecognition}
          status={state.status}
        />
      </div>
    </section>
  );
};

VoiceSideScrollerScreen.displayName = "VoiceSideScrollerScreen";
