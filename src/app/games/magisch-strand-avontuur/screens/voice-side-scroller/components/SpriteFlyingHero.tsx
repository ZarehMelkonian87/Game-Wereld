import React from "react";

/**
 * @uxId SPRITE_FLYING_HERO
 * @screens SCR_ZEG_VLIEG_ACTIVE
 * @description Geanimeerde spraakgestuurde speler-avatar op de vliegende strandbezem.
 */
export interface SpriteFlyingHeroProps {
  posYPercent?: number;
  className?: string;
  "data-testid"?: string;
}

export const SpriteFlyingHero: React.FC<SpriteFlyingHeroProps> = ({
  posYPercent = 50,
  className = "",
  "data-testid": testId = "sprite-flying-hero",
}) => {
  return (
    <div
      data-testid={testId}
      style={{ top: `${posYPercent}%` }}
      className={`absolute left-10 -translate-y-1/2 text-4xl transition-all duration-150 ${className}`}
    >
      🧹
    </div>
  );
};
