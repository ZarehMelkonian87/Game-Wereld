import React from "react";
import { Globe2 } from "lucide-react";

/**
 * @uxId BTN_ACTION_WORLD
 * @screens SCR_REWARD_SUMMARY
 * @description Actieknop 'Wereld' om terug te navigeren naar de Game-Wereld overzichtskaart.
 */
export interface BtnActionWorldProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "data-testid"?: string;
}

export const BtnActionWorld: React.FC<BtnActionWorldProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId = "reward-world-button",
  "aria-label": ariaLabel = "Terug naar wereldkeuze",
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
      className={`pointer-events-auto min-h-14 min-w-0 px-2 py-2 bg-emerald-700 text-white font-extrabold text-[0.82rem] rounded-2xl border-2 border-emerald-900 shadow-[0_4px_0_rgba(6,78,59,0.9)] flex items-center justify-center gap-1.5 hover:bg-emerald-600 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all ${className}`}
      {...props}
    >
      <Globe2 className="h-5 w-5 shrink-0" strokeWidth={3} />
      <span>{children ?? "Wereld"}</span>
    </button>
  );
};
