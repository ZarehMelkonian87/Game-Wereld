import { Star, Zap } from "lucide-react";
import { classNames } from "./classNames";

interface GameplayStatusBarProps {
  boosting?: boolean;
  className?: string;
  energyIconUrl?: string;
  speedMax: number;
  speedValue: number;
  starMax: number;
  starValue: number;
}

function clampPercent(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (value / max) * 100));
}

export function GameplayStatusBar({
  boosting = false,
  className,
  energyIconUrl,
  speedMax,
  speedValue,
  starMax,
  starValue,
}: GameplayStatusBarProps) {
  const speedPercent = clampPercent(speedValue, speedMax);

  return (
    <div
      data-testid="gameplay-status-bar"
      className={classNames(
        "grid h-full w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2",
        boosting && "scale-[1.02]",
        className,
      )}
    >
      <div
        aria-label={`Bezem speed: ${speedValue} van ${speedMax}`}
        data-testid="speed-status-bar"
        data-energy-kind="broom"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={speedMax}
        aria-valuenow={Math.min(speedMax, Math.max(0, speedValue))}
        className="flex min-w-0 items-center gap-2"
      >
        <span
          data-testid="broom-energy-bar"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-black leading-none text-slate-900"
        >
          {energyIconUrl ? (
            <img src={energyIconUrl} alt="" className="h-5 w-5 object-contain" draggable={false} />
          ) : (
            <Zap className="h-4 w-4 text-amber-500" fill="currentColor" strokeWidth={2.5} />
          )}
          Speed
        </span>
        <span className="min-w-0 flex-1 overflow-hidden rounded-full border-2 border-emerald-200 bg-white/85">
          <span
            aria-hidden="true"
            className={classNames(
              "block h-3 rounded-full bg-gradient-to-r from-emerald-400 to-lime-300 transition-[width] duration-300",
              boosting && "animate-pulse",
            )}
            style={{ width: `${speedPercent}%` }}
          />
        </span>
        <span className="shrink-0 text-xs font-black leading-none text-slate-900 tabular-nums">
          {speedValue}/{speedMax}
        </span>
      </div>

      <div
        aria-label={`Sterren: ${starValue} van ${starMax}`}
        data-testid="star-progress"
        className="inline-flex h-8 shrink-0 items-center gap-1 rounded-2xl border-2 border-amber-300 bg-amber-100 px-2 text-xs font-black leading-none text-amber-950"
      >
        <Star className="h-4 w-4 text-amber-500" fill="currentColor" strokeWidth={2.5} />
        <span className="tabular-nums">
          {starValue}/{starMax}
        </span>
      </div>
    </div>
  );
}
