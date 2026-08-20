import React from "react";
import { Music2 } from "lucide-react";

/**
 * @uxId TOGGLE_MUSIC
 * @screens SCR_SETTINGS_PRIVACY
 * @description Witte kaart met muzieknoot-icoon en toggle switch voor achtergrondmuziek.
 */
export interface ToggleMusicProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  "data-testid"?: string;
}

export const ToggleMusic: React.FC<ToggleMusicProps> = ({
  checked,
  onChange,
  className = "",
  "data-testid": testId = "settings-music-toggle",
}) => {
  return (
    <button
      type="button"
      aria-label="Muziek aan of uit"
      aria-pressed={checked}
      data-testid={testId}
      onClick={() => onChange(!checked)}
      className={`grid min-h-14 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-2xl border-2 border-white/80 bg-white/82 p-2.5 text-left shadow-[0_3px_0_rgba(15,23,42,0.12)] active:translate-y-0.5 transition-all ${className}`}
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700"
      >
        <Music2 className="h-6 w-6" strokeWidth={3} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-black leading-tight text-slate-900">
          Muziek
        </span>
        <span className="mt-1 block text-xs font-bold leading-tight text-slate-600">
          Zachte muziek op de achtergrond.
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`flex h-8 w-14 items-center rounded-full border-2 p-1 transition motion-reduce:transition-none ${
          checked ? "border-emerald-400 bg-emerald-200" : "border-slate-300 bg-slate-200"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow transition motion-reduce:transition-none ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
};
