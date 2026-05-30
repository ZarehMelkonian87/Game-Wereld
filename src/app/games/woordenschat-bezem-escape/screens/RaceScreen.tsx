import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { avatarIconUrls, broomIconUrls } from "../asset-urls";
import { HudIconButton, PanelCard } from "../components/ui";

export function RaceScreen() {
  return (
    <div
      data-testid="race-screen"
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_5rem] gap-2 landscape:grid-cols-[minmax(0,1fr)_12rem] landscape:grid-rows-[minmax(0,1fr)]">
        <section
          aria-label="Racegebied"
          data-testid="race-play-area"
          className="relative min-h-0 overflow-hidden rounded-[1.75rem] border-2 border-white/75 bg-white/5 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.18)] landscape:col-start-1 landscape:row-start-1"
        >
          <div
            data-testid="race-avatar-placeholder"
            className="absolute left-1/2 top-[58%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 landscape:top-[60%] landscape:h-24 landscape:w-24"
          >
            <img
              src={broomIconUrls.basic}
              alt=""
              className="absolute bottom-2 left-0 h-16 w-28 object-contain landscape:h-14 landscape:w-24"
              draggable={false}
            />
            <img
              src={avatarIconUrls.avatar01}
              alt=""
              className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 object-contain landscape:h-16 landscape:w-16"
              draggable={false}
            />
          </div>
        </section>

        <PanelCard
          aria-label="Raceknoppen"
          data-testid="race-control-area"
          className="flex min-h-0 items-center justify-center gap-3 !p-2 landscape:col-start-2 landscape:row-start-1 landscape:flex-col"
        >
          <HudIconButton
            className="pointer-events-auto h-14 w-14"
            icon={<ChevronLeft className="h-7 w-7" strokeWidth={3} />}
            label="Links"
            tone="blue"
          />
          <HudIconButton
            className="pointer-events-auto h-14 w-14"
            icon={<ArrowUp className="h-7 w-7" strokeWidth={3} />}
            label="Spring"
            tone="green"
          />
          <HudIconButton
            className="pointer-events-auto h-14 w-14"
            icon={<ChevronRight className="h-7 w-7" strokeWidth={3} />}
            label="Rechts"
            tone="blue"
          />
        </PanelCard>
      </div>
    </div>
  );
}
