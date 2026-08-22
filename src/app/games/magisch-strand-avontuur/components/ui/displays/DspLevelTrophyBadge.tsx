import React from "react";

/**
 * @uxId DSP_LEVEL_TROPHY_BADGE
 * @screens SCR_ZEG_VLIEG_START
 * @description Compacte trofee- en levelbadge voor de start-overleg van Zeg & Vlieg.
 */
export interface DspLevelTrophyBadgeProps {
  score?: number;
  level?: number;
  stars?: number;
  className?: string;
}

export const DspLevelTrophyBadge: React.FC<DspLevelTrophyBadgeProps> = ({
  score = 0,
  level = 1,
  stars = 0,
  className = "",
}) => {
  return (
    <div
      className={`px-3 py-1.5 bg-sky-800 text-white rounded-2xl shadow flex items-center gap-2 border border-sky-600 font-bold text-xs ${className}`}
    >
      <span className="text-amber-300">🏆 {score}</span>
      <span className="text-amber-400">★ {stars}</span>
      <span className="bg-sky-950 px-2 py-0.5 rounded-full">Level {level}</span>
    </div>
  );
};
