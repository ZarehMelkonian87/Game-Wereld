import { ClipboardList } from "lucide-react";
import { PanelCard } from "../../components/ui";
import { DashboardRowList } from "./DashboardRowList";
import { CompactStatusBadge } from "./statusDisplay";
import type { DashboardRow } from "./types";

interface TodayPracticeCardProps {
  row: DashboardRow;
}

export const TodayPracticeCard = ({ row }: TodayPracticeCardProps) => (
  <PanelCard
    className="grid gap-2 !rounded-2xl !p-3"
    data-component="TodayPracticeCard"
    data-testid="dashboard-today-practice-card"
  >
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700"
      >
        <ClipboardList className="h-5 w-5" strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <h2 className="truncate text-sm font-black leading-tight text-slate-900">
          Vandaag geoefend
        </h2>
        <p className="mt-0.5 truncate text-xs font-bold leading-tight text-slate-600">
          {row.label} · {row.detail}
        </p>
      </div>
      <CompactStatusBadge status={row.status} />
    </div>
    <DashboardRowList rows={[row]} />
  </PanelCard>
);

TodayPracticeCard.displayName = "TodayPracticeCard";
