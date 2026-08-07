import React from "react";

/**
 * @uxId BTN_ACTION_MENU
 * @screens SCR_REWARD_SUMMARY
 * @description Actieknop 'Menu' om terug te keren naar het hoofdscherm van Magisch Strand Avontuur.
 */
export interface BtnActionMenuProps {
  onClick: () => void;
  className?: string;
  "data-testid"?: string;
}

export const BtnActionMenu: React.FC<BtnActionMenuProps> = ({
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label="Terug naar hoofdmenu"
      className={`px-5 py-3 bg-emerald-600 text-white font-bold rounded-full shadow border-b-4 border-emerald-800 flex items-center gap-2 hover:bg-emerald-500 active:scale-95 transition-all ${className}`}
    >
      <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span>Menu</span>
    </button>
  );
};
