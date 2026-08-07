import React from "react";

/**
 * @uxId CARD_CHOICE_SHELLS
 * @screens SCR_KIES_WOORD_GAME
 * @description Keuzekaart met afbeelding van schelpen.
 */
export interface CardChoiceShellsProps {
  onClick?: () => void;
  className?: string;
}

export const CardChoiceShells: React.FC<CardChoiceShellsProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Kies schelpen"
      className={`p-4 bg-white rounded-3xl border-2 border-slate-200 shadow-md flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all ${className}`}
    >
      <span className="text-5xl">🐚</span>
      <span className="font-bold text-slate-800 text-sm">Schelpen</span>
    </button>
  );
};
