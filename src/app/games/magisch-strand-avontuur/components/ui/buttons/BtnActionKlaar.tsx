import React from "react";

/**
 * @uxId BTN_ACTION_KLAAR
 * @screens SCR_ZEG_ZET_GAME
 * @description Groene actieknop 'Klaar' met vinkje om de plaatsing van objecten te valideren.
 */
export interface BtnActionKlaarProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  "data-testid"?: string;
}

export const BtnActionKlaar: React.FC<BtnActionKlaarProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      aria-label="Controleer plaatsing"
      className={`px-6 py-3 bg-emerald-500 text-white font-extrabold text-lg rounded-full shadow-md border-b-4 border-emerald-700 flex items-center gap-2 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 transition-all ${className}`}
    >
      <svg className="w-6 h-6 stroke-current stroke-3 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span>Klaar</span>
    </button>
  );
};
