import React from "react";
import { Settings } from "lucide-react";

/**
 * @uxId BTN_SECONDARY_OPTIONS
 * @screens SCR_ADVENTURE_SELECT
 * @description Secundaire optiesknop met tandwiel-icoon in het avontuur-selectiescherm.
 */
export interface BtnSecondaryOptionsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "data-testid"?: string;
}

export const BtnSecondaryOptions: React.FC<BtnSecondaryOptionsProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId = "adventure-settings-button",
  "aria-label": ariaLabel = "Opties openen",
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
      className={`grid min-h-[3rem] w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-2xl border-[3px] border-slate-200 bg-white/90 p-2 text-left shadow-[0_3px_0_rgba(21,48,74,0.1)] transition active:translate-y-0.5 active:shadow-none ${className}`}
      {...props}
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl border-2 border-white bg-slate-100 text-slate-800 shadow-sm">
        <Settings className="h-5 w-5" strokeWidth={3} />
      </span>
      <span className="truncate text-xs font-black leading-none text-slate-900">
        {children ?? "Opties"}
      </span>
    </button>
  );
};
