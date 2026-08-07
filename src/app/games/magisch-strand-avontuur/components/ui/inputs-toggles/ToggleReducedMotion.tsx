import React from "react";

/**
 * @uxId TOGGLE_REDUCED_MOTION
 * @screens SCR_SETTINGS_PRIVACY
 * @description Witte kaart met oog-kruis icoon en toggle switch voor rustige bewegingen.
 */
export interface ToggleReducedMotionProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const ToggleReducedMotion: React.FC<ToggleReducedMotionProps> = ({
  checked,
  onChange,
  className = "",
}) => {
  return (
    <label className={`flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">👁️‍🗨️</span>
        <span className="font-bold text-slate-800 text-sm">Rustige beweging</span>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-6 h-6 accent-emerald-500 rounded cursor-pointer"
      />
    </label>
  );
};
