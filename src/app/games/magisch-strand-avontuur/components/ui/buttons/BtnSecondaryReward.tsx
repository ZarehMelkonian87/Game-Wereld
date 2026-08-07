import React from "react";

/**
 * @uxId BTN_SECONDARY_REWARD
 * @screens SCR_ADVENTURE_SELECT
 * @description Secundaire knop met cadeau-icoon om naar het belonings- en stickeroverzicht te gaan.
 */
export interface BtnSecondaryRewardProps {
  onClick: () => void;
  className?: string;
  "data-testid"?: string;
}

export const BtnSecondaryReward: React.FC<BtnSecondaryRewardProps> = ({
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label="Bekijk beloningen en stickers"
      className={`px-5 py-3 bg-amber-100 text-amber-900 font-bold rounded-2xl shadow border-2 border-amber-300 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      <span className="text-xl">🎁</span>
      <span>Beloningen</span>
    </button>
  );
};
