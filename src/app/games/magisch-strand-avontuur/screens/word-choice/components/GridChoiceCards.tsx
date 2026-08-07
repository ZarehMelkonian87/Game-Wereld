import React from "react";

/**
 * @uxId GRID_CHOICE_CARDS
 * @screens SCR_KIES_WOORD_GAME
 * @description Kaartenraster van grote afbeeldingenkaarten waar de speler uit kiest.
 */
export interface GridChoiceCardsProps {
  children?: React.ReactNode;
  className?: string;
}

export const GridChoiceCards: React.FC<GridChoiceCardsProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-3 gap-4 max-w-2xl w-full mx-auto ${className}`}>
      {children}
    </div>
  );
};
