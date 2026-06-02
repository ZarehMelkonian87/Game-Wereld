import { Eye, Star } from "lucide-react";
import { broomIconUrls } from "../../asset-urls";
import { classNames } from "../../components/ui/classNames";

interface CompactProgressBarProps {
  boosting?: boolean;
  onOpenObservation: () => void;
  speedMax: number;
  speedValue: number;
  starMax: number;
  starValue: number;
}

const clampPercent = (value: number, max: number) => {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (value / max) * 100));
};

export const CompactProgressBar = ({
  boosting = false,
  onOpenObservation,
  speedMax,
  speedValue,
  starMax,
  starValue,
}: CompactProgressBarProps) => {
  const speedPercent = clampPercent(speedValue, speedMax);

  return (
    <div
      aria-label="Voortgang"
      className="pointer-events-auto grid min-h-14 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-[1.35rem] border-2 border-white/85 bg-white/88 px-2.5 py-1.5 shadow-[0_4px_0_rgba(15,23,42,0.1)] backdrop-blur-sm"
      data-component="CompactProgressBar"
      data-testid="scene-builder-status-area"
    >
      <div
        aria-label={`Bezem speed: ${speedValue} van ${speedMax}`}
        aria-valuemax={speedMax}
        aria-valuemin={0}
        aria-valuenow={Math.min(speedMax, Math.max(0, speedValue))}
        className="flex min-w-0 items-center gap-2"
        data-slot="speed"
        role="meter"
      >
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-black text-slate-950">
          <img alt="" className="h-5 w-5 object-contain" draggable={false} src={broomIconUrls.basic} />
          Speed
        </span>
        <span className="min-w-0 flex-1 overflow-hidden rounded-full border-2 border-emerald-200 bg-white">
          <span
            aria-hidden="true"
            className={classNames(
              "block h-3 rounded-full bg-gradient-to-r from-emerald-400 to-lime-300 transition-[width] duration-300",
              boosting && "animate-pulse",
            )}
            style={{ width: `${speedPercent}%` }}
          />
        </span>
        <span className="shrink-0 text-xs font-black tabular-nums text-slate-950">
          {speedValue}/{speedMax}
        </span>
      </div>

      <div
        aria-label={`Sterren: ${starValue} van ${starMax}`}
        className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-2xl border-2 border-amber-300 bg-amber-100 px-2 text-xs font-black text-amber-950"
        data-slot="stars"
      >
        <Star className="h-4 w-4 text-amber-500" fill="currentColor" strokeWidth={2.5} />
        <span className="tabular-nums">{starValue}/{starMax}</span>
      </div>

      <button
        aria-label="Ouder-observatie invullen"
        className="flex min-h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-950 shadow-[0_3px_0_rgba(2,132,199,0.22)] transition active:translate-y-0.5 active:shadow-none"
        data-slot="observation"
        data-testid="open-observation-sheet"
        onClick={onOpenObservation}
        type="button"
      >
        <Eye className="h-5 w-5" strokeWidth={3} />
      </button>
    </div>
  );
};

CompactProgressBar.displayName = "CompactProgressBar";
