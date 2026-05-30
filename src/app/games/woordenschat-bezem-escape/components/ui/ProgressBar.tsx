import { Zap } from "lucide-react";
import { classNames } from "./classNames";

type ProgressBarTone = "blue" | "green" | "purple" | "yellow";

const fillClasses: Record<ProgressBarTone, string> = {
  blue: "from-sky-400 to-cyan-300",
  green: "from-emerald-400 to-lime-300",
  purple: "from-violet-400 to-fuchsia-300",
  yellow: "from-amber-300 to-yellow-200",
};

interface ProgressBarProps {
  label: string;
  max: number;
  tone?: ProgressBarTone;
  value: number;
}

function clampPercent(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (value / max) * 100));
}

export function ProgressBar({ label, max, tone = "green", value }: ProgressBarProps) {
  const percent = clampPercent(value, max);

  return (
    <div
      aria-label={`${label}: ${value} van ${max}`}
      className="min-w-0 rounded-2xl border-2 border-slate-300 bg-white/95 p-2 shadow-[0_3px_0_rgba(15,23,42,0.12)]"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(max, Math.max(0, value))}
    >
      <div className="mb-1 flex items-center justify-between gap-2 text-xs font-black text-slate-800">
        <span className="inline-flex min-w-0 items-center gap-1 truncate">
          <Zap className="h-4 w-4 shrink-0 text-amber-500" fill="currentColor" strokeWidth={2.5} />
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 tabular-nums">{value}/{max}</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100">
        <div
          className={classNames(
            "h-full rounded-full bg-gradient-to-r transition-[width] duration-300",
            fillClasses[tone],
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
