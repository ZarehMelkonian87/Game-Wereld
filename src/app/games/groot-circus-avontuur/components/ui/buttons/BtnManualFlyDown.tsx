import React from "react";
import { ArrowDown } from "lucide-react";

/**
 * @uxId BTN_MANUAL_FLY_DOWN
 * @screens SCR_ZEG_VLIEG_START
 * @description Groene pijl-omlaag knop voor handmatige besturing van de vliegende bezem.
 */
export interface BtnManualFlyDownProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "data-testid"?: string;
}

export const BtnManualFlyDown: React.FC<BtnManualFlyDownProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId = "voice-side-scroller-fly-down-button",
  "aria-label": ariaLabel = "Omlaag vliegen",
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
      <ArrowDown className="h-5 w-5 shrink-0" strokeWidth={3.5} />
      <span>{children ?? "Omlaag"}</span>
    </button>
  );
};
