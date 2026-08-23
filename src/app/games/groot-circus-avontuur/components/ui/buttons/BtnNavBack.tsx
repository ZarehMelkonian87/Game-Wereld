import React from "react";

/**
 * @uxId BTN_NAV_BACK
 * @screens SCR_MAIN_TITLE | SCR_ADVENTURE_SELECT | SCR_KIES_WOORD_GAME | SCR_ZEG_ZET_GAME
 * @description Terugknop om te navigeren naar het vorige scherm of hoofdmenu.
 */
export interface BtnNavBackProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  "aria-label"?: string;
  "data-testid"?: string;
}

export const BtnNavBack: React.FC<BtnNavBackProps> = ({
  onClick,
  className = "",
  ariaLabel,
  "aria-label": ariaLabelAttr,
  "data-testid": testId,
}) => {
  const label = ariaLabelAttr ?? ariaLabel ?? "Ga terug";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-testid={testId}
      className={`w-12 h-12 rounded-full bg-white text-slate-700 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border border-slate-200 ${className}`}
    >
      <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};
