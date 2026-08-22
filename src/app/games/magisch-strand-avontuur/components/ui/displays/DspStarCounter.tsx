import React from "react";

/**
 * @uxId DSP_STAR_COUNTER
 * @screens SCR_MAIN_TITLE | SCR_ADVENTURE_SELECT | SCR_KIES_WOORD_GAME | SCR_ZEG_ZET_GAME
 * @description Statusteller capsule die het actuele aantal verzamelde sterren toont.
 */
export interface DspStarCounterProps {
  count: number;
  className?: string;
}

export const DspStarCounter: React.FC<DspStarCounterProps> = ({ count, className = "" }) => {
  return (
    <div
      className={`px-4 py-2 bg-white text-slate-800 font-extrabold rounded-full shadow border-2 border-amber-300 flex items-center gap-2 ${className}`}
    >
      <span className="text-xl text-amber-400">★</span>
      <span>{count}</span>
    </div>
  );
};
