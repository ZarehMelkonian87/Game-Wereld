import { Star } from "lucide-react";
import { voiceSideScrollerMascotStateUrls } from "../../asset-urls";
import {
  BadgeModalHeader,
  BtnPrimaryPlay,
  InfoboxPrivacyNote,
  PanelCard,
  TtlModalTitle,
} from "../../components/ui";
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
      <BadgeModalHeader imgSrc={voiceSideScrollerMascotStateUrls.ready} />
      <div>
        <TtlModalTitle title="Zeg & Vlieg" />
        <p className="mt-2 text-sm font-black leading-tight text-sky-900">
          Vlieg zo ver mogelijk. Noem plaatjes die je ziet. Raak geen obstakel.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {state.education.focusWords.map((word) => (
          <span
            className="inline-flex min-h-7 items-center rounded-full border-2 border-white bg-amber-50 px-2.5 text-xs font-black text-amber-950 shadow-[0_2px_0_rgba(180,83,9,0.12)]"
            key={word}
          >
            <Star
              className="mr-1 h-3.5 w-3.5 text-amber-400"
              fill="currentColor"
              strokeWidth={2.5}
            />
            {word}
          </span>
        ))}
      </div>
      <InfoboxPrivacyNote />
      <BtnPrimaryPlay
        aria-label="Start Zeg en Vlieg"
        className="h-16 text-xl"
        onClick={onStart}
      >
        Start
      </BtnPrimaryPlay>
    </PanelCard>
  </div>
);

VoiceSideScrollerStartOverlay.displayName = "VoiceSideScrollerStartOverlay";
