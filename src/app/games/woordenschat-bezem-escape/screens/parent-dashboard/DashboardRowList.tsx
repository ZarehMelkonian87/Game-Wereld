import { StatusIcon } from "./statusDisplay";
import type { DashboardRow } from "./types";

interface DashboardRowListProps {
  rows: DashboardRow[];
}

export const DashboardRowList = ({ rows }: DashboardRowListProps) => {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-slate-200 bg-white/75 p-2 text-xs font-black leading-tight text-slate-700">
        Nog geen oefendata voor dit onderdeel.
      </p>
    );
  }

  return (
    <div className="grid gap-1.5" data-component="DashboardRowList">
      {rows.map((row) => (
        <div
          className="grid min-h-12 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border-2 border-white/80 bg-white/72 px-2.5 py-2"
          key={`${row.label}-${row.detail}`}
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-black leading-tight text-slate-900">{row.label}</p>
            <p className="mt-0.5 truncate text-[0.68rem] font-bold leading-tight text-slate-600">
              {row.detail}
            </p>
          </div>
          <StatusIcon status={row.status} />
        </div>
      ))}
    </div>
  );
};

DashboardRowList.displayName = "DashboardRowList";
