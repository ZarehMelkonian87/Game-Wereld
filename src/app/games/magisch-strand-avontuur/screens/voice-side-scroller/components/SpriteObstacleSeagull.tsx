import React from "react";

/**
 * @uxId SPRITE_OBSTACLE_SEAGULL
 * @screens SCR_ZEG_VLIEG_ACTIVE
 * @description Vliegende meeuw obstakel in de lucht.
 */
export interface SpriteObstacleSeagullProps {
  posXPercent?: number;
  posYPercent?: number;
  className?: string;
}

export const SpriteObstacleSeagull: React.FC<SpriteObstacleSeagullProps> = ({
  posXPercent = 80,
  posYPercent = 30,
  className = "",
}) => {
  return (
    <div
      style={{ left: `${posXPercent}%`, top: `${posYPercent}%` }}
      className={`absolute text-3xl animate-pulse ${className}`}
    >
      🕊️
    </div>
  );
};
