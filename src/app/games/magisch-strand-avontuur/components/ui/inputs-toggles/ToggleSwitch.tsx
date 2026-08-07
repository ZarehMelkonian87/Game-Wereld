import React from "react";

/**
 * @uxId TOGGLE_AUDIO
 * @uxId TOGGLE_MUSIC
 * @uxId TOGGLE_HINTS
 * @uxId TOGGLE_REDUCED_MOTION
 * @uxId TOGGLE_DEVTOOLS
 * @screens SCR_SETTINGS_PRIVACY
 * @description Generieke schakelaar (Toggle switch) op een witte kaart voor instellingen.
 */
export interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-3 font-bold text-slate-800 text-base">
        {icon && <span className="text-xl">{icon}</span>}
        <span>{label}</span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
