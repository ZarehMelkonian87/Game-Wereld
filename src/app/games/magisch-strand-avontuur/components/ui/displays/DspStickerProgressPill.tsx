import React from "react";

/**
 * @uxId DSP_STICKER_PROGRESS_PILL
 * @screens SCR_REWARD_SUMMARY
 * @description Voortgangsbadge voor het aantal verzamelde stickers op het beloningsscherm.
 */
export interface DspStickerProgressPillProps {
  collected?: number;
  total?: number;
  className?: string;
  "data-testid"?: string;
}

export const DspStickerProgressPill: React.FC<DspStickerProgressPillProps> = ({
  collected = 0,
  total = 30,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <div
      data-testid={testId}
      className={`px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-sm rounded-full shadow flex items-center gap-1 border border-amber-500 ${className}`}
    >
      <span>⭐</span>
      <span>
        {collected}/{total}
      </span>
    </div>
  );
};
