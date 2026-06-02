import { ArrowLeft, Star } from "lucide-react";
import { HudIconButton } from "../../components/ui";
import type { DevtoolsComponent } from "./devtools";

interface AdventureSelectHeaderProps {
  onBackToStart: () => void;
  starCount: number;
}

export const AdventureSelectHeader: DevtoolsComponent<AdventureSelectHeaderProps> = ({
  onBackToStart,
  starCount,
}: AdventureSelectHeaderProps) => (
  <header
    className="absolute left-3 right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex h-14 items-center gap-2.5"
    data-component="AdventureSelectHeader"
  >
    <HudIconButton
      className="h-12 w-12 rounded-[1.1rem] border-[4px] border-white bg-white/95 shadow-[0_5px_0_rgba(21,48,74,0.18)]"
      icon={<ArrowLeft className="h-6 w-6" strokeWidth={3.2} />}
      label="Terug"
      onClick={onBackToStart}
      tone="white"
    />

    <div
      className="flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-[1.15rem] border-[4px] border-white bg-white/95 px-2 text-center text-[clamp(1rem,4.3vw,1.35rem)] font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.16)]"
      data-slot="title"
    >
      Kies avontuur
    </div>

    <div
      aria-label={`${starCount} sterren`}
      className="inline-flex min-h-12 w-[4.85rem] shrink-0 items-center justify-center gap-1.5 rounded-[1.15rem] border-[4px] border-white bg-white/95 px-2 text-base font-black leading-none text-slate-900 shadow-[0_5px_0_rgba(21,48,74,0.18)]"
      data-component="AdventureSelectStarCounter"
      data-testid="adventure-select-star-counter"
    >
      <Star className="h-5 w-5 fill-amber-300 text-amber-600" strokeWidth={2.4} />
      {starCount}
    </div>
  </header>
);

AdventureSelectHeader.displayName = "AdventureSelectHeader";
