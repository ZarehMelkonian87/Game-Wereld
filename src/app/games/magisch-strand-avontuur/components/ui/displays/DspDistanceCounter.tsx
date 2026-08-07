import React from "react";

/**
 * @uxId DSP_DISTANCE_COUNTER
 * @uxId BAR_DISTANCE_PROGRESS
 * @screens SCR_ZEG_VLIEG_START | SCR_ZEG_VLIEG_ACTIVE
 * @description Voortgangsbalk en tellermodule voor afgelegde vliegafstand.
 */
export interface DspDistanceCounterProps {
  currentMeters: number;
  targetMeters?: number;
  className?: string;
}

export const DspDistanceCounter: React.FC<DspDistanceCounterProps> = ({
  currentMeters,
  targetMeters = 100,
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, (currentMeters / targetMeters) * 100));

  return (
    <div className={`px-4 py-2 bg-sky-600 text-white rounded-full shadow flex items-center gap-3 border border-sky-400 ${className}`}>
      <span className="font-bold text-sm whitespace-nowrap">Afstand {currentMeters}m</span>
      <div className="w-24 h-3 bg-sky-800 rounded-full overflow-hidden border border-sky-500">
        <div
          className="h-full bg-amber-400 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
