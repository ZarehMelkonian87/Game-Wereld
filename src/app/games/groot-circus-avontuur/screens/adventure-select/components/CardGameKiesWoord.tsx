import React from "react";

/**
 * @uxId CARD_GAME_KIES_WOORD
 * @screens SCR_ADVENTURE_SELECT
 * @description Spelkaart voor de minigame Kies het Woord (hoor een woord en kies het juiste plaatje).
 */
export interface CardGameKiesWoordProps {
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const CardGameKiesWoord: React.FC<CardGameKiesWoordProps> = ({
  isSelected = false,
  onSelect,
  className = "",
  "data-testid": testId = "card-game-kies-woord",
}) => {
  return (
    <div
      onClick={onSelect}
      data-testid={testId}
      className={`p-4 bg-white rounded-2xl shadow-md border-2 ${
        isSelected ? "border-sky-500 ring-2 ring-sky-300" : "border-slate-200"
      } cursor-pointer hover:scale-[1.02] transition-transform ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">📖</span>
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Kies het Woord</h3>
          <p className="text-xs font-medium text-slate-600">
            Hoor een woord en kies het juiste plaatje.
          </p>
        </div>
      </div>
    </div>
  );
};
