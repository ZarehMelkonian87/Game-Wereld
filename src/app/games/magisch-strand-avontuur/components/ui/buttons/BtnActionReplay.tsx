import React from "react";

/**
 * @uxId BTN_ACTION_REPLAY
 * @screens SCR_REWARD_SUMMARY
 * @description Actieknop 'Opnieuw' op het beloningsscherm om de sessie te herstarten.
 */
export interface BtnActionReplayProps {
  onClick: () => void;
  className?: string;
  "data-testid"?: string;
}

export const BtnActionReplay: React.FC<BtnActionReplayProps> = ({
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label="Speel opnieuw"
      className={`px-5 py-3 bg-emerald-600 text-white font-bold rounded-full shadow border-b-4 border-emerald-800 flex items-center gap-2 hover:bg-emerald-500 active:scale-95 transition-all ${className}`}
    >
      <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span>Opnieuw</span>
    </button>
  );
};
