import React from "react";

/**
 * @uxId CARD_CHOICE_CRAB
 * @screens SCR_KIES_WOORD_GAME
 * @description Keuzekaart met afbeelding van een krab (correct antwoord).
 */
export interface CardChoiceCrabProps {
  onClick?: () => void;
  className?: string;
}

export const CardChoiceCrab: React.FC<CardChoiceCrabProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Kies krab"
      className={`p-4 bg-white rounded-3xl border-2 border-slate-200 shadow-md flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all ${className}`}
    >
      <span className="text-5xl">🦀</span>
      <span className="font-bold text-slate-800 text-sm">Krab</span>
    </button>
  );
};
