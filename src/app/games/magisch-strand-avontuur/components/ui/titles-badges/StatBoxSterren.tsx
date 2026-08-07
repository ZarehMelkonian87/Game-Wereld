import React from "react";

/**
 * @uxId STAT_BOX_STERREN
 * @screens SCR_REWARD_SUMMARY
 * @description Zachtgouden pil-statistiek voor gewonnen netto sterren ('STERREN: +0').
 */
export interface StatBoxSterrenProps {
  value?: number | string;
  className?: string;
}

export const StatBoxSterren: React.FC<StatBoxSterrenProps> = ({
  value = "+0",
  className = "",
}) => {
  return (
    <div className={`px-3 py-1 bg-amber-200 text-amber-950 border border-amber-400 font-bold text-xs rounded-full shadow-sm flex items-center gap-1 ${className}`}>
      <span>STERREN:</span>
      <span className="font-extrabold">{value}</span>
    </div>
  );
};
