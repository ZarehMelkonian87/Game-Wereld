import React from "react";
import { ArrowUp } from "lucide-react";

/**
 * @uxId BTN_MANUAL_FLY_UP
 * @screens SCR_ZEG_VLIEG_START
 * @description Groene pijl-omhoog knop voor handmatige besturing van de vliegende bezem.
 */
export interface BtnManualFlyUpProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "data-testid"?: string;
}

export const BtnManualFlyUp: React.FC<BtnManualFlyUpProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId = "voice-side-scroller-fly-up-button",
  "aria-label": ariaLabel = "Omhoog vliegen",
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
      className={`h-14 min-w-0 touch-none select-none px-4 py-2 bg-emerald-500 text-white font-extrabold text-sm rounded-2xl border-2 border-emerald-600 shadow-[0_4px_0_rgba(4,120,87,0.7)] flex items-center justify-center gap-2 hover:bg-emerald-400 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all ${className}`}
      {...props}
    >
      <ArrowUp className="h-5 w-5 shrink-0" strokeWidth={3.5} />
      <span>{children ?? "Omhoog"}</span>
    </button>
  );
};
