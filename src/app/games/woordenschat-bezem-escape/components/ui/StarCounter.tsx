import { Star } from "lucide-react";

interface StarCounterProps {
  label?: string;
  value: number;
}

export function StarCounter({ label = "Sterren", value }: StarCounterProps) {
  return (
    <div
      aria-label={`${label}: ${value}`}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-100 px-3 text-sm font-black text-amber-950 shadow-[0_3px_0_rgba(180,83,9,0.35)]"
    >
      <Star className="h-5 w-5 text-amber-500" fill="currentColor" strokeWidth={2.5} />
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
