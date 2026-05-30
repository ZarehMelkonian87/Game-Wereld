import { RotateCcw, Star, StepForward } from "lucide-react";
import { broomIconUrls, mascotIconUrls } from "../asset-urls";
import { PanelCard, PrimaryActionButton } from "../components/ui";

export function RewardScreen() {
  return (
    <div
      data-testid="reward-screen"
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_7rem] gap-2 landscape:grid-cols-[minmax(0,1fr)_17rem] landscape:grid-rows-[minmax(0,1fr)]">
        <PanelCard
          aria-label="Beloning"
          data-testid="reward-card"
          className="flex min-h-0 flex-col items-center justify-center gap-4 p-4 landscape:col-start-1 landscape:row-start-1"
        >
          <div
            aria-hidden="true"
            className="relative flex h-44 w-44 items-center justify-center rounded-[2rem] border-2 border-amber-300 bg-amber-50/90 shadow-[0_6px_0_rgba(180,83,9,0.18)] landscape:h-36 landscape:w-36"
          >
            <img
              src={broomIconUrls.basic}
              alt=""
              className="h-28 w-36 object-contain landscape:h-24 landscape:w-32"
              draggable={false}
            />
            <img
              src={mascotIconUrls.celebration}
              alt=""
              className="absolute -right-5 -top-5 h-16 w-16 object-contain landscape:h-14 landscape:w-14"
              draggable={false}
            />
          </div>

          <div
            aria-label="Sterrenwinst: 18 van 30"
            data-testid="reward-stars"
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-100 px-4 text-lg font-black text-amber-950 shadow-[0_3px_0_rgba(180,83,9,0.35)]"
          >
            <Star className="h-6 w-6 text-amber-500" fill="currentColor" strokeWidth={2.5} />
            <span className="tabular-nums">18/30</span>
          </div>
        </PanelCard>

        <PanelCard
          aria-label="Beloning acties"
          data-testid="reward-action-area"
          className="grid min-h-0 grid-cols-2 items-center gap-3 !p-3 landscape:col-start-2 landscape:row-start-1 landscape:grid-cols-1 landscape:content-center"
        >
          <PrimaryActionButton
            className="pointer-events-auto h-14"
            iconLeft={<RotateCcw className="h-5 w-5" strokeWidth={3} />}
          >
            Opnieuw
          </PrimaryActionButton>
          <PrimaryActionButton
            className="pointer-events-auto h-14"
            iconRight={<StepForward className="h-5 w-5" strokeWidth={3} />}
          >
            Volgende
          </PrimaryActionButton>
        </PanelCard>
      </div>
    </div>
  );
}
