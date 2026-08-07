import { voiceSideScrollerMascotStateUrls } from "../../asset-urls";
import {
  BadgeModalStarHeader,
  BtnPrimaryStartFly,
  InfoboxPrivacyNote,
  PanelCard,
  TtlModalTitle,
} from "../../components/ui";
import { ContainerTargetWords } from "./components/ContainerTargetWords";
import { LblModalInstruction } from "./components/LblModalInstruction";
import type { VoiceSideScrollerGameState } from "./voiceSideScrollerModel";

interface VoiceSideScrollerStartOverlayProps {
  onStart: () => void;
  state: VoiceSideScrollerGameState;
}

/**
 * @uxId SCR_ZEG_VLIEG_START
 * @uxId CARD_MODAL_ZEG_VLIEG_START
 * @screens SCR_ZEG_VLIEG_START
 * @description Zeg & Vlieg Start & Instructie Modal (Scherm 5)
 */
export const VoiceSideScrollerStartOverlay = ({
  onStart,
  state,
}: VoiceSideScrollerStartOverlayProps) => (
  <div
    className="absolute inset-0 z-50 grid place-items-center bg-sky-950/12 p-3 backdrop-blur-[1px]"
    data-component="VoiceSideScrollerStartOverlay"
    data-testid="voice-side-scroller-start-overlay"
  >
    <PanelCard
      aria-label="Zeg en Vlieg starten"
      className="grid w-full max-w-[22rem] gap-3 !rounded-[1.5rem] !p-4 text-center"
    >
      <BadgeModalStarHeader imgSrc={voiceSideScrollerMascotStateUrls.ready} />
      <div>
        <TtlModalTitle title="Zeg & Vlieg" />
        <LblModalInstruction className="mt-2" />
      </div>
      <ContainerTargetWords words={state.education.focusWords} />
      <InfoboxPrivacyNote />
      <BtnPrimaryStartFly
        aria-label="Start Zeg en Vlieg"
        className="h-16 text-xl"
        onClick={onStart}
      >
        Start
      </BtnPrimaryStartFly>
    </PanelCard>
  </div>
);

VoiceSideScrollerStartOverlay.displayName = "VoiceSideScrollerStartOverlay";
