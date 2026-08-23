import React from "react";

/**
 * @uxId SPRITE_OBSTACLE_SHARK
 * @screens SCR_ZEG_VLIEG_ACTIVE
 * @description Springende haai obstakel uit het water.
 */
export interface SpriteObstacleSharkProps {
  posXPercent?: number;
  posYPercent?: number;
  className?: string;
}

export const SpriteObstacleShark: React.FC<SpriteObstacleSharkProps> = ({
  posXPercent = 60,
  posYPercent = 75,
  className = "",
}) => {
  return (
    <div
      style={{ left: `${posXPercent}%`, top: `${posYPercent}%` }}
      className={`absolute text-3xl ${className}`}
    >
      🦈
    </div>
  );
};
