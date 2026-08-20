import React from "react";
import { RotateCcw } from "lucide-react";

/**
 * @uxId BTN_ACTION_REPLAY
 * @screens SCR_REWARD_SUMMARY
 * @description Actieknop 'Opnieuw' op het beloningsscherm om de sessie te herstarten.
 */
export interface BtnActionReplayProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "data-testid"?: string;
}

export const BtnActionReplay: React.FC<BtnActionReplayProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId = "reward-play-again-button",
  "aria-label": ariaLabel = "Opnieuw spelen",
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
      className={`pointer-events-auto min-h-14 min-w-0 px-2 py-2 bg-emerald-500 text-white font-extrabold text-[0.82rem] rounded-2xl border-2 border-emerald-600 shadow-[0_4px_0_rgba(4,120,87,0.7)] flex items-center justify-center gap-1.5 hover:bg-emerald-400 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all ${className}`}
      {...props}
    >
      <RotateCcw className="h-5 w-5 shrink-0" strokeWidth={3} />
      <span>{children ?? "Opnieuw"}</span>
    </button>
  );
};
