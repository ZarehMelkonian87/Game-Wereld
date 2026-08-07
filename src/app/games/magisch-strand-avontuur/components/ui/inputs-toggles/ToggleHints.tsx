import React from "react";

/**
 * @uxId TOGGLE_HINTS
 * @screens SCR_SETTINGS_PRIVACY
 * @description Witte kaart met lamp-icoon en toggle switch voor mascottesubsidie en hints.
 */
export interface ToggleHintsProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const ToggleHints: React.FC<ToggleHintsProps> = ({
  checked,
  onChange,
  className = "",
}) => {
  return (
    <label className={`flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">💡</span>
        <span className="font-bold text-slate-800 text-sm">Automatische hints</span>
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
