import React from "react";

/**
 * @uxId BTN_HINT_ASSIST
 * @screens SCR_KIES_WOORD_GAME | SCR_ZEG_ZET_GAME
 * @description Gele knop met gloeilamp-icoon om een visuele of gesproken hint aan te vragen.
 */
export interface BtnHintAssistProps {
  onClick?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const BtnHintAssist: React.FC<BtnHintAssistProps> = ({
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label="Vraag hint aan"
      className={`w-12 h-12 rounded-full bg-amber-400 text-slate-900 shadow-md border-2 border-amber-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      <span className="text-xl">💡</span>
    </button>
  );
};
