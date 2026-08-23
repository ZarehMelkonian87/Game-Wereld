import React from "react";

/**
 * @uxId BTN_KEYBOARD_CLOSE
 * @screens SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Annuleerknop om het typ-modal venster te sluiten zonder te versturen.
 */
export interface BtnKeyboardCloseProps {
  onClick: () => void;
  className?: string;
  "data-testid"?: string;
}

export const BtnKeyboardClose: React.FC<BtnKeyboardCloseProps> = ({
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label="Sluit typ venster"
      className={`px-6 py-3 bg-white text-slate-700 font-bold rounded-2xl shadow border-2 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all ${className}`}
    >
      Sluit
    </button>
  );
};
