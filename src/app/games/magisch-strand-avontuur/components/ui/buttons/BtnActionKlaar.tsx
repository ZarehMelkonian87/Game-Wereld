import React from "react";
import { Check } from "lucide-react";

/**
 * @uxId BTN_ACTION_KLAAR
 * @screens SCR_ZEG_ZET_GAME
 * @description Groene actieknop 'Klaar' met vinkje om de plaatsing van objecten te valideren.
 */
export interface BtnActionKlaarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  "data-testid"?: string;
}

export const BtnActionKlaar: React.FC<BtnActionKlaarProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId,
  "aria-label": ariaLabel = "Controleer plaatsing",
  label = "Klaar",
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
      className={`px-6 py-3 bg-emerald-500 text-white font-extrabold text-lg rounded-full shadow-md border-b-4 border-emerald-700 flex items-center gap-2 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 transition-all ${className}`}
      {...props}
    >
      <Check className="w-6 h-6 shrink-0" strokeWidth={3} />
      <span>{children ?? label}</span>
    </button>
  );
};
