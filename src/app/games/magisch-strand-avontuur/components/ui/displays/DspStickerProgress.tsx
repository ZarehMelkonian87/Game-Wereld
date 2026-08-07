import React from "react";

/**
 * @uxId DSP_STICKER_PROGRESS_PILL
 * @screens SCR_REWARD_SUMMARY
 * @description Voortgangsbadge voor de verzamelde hoeveelheid stickers.
 */
export interface DspStickerProgressProps {
  collected: number;
  total?: number;
  className?: string;
}

export const DspStickerProgressPill: React.FC<DspStickerProgressProps> = ({
  collected,
  total = 30,
  className = "",
}) => {
  return (
    <div
      className={`px-4 py-2 bg-amber-100 text-amber-900 font-extrabold rounded-full border border-amber-300 shadow-sm flex items-center gap-2 ${className}`}
    >
      <span className="text-amber-500">★</span>
      <span>{collected}/{total}</span>
    </div>
  );
};
