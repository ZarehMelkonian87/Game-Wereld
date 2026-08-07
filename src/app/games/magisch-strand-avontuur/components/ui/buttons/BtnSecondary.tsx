import React from "react";

/**
 * @uxId BTN_SECONDARY_REWARD
 * @uxId BTN_SECONDARY_OPTIONS
 * @uxId BTN_KEYBOARD_CLOSE
 * @screens SCR_ADVENTURE_SELECT | SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Secondaire knop voor opties, beloningen of het sluiten van overlays.
 */
export interface BtnSecondaryProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  variant?: "reward" | "options" | "close";
  className?: string;
}

export const BtnSecondary: React.FC<BtnSecondaryProps> = ({
  onClick,
  label,
  icon,
  variant = "options",
  className = "",
}) => {
  const bgClass =
    variant === "reward"
      ? "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl border-2 font-bold shadow-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform ${bgClass} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
