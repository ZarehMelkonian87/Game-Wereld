import React from "react";

/**
 * @uxId BTN_MANUAL_FLY_DOWN
 * @screens SCR_ZEG_VLIEG_START
 * @description Groene pijl-omlaag knop voor handmatige besturing in het startoverleg van Zeg & Vlieg.
 */
export interface BtnManualFlyDownProps {
  onClick?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const BtnManualFlyDown: React.FC<BtnManualFlyDownProps> = ({
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label="Dalen"
      className={`px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl shadow border border-emerald-600 flex items-center gap-1 hover:bg-emerald-400 active:scale-95 transition-all ${className}`}
    >
      <span>▼</span>
      <span>Omlaag</span>
    </button>
  );
};
