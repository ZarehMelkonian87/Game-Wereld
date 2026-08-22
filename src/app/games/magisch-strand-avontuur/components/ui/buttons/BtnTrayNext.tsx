import React from "react";

/**
 * @uxId BTN_TRAY_NEXT
 * @screens SCR_ZEG_ZET_GAME
 * @description Witte cirkelknop met pijl-rechts om door de stickers in het palet te bladeren.
 */
export interface BtnTrayNextProps {
  onClick?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const BtnTrayNext: React.FC<BtnTrayNextProps> = ({
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label="Volgende stickers"
      className={`w-10 h-10 rounded-full bg-white text-slate-700 shadow border border-slate-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};
