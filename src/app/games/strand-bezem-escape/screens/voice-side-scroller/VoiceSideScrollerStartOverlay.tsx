import { Play, ShieldCheck, Star } from "lucide-react";
import { voiceSideScrollerMascotStateUrls } from "../../asset-urls";
import { PanelCard, PrimaryActionButton } from "../../components/ui";
import type { VoiceSideScrollerGameState } from "./voiceSideScrollerModel";

interface VoiceSideScrollerStartOverlayProps {
  onStart: () => void;
  state: VoiceSideScrollerGameState;
}

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
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.35rem] border-[3px] border-amber-300 bg-amber-100 text-amber-700 shadow-[0_4px_0_rgba(180,83,9,0.2)]">
        <img
          alt=""
          className="h-14 w-14 object-contain"
          draggable={false}
          src={voiceSideScrollerMascotStateUrls.ready}
        />
      </div>
      <div>
        <h2 className="text-2xl font-black leading-none text-slate-900">Zeg & Vlieg</h2>
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
            <Star className="mr-1 h-3.5 w-3.5 text-amber-400" fill="currentColor" strokeWidth={2.5} />
            {word}
          </span>
        ))}
      </div>
      <p className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-2 text-xs font-black leading-tight text-emerald-950">
        <ShieldCheck className="mr-1 inline h-4 w-4" strokeWidth={3} />
        We slaan geen opname op.
      </p>
      <PrimaryActionButton
        aria-label="Start Zeg en Vlieg"
        className="h-16 text-xl"
        iconLeft={<Play className="h-7 w-7" fill="currentColor" strokeWidth={3} />}
        onClick={onStart}
      >
        Start
      </PrimaryActionButton>
    </PanelCard>
  </div>
);

VoiceSideScrollerStartOverlay.displayName = "VoiceSideScrollerStartOverlay";
