import { ArrowLeft, Star } from "lucide-react";
import { HudIconButton } from "../../components/ui";
import type { DevtoolsComponent } from "./devtools";

interface WorldSelectHeaderProps {
  onBackToStart: () => void;
  starCount: number;
}

export const WorldSelectHeader: DevtoolsComponent<WorldSelectHeaderProps> = ({
  onBackToStart,
  starCount,
}) => (
  <header
    className="absolute left-3 right-auto top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex h-12 w-[calc(100vw-1.5rem)] items-start gap-2.5 landscape:left-3 landscape:right-3 landscape:w-auto"
    data-component="WorldSelectHeader"
  >
    <HudIconButton
      className="h-12 w-12 rounded-[1.1rem] border-[4px] border-white bg-white/95 shadow-[0_5px_0_rgba(21,48,74,0.18)]"
      icon={<ArrowLeft className="h-6 w-6" strokeWidth={3.2} />}
      label="Terug"
      onClick={onBackToStart}
      tone="white"
    />

    <div
      className="flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-[1.15rem] border-[4px] border-white bg-white/95 text-[1.35rem] font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.16)] landscape:flex-none landscape:basis-[16.25rem]"
      data-slot="title"
    >
      Kies wereld
    </div>

    <div
      aria-label={`${starCount} sterren`}
      className="inline-flex min-h-12 w-[4.875rem] shrink-0 items-center justify-center gap-1.5 rounded-[1.15rem] border-[4px] border-white bg-white/95 px-2 text-base font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.18)] landscape:ml-auto landscape:w-[8.25rem] landscape:flex-none landscape:justify-center landscape:gap-2 landscape:text-xl"
      data-component="WorldSelectStarCounter"
      data-testid="world-select-star-counter"
    >
      <Star
        className="h-5 w-5 fill-amber-300 text-amber-600 landscape:h-7 landscape:w-7"
        strokeWidth={2.4}
      />
      {starCount}
    </div>
  </header>
);

WorldSelectHeader.displayName = "WorldSelectHeader";
