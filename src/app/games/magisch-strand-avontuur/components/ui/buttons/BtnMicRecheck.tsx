import React from "react";

/**
 * @uxId BTN_MIC_RECHECK
 * @screens SCR_SETTINGS_PRIVACY
 * @description Knop om spraakherkenning en microfoontoestemming opnieuw te testen.
 */
export interface BtnMicRecheckProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const BtnMicRecheck: React.FC<BtnMicRecheckProps> = ({
  onClick,
  label = "Controleer opnieuw",
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-3 bg-emerald-700 text-white font-bold text-lg rounded-2xl shadow-md border-b-4 border-emerald-900 flex items-center justify-center gap-3 hover:bg-emerald-600 hover:scale-102 active:scale-98 transition-all ${className}`}
    >
      <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
};
