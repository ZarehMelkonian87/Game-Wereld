import React from "react";

/**
 * @uxId BTN_ACTION_WORLD
 * @screens SCR_REWARD_SUMMARY
 * @description Actieknop 'Wereld' om terug te navigeren naar de Game-Wereld overzichtskaart.
 */
export interface BtnActionWorldProps {
  onClick: () => void;
  className?: string;
  "data-testid"?: string;
}

export const BtnActionWorld: React.FC<BtnActionWorldProps> = ({
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label="Terug naar wereldkaart"
      className={`px-5 py-3 bg-sky-600 text-white font-bold rounded-full shadow border-b-4 border-sky-800 flex items-center gap-2 hover:bg-sky-500 active:scale-95 transition-all ${className}`}
    >
      <span className="text-lg">🌍</span>
      <span>Wereld</span>
    </button>
  );
};
