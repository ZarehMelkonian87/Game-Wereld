import { Star } from "lucide-react";

export interface GameStarCounterProps {
  label?: string;
  value: number;
}

export const GameStarCounter = ({ label = "Sterren", value }: GameStarCounterProps) => (
  <div
    aria-label={`${label}: ${value}`}
    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-100 px-3 text-sm font-black text-amber-950 shadow-[0_3px_0_rgba(180,83,9,0.35)]"
    data-component="GameStarCounter"
  >
    <Star className="h-5 w-5 text-amber-500" data-slot="icon" fill="currentColor" strokeWidth={2.5} />
    <span className="tabular-nums" data-slot="value">
      {value}
    </span>
  </div>
);

GameStarCounter.displayName = "GameStarCounter";

