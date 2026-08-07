import { BtnNavHome, DspDistanceCounter, DspFlightScore, PanelCard } from "../../components/ui";
import { VOICE_SCROLLER_LEVEL_DISTANCE } from "./voiceSideScrollerModel";
import type { VoiceSideScrollerGameState } from "./voiceSideScrollerModel";
import {
  getVoiceScrollerDifficultyProgress,
  getVoiceScrollerDistanceMeters,
} from "./voiceSideScrollerSelectors";

interface VoiceSideScrollerHudProps {
  onBackToMenu: () => void;
  state: VoiceSideScrollerGameState;
}

export const VoiceSideScrollerHud = ({ onBackToMenu, state }: VoiceSideScrollerHudProps) => {
  const distanceMeters = getVoiceScrollerDistanceMeters(state);
  const difficultyProgress = getVoiceScrollerDifficultyProgress(state);

  return (
    <PanelCard
      aria-label="Zeg en Vlieg status"
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 !rounded-[1.35rem] !p-2"
      data-component="VoiceSideScrollerHud"
      data-testid="voice-side-scroller-hud"
      variant="transparent"
    >
      <BtnNavHome onClick={onBackToMenu} />
      <DspDistanceCounter
        distanceMeters={distanceMeters}
        maxDistance={VOICE_SCROLLER_LEVEL_DISTANCE}
        progress={difficultyProgress}
      />
      <DspFlightScore
        level={state.difficultyLevel}
        score={state.score}
        stars={state.stars}
      />
    </PanelCard>
  );
};

VoiceSideScrollerHud.displayName = "VoiceSideScrollerHud";
