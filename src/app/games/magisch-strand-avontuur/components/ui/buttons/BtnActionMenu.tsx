import React from "react";
import { Home } from "lucide-react";

/**
 * @uxId BTN_ACTION_MENU
 * @screens SCR_REWARD_SUMMARY
 * @description Actieknop 'Menu' om terug te keren naar het hoofdscherm van Magisch Strand Avontuur.
 */
export interface BtnActionMenuProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "data-testid"?: string;
}

export const BtnActionMenu: React.FC<BtnActionMenuProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId = "reward-menu-button",
  "aria-label": ariaLabel = "Terug naar menu",
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
      className={`pointer-events-auto min-h-14 min-w-0 px-2 py-2 bg-sky-500 text-white font-extrabold text-[0.82rem] rounded-2xl border-2 border-sky-600 shadow-[0_4px_0_rgba(2,132,199,0.7)] flex items-center justify-center gap-1.5 hover:bg-sky-400 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all ${className}`}
      {...props}
    >
      <Home className="h-5 w-5 shrink-0" strokeWidth={3} />
      <span>{children ?? "Menu"}</span>
    </button>
  );
};
