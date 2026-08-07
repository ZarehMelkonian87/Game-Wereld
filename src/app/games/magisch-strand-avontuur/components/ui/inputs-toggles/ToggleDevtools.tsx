import React from "react";

/**
 * @uxId TOGGLE_DEVTOOLS
 * @screens SCR_SETTINGS_PRIVACY
 * @description Witte kaart met sleutel-icoon en toggle switch voor ontwikkelaarsinstellingen / zone-editor.
 */
export interface ToggleDevtoolsProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const ToggleDevtools: React.FC<ToggleDevtoolsProps> = ({
  checked,
  onChange,
  className = "",
}) => {
  return (
    <label className={`flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">🔑</span>
        <span className="font-bold text-slate-800 text-sm">Zone Editor / DevTools</span>
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
