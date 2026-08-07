import React from "react";

/**
 * @uxId STAT_BOX_TEMPO
 * @screens SCR_REWARD_SUMMARY
 * @description Lichtblauwe pil-statistiek voor tempobonus ('TEMPO: +0').
 */
export interface StatBoxTempoProps {
  value?: number | string;
  className?: string;
}

export const StatBoxTempo: React.FC<StatBoxTempoProps> = ({
  value = "+0",
  className = "",
}) => {
  return (
    <div className={`px-3 py-1 bg-sky-100 text-sky-900 border border-sky-300 font-bold text-xs rounded-full shadow-sm flex items-center gap-1 ${className}`}>
      <span>TEMPO:</span>
      <span className="font-extrabold">{value}</span>
    </div>
  );
};
