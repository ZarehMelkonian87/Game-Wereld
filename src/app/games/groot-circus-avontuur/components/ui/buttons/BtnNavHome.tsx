import React from "react";

/**
 * @uxId BTN_NAV_HOME
 * @screens SCR_ZEG_VLIEG_START | SCR_ZEG_VLIEG_ACTIVE
 * @description Homeknop om de game-omgeving te verlaten en naar het home/menu te navigeren.
 */
export interface BtnNavHomeProps {
  onClick: () => void;
  className?: string;
}

export const BtnNavHome: React.FC<BtnNavHomeProps> = ({ onClick, className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Naar Home"
      className={`w-12 h-12 rounded-xl bg-white text-slate-700 shadow flex items-center justify-center border border-slate-200 hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    </button>
  );
};
