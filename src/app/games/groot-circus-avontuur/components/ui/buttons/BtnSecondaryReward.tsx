import React from "react";
import { Gift } from "lucide-react";

/**
 * @uxId BTN_SECONDARY_REWARD
 * @screens SCR_ADVENTURE_SELECT
 * @description Secundaire knop met cadeau-icoon om naar het belonings- en stickeroverzicht te gaan.
 */
export interface BtnSecondaryRewardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "data-testid"?: string;
}

export const BtnSecondaryReward: React.FC<BtnSecondaryRewardProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId = "adventure-rewards-button",
  "aria-label": ariaLabel = "Beloningen openen",
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
      className={`grid min-h-[3rem] w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-2xl border-[3px] border-amber-300 bg-amber-50 p-2 text-left shadow-[0_3px_0_rgba(21,48,74,0.1)] transition active:translate-y-0.5 active:shadow-none ${className}`}
      {...props}
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl border-2 border-white bg-amber-200 text-amber-900 shadow-sm">
        <Gift className="h-5 w-5" strokeWidth={3} />
      </span>
      <span className="truncate text-xs font-black leading-none text-slate-900">
        {children ?? "Beloning"}
      </span>
    </button>
  );
};
