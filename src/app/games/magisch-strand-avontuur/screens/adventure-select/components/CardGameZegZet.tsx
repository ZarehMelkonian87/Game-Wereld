import React from "react";

/**
 * @uxId CARD_GAME_ZEG_ZET
 * @screens SCR_ADVENTURE_SELECT
 * @description Spelkaart voor de minigame Zeg & Zet (luister, spreek of typ en zet het plaatje op de goede plek).
 */
export interface CardGameZegZetProps {
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const CardGameZegZet: React.FC<CardGameZegZetProps> = ({
  isSelected = false,
  onSelect,
  className = "",
  "data-testid": testId = "card-game-zeg-zet",
}) => {
  return (
    <div
      onClick={onSelect}
      data-testid={testId}
      className={`p-4 bg-white rounded-2xl shadow-md border-2 ${
        isSelected ? "border-emerald-500 ring-2 ring-emerald-300" : "border-slate-200"
      } cursor-pointer hover:scale-[1.02] transition-transform ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">🗣️</span>
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Zeg & Zet</h3>
          <p className="text-xs font-medium text-slate-600">
            Luister, spreek of typ en zet het plaatje op de goede plek.
          </p>
        </div>
      </div>
    </div>
  );
};
