import React from "react";

/**
 * @uxId SPRITE_COLLECTIBLE_ITEMS
 * @screens SCR_ZEG_VLIEG_ACTIVE
 * @description Verzamelbare items zoals regenboogsterren en strandballen.
 */
export interface SpriteCollectibleItemsProps {
  posXPercent?: number;
  posYPercent?: number;
  type?: "star" | "ball";
  className?: string;
}

export const SpriteCollectibleItems: React.FC<SpriteCollectibleItemsProps> = ({
  posXPercent = 40,
  posYPercent = 40,
  type = "star",
  className = "",
}) => {
  return (
    <div
      style={{ left: `${posXPercent}%`, top: `${posYPercent}%` }}
      className={`absolute text-2xl animate-spin ${className}`}
    >
      {type === "star" ? "⭐" : "🏖️"}
    </div>
  );
};
