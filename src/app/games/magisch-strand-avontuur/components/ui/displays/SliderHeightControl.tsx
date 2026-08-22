import React from "react";

/**
 * @uxId SLIDER_HEIGHT_CONTROL
 * @screens SCR_ZEG_VLIEG_ACTIVE
 * @description Verticale hoogte-indicator slider die de actuele vlieghoogte toont.
 */
export interface SliderHeightControlProps {
  currentHeightPercent: number;
  className?: string;
}

export const SliderHeightControl: React.FC<SliderHeightControlProps> = ({
  currentHeightPercent,
  className = "",
}) => {
  const heightClamped = Math.min(100, Math.max(0, currentHeightPercent));

  return (
    <div
      className={`w-6 h-48 bg-slate-900/40 backdrop-blur rounded-full border-2 border-white/50 p-1 flex flex-col justify-end relative shadow-inner ${className}`}
    >
      <div
        className="w-full bg-rose-500 rounded-full transition-all duration-150 shadow"
        style={{ height: `${heightClamped}%` }}
      />
    </div>
  );
};
