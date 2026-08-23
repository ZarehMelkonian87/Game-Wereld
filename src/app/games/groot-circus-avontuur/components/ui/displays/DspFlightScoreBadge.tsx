import React from "react";

/**
 * @uxId DSP_FLIGHT_SCORE_BADGE
 * @screens SCR_ZEG_VLIEG_ACTIVE
 * @description Statustellermodule met score, trofee, sterren en level in de actieve vlieg-gameplay.
 */
export interface DspFlightScoreBadgeProps {
  score: number;
  level?: number;
  stars?: number;
  className?: string;
}

export const DspFlightScoreBadge: React.FC<DspFlightScoreBadgeProps> = ({
  score,
  level = 1,
  stars = 0,
  className = "",
}) => {
  return (
    <div
      className={`px-4 py-2 bg-sky-700 text-white rounded-full shadow flex items-center gap-3 border border-sky-500 font-bold text-sm ${className}`}
    >
      <span className="text-amber-300">🏆 {score}</span>
      <span className="text-amber-400">★ {stars}</span>
      <span className="bg-sky-900 px-2 py-0.5 rounded-full text-xs">Level {level}</span>
    </div>
  );
};
