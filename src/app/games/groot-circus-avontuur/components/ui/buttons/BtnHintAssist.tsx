import React from "react";
import { Lightbulb } from "lucide-react";

/**
 * @uxId BTN_HINT_ASSIST
 * @screens SCR_KIES_WOORD_GAME | SCR_ZEG_ZET_GAME
 * @description Gele knop met gloeilamp-icoon om een visuele of gesproken hint aan te vragen.
 */
export interface BtnHintAssistProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showLabel?: boolean;
  "data-testid"?: string;
}

export const BtnHintAssist: React.FC<BtnHintAssistProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId = "game-hint-button",
  "aria-label": ariaLabel = "Vraag hint aan",
  showLabel = false,
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      aria-label={ariaLabel}
      className={`h-12 min-w-12 px-3 bg-amber-400 text-amber-950 font-black rounded-2xl shadow-md border-2 border-amber-500 flex items-center justify-center gap-1.5 hover:bg-amber-300 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all ${className}`}
      {...props}
    >
      <Lightbulb className="h-5 w-5 shrink-0 fill-current" strokeWidth={2.5} />
      {showLabel ? <span>{children ?? "Hint"}</span> : null}
    </button>
  );
};
