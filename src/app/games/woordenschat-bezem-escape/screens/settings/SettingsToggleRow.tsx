import type { ReactNode } from "react";

interface SettingsToggleRowProps {
  checked: boolean;
  description: string;
  icon: ReactNode;
  label: string;
  onToggle: () => void;
  testId: string;
}

export const SettingsToggleRow = ({
  checked,
  description,
  icon,
  label,
  onToggle,
  testId,
}: SettingsToggleRowProps) => (
  <button
    className="grid min-h-16 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border-2 border-white/80 bg-white/82 p-3 text-left shadow-[0_3px_0_rgba(15,23,42,0.12)] active:translate-y-0.5"
    data-testid={testId}
    onClick={onToggle}
    type="button"
  >
    <span
      aria-hidden="true"
      className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700"
    >
      {icon}
    </span>
    <span className="min-w-0">
      <span className="block truncate text-sm font-black leading-tight text-slate-900">
        {label}
      </span>
      <span className="mt-1 block text-xs font-bold leading-tight text-slate-600">
        {description}
      </span>
    </span>
    <span
      aria-hidden="true"
      className={`flex h-9 w-16 items-center rounded-full border-2 p-1 transition ${
        checked ? "border-emerald-400 bg-emerald-200" : "border-slate-300 bg-slate-200"
      }`}
    >
      <span
        className={`block h-6 w-6 rounded-full bg-white shadow transition ${
          checked ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </span>
  </button>
);

SettingsToggleRow.displayName = "SettingsToggleRow";
