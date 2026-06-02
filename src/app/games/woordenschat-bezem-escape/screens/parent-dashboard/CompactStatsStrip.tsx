import { PanelCard } from "../../components/ui";
import type { DashboardStat } from "./types";

interface CompactStatsStripProps {
  stats: DashboardStat[];
}

export const CompactStatsStrip = ({ stats }: CompactStatsStripProps) => (
  <PanelCard
    className="grid min-h-[4rem] grid-cols-3 divide-x-2 divide-slate-200/80 !rounded-2xl !p-0"
    data-component="CompactStatsStrip"
    data-testid="dashboard-stats-strip"
  >
    {stats.map((stat) => (
      <div className="grid place-items-center px-2 py-2 text-center" key={stat.label}>
        <p className="text-[0.64rem] font-black uppercase leading-none text-slate-600">
          {stat.label}
        </p>
        <p className="mt-1 text-[1.15rem] font-black leading-none text-slate-900">
          {stat.value}
        </p>
      </div>
    ))}
  </PanelCard>
);

CompactStatsStrip.displayName = "CompactStatsStrip";
