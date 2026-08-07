import React from "react";

/**
 * @uxId STAT_BOX_GOED
 * @screens SCR_REWARD_SUMMARY
 * @description Lichtgroene pil-statistiek voor foutloze antwoorden ('GOED: 0').
 */
export interface StatBoxGoedProps {
  value?: number | string;
  className?: string;
}

export const StatBoxGoed: React.FC<StatBoxGoedProps> = ({
  value = 0,
  className = "",
}) => {
  return (
    <div className={`px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-full shadow-sm flex items-center gap-1 ${className}`}>
      <span>GOED:</span>
      <span className="font-extrabold">{value}</span>
    </div>
  );
};
