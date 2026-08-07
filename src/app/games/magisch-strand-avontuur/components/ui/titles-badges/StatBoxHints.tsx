import React from "react";

/**
 * @uxId STAT_BOX_HINTS
 * @screens SCR_REWARD_SUMMARY
 * @description Oranje pil-statistiek voor aantal gebruikte hints ('HINTS: 0').
 */
export interface StatBoxHintsProps {
  value?: number | string;
  className?: string;
}

export const StatBoxHints: React.FC<StatBoxHintsProps> = ({
  value = 0,
  className = "",
}) => {
  return (
    <div className={`px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-full shadow-sm flex items-center gap-1 ${className}`}>
      <span>HINTS:</span>
      <span className="font-extrabold">{value}</span>
    </div>
  );
};
