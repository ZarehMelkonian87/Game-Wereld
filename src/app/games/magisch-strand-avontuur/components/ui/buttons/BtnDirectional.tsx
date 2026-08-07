import React from "react";

/**
 * @uxId BTN_MANUAL_FLY_UP
 * @uxId BTN_MANUAL_FLY_DOWN
 * @uxId BTN_FLY_UP
 * @uxId BTN_FLY_DOWN
 * @uxId BTN_TRAY_NEXT
 * @screens SCR_ZEG_VLIEG_START | SCR_ZEG_VLIEG_ACTIVE | SCR_ZEG_ZET_GAME
 * @description Richtingaanwijzer knop voor handmatige besturing (omhoog/omlaag/volgende).
 */
export interface BtnDirectionalProps {
  direction: "up" | "down" | "next";
  onClick: () => void;
  label?: string;
  className?: string;
}

export const BtnDirectional: React.FC<BtnDirectionalProps> = ({
  direction,
  onClick,
  label,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow-md border-b-4 border-emerald-700 flex items-center justify-center gap-2 hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all ${className}`}
    >
      {direction === "up" && (
        <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      )}
      {direction === "down" && (
        <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      )}
      {direction === "next" && (
        <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
      {label && <span>{label}</span>}
    </button>
  );
};
