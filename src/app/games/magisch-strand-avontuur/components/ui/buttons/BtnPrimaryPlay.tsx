import React from "react";

/**
 * @uxId BTN_PRIMARY_PLAY
 * @uxId BTN_PRIMARY_START
 * @uxId BTN_PRIMARY_START_FLY
 * @uxId BTN_KEYBOARD_SUBMIT
 * @screens SCR_MAIN_TITLE | SCR_ADVENTURE_SELECT | SCR_ZEG_VLIEG_START | SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Primaire actieknop voor het starten van een game, sessie of het indienen van een actie.
 */
export interface BtnPrimaryPlayProps {
  onClick?: () => void;
  label?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  "data-testid"?: string;
}

export const BtnPrimaryPlay: React.FC<BtnPrimaryPlayProps> = ({
  onClick,
  label = "Spelen",
  children,
  className = "",
  disabled = false,
  type = "button",
  "aria-label": ariaLabel,
  "data-testid": testId,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
      className={`px-8 py-4 bg-emerald-700 text-white font-extrabold text-xl rounded-full shadow-lg border-b-4 border-emerald-900 flex items-center justify-center gap-3 hover:bg-emerald-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all ${className}`}
    >
      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
      <span>{children ?? label}</span>
    </button>
  );
};
