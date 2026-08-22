import React from "react";

/**
 * @uxId BTN_FLY_UP
 * @screens SCR_ZEG_VLIEG_ACTIVE
 * @description Besturingsknop omhoog in de actieve vlieg-gameplay.
 */
export interface BtnFlyUpProps {
  onClick?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const BtnFlyUp: React.FC<BtnFlyUpProps> = ({
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label="Vlieg omhoog"
      className={`w-14 h-14 rounded-2xl bg-emerald-500 text-white font-extrabold shadow-lg border-b-4 border-emerald-700 flex items-center justify-center text-2xl hover:bg-emerald-400 active:scale-95 transition-all ${className}`}
    >
      ▲
    </button>
  );
};
