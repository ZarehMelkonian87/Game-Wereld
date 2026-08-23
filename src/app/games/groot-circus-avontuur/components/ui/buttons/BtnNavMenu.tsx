import React from "react";

/**
 * @uxId BTN_NAV_MENU
 * @screens SCR_SETTINGS_PRIVACY | SCR_REWARD_SUMMARY
 * @description Menuknop om terug te keren naar het instellingenmenu of hoofdscherm.
 */
export interface BtnNavMenuProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  "data-testid"?: string;
}

export const BtnNavMenu: React.FC<BtnNavMenuProps> = ({
  onClick,
  label = "Menu",
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`px-4 py-2 bg-white text-slate-700 font-bold rounded-full shadow border border-slate-200 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </button>
  );
};
