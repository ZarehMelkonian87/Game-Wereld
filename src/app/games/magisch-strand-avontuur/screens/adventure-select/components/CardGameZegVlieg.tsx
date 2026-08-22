import React from "react";

/**
 * @uxId CARD_GAME_ZEG_VLIEG
 * @screens SCR_ADVENTURE_SELECT
 * @description Spelkaart voor de minigame Zeg & Vlieg (vlieg met je stem en zeg het strandwoord).
 */
export interface CardGameZegVliegProps {
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const CardGameZegVlieg: React.FC<CardGameZegVliegProps> = ({
  isSelected = false,
  onSelect,
  className = "",
  "data-testid": testId = "card-game-zeg-vlieg",
}) => {
  return (
    <div
      onClick={onSelect}
      data-testid={testId}
      className={`p-4 bg-amber-50 rounded-2xl shadow-md border-2 ${
        isSelected ? "border-amber-500 ring-2 ring-amber-300" : "border-amber-200"
      } cursor-pointer hover:scale-[1.02] transition-transform ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">🧹</span>
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Zeg & Vlieg</h3>
          <p className="text-xs font-medium text-slate-600">
            Vlieg met je stem en zeg het strandwoord.
          </p>
        </div>
      </div>
    </div>
  );
};
