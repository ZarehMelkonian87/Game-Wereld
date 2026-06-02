import { classNames } from "../../components/ui/classNames";

interface SummaryPillProps {
  label: string;
  value: number | string;
  tone?: "amber" | "emerald" | "sky";
}

const toneClasses = {
  amber: "border-amber-300 bg-amber-100 text-amber-950",
  emerald: "border-emerald-300 bg-emerald-100 text-emerald-950",
  sky: "border-sky-300 bg-sky-100 text-sky-950",
};

export const SummaryPill = ({ label, tone = "sky", value }: SummaryPillProps) => (
  <div
    className={classNames(
      "flex min-h-12 min-w-0 flex-col justify-center rounded-2xl border-2 px-2 text-center font-black leading-none",
      toneClasses[tone],
    )}
    data-component="SummaryPill"
  >
    <span className="text-[0.65rem] uppercase tracking-normal opacity-80">{label}</span>
    <span className="mt-1 truncate text-sm tabular-nums">{value}</span>
  </div>
);

SummaryPill.displayName = "SummaryPill";
