import React from "react";

/**
 * @uxId BTN_SETTINGS_GEAR
 * @screens SCR_MAIN_TITLE
 * @description Instellingenknop met tandwiel-icoon om het privacy- en instellingenmenu te openen.
 */
export interface BtnSettingsGearProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  "aria-label"?: string;
  "data-testid"?: string;
}

export const BtnSettingsGear: React.FC<BtnSettingsGearProps> = ({
  onClick,
  className = "",
  ariaLabel,
  "aria-label": ariaLabelAttr,
  "data-testid": testId,
}) => {
  const label = ariaLabelAttr ?? ariaLabel ?? "Open instellingen";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-testid={testId}
      className={`w-12 h-12 rounded-2xl bg-amber-400 text-slate-800 shadow-md flex items-center justify-center border-2 border-amber-500 hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  );
};
