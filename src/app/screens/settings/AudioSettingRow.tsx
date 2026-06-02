import type { ReactNode } from "react";

interface AudioSettingRowProps {
  enabled: boolean;
  icon: ReactNode;
  label: string;
}

export const AudioSettingRow = ({ enabled, icon, label }: AudioSettingRowProps) => (
  <div
    className="flex items-center justify-between p-4 sm:p-5 bg-slate-600/50 rounded-lg sm:rounded-xl border-2 border-slate-500"
    data-component="AudioSettingRow"
  >
    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
      {icon}
      <span className="text-base sm:text-lg md:text-xl text-white font-bold truncate">
        {label}
      </span>
    </div>
    <div
      className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-black flex-shrink-0 ${
        enabled ? "bg-green-500 text-white" : "bg-gray-600 text-gray-400"
      }`}
    >
      {enabled ? "✓" : "✗"}
    </div>
  </div>
);

AudioSettingRow.displayName = "AudioSettingRow";
