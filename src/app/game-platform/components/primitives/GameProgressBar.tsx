import type { ReactNode } from "react";
import { Zap } from "lucide-react";
import { classNames } from "../../utils/classNames";

export type GameProgressBarTone = "blue" | "green" | "purple" | "yellow";

export interface GameProgressBarProps {
  icon?: ReactNode;
  label: string;
  max: number;
  tone?: GameProgressBarTone;
  value: number;
}

const fillClasses: Record<GameProgressBarTone, string> = {
  blue: "from-sky-400 to-cyan-300",
  green: "from-emerald-400 to-lime-300",
  purple: "from-violet-400 to-fuchsia-300",
  yellow: "from-amber-300 to-yellow-200",
};

const clampPercent = (value: number, max: number) => {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (value / max) * 100));
};

export const GameProgressBar = ({
  icon,
  label,
  max,
  tone = "green",
  value,
}: GameProgressBarProps) => {
  const percent = clampPercent(value, max);
  const clampedValue = Math.min(max, Math.max(0, value));

  return (
    <div
      aria-label={`${label}: ${value} van ${max}`}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={clampedValue}
      className="min-w-0 rounded-2xl border-2 border-slate-300 bg-white/95 p-2 shadow-[0_3px_0_rgba(15,23,42,0.12)]"
      data-component="GameProgressBar"
      data-tone={tone}
      role="meter"
    >
      <div className="mb-1 flex items-center justify-between gap-2 text-xs font-black text-slate-800">
        <span className="inline-flex min-w-0 items-center gap-1 truncate" data-slot="label">
          {icon ?? <Zap className="h-4 w-4 shrink-0 text-amber-500" fill="currentColor" strokeWidth={2.5} />}
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 tabular-nums" data-slot="value">
          {value}/{max}
        </span>
      </div>
      <div className="h-4 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100" data-slot="track">
        <div
          className={classNames(
            "h-full rounded-full bg-gradient-to-r transition-[width] duration-300",
            fillClasses[tone],
          )}
          data-slot="fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

GameProgressBar.displayName = "GameProgressBar";

