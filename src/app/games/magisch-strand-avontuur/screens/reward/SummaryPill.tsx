import { classNames } from "../../components/ui/classNames";

export type SummaryPillTone = "good" | "hint" | "neutral" | "star" | "tempo";

interface SummaryPillProps {
  label: string;
  value: number | string;
  tone?: SummaryPillTone;
}

const toneClasses: Record<SummaryPillTone, string> = {
  good: "border-stat-good-border bg-stat-good-surface text-stat-good",
  hint: "border-stat-hint-border bg-stat-hint-surface text-stat-hint",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  star: "border-amber-300 bg-amber-100 text-amber-950",
  tempo: "border-stat-tempo-border bg-stat-tempo-surface text-stat-tempo",
};

export const SummaryPill = ({ label, tone = "neutral", value }: SummaryPillProps) => (
  <div
    className={classNames(
      "flex min-h-12 min-w-0 flex-col justify-center rounded-2xl border-2 px-2 text-center font-black leading-none",
      toneClasses[tone],
    )}
    data-component="SummaryPill"
    data-tone={tone}
  >
    <span className="text-[0.62rem] uppercase tracking-normal opacity-80">{label}</span>
    <span className="mt-1 truncate text-[0.9rem] tabular-nums">{value}</span>
  </div>
);

SummaryPill.displayName = "SummaryPill";
