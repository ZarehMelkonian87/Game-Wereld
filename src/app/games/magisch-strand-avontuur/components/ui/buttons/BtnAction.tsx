import React from "react";

/**
 * @uxId BTN_ACTION_KLAAR
 * @uxId BTN_ACTION_REPLAY
 * @uxId BTN_ACTION_WORLD
 * @uxId BTN_ACTION_MENU
 * @uxId BTN_HINT_ASSIST
 * @uxId BTN_TASK_KEYBOARD_TOGGLE
 * @screens SCR_REWARD_SUMMARY | SCR_KIES_WOORD_GAME | SCR_ZEG_ZET_GAME
 * @description Actieknop voor specifieke gameplay-handelingen (klaar, herstarten, wereldkaart, hint).
 */
export interface BtnActionProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  variant?: "klaar" | "replay" | "world" | "menu" | "hint" | "keyboard";
  className?: string;
}

export const BtnAction: React.FC<BtnActionProps> = ({
  onClick,
  label,
  icon,
  variant = "klaar",
  className = "",
}) => {
  let colorStyle = "bg-emerald-500 text-white border-emerald-700";
  if (variant === "hint") colorStyle = "bg-amber-400 text-slate-900 border-amber-500";
  if (variant === "keyboard") colorStyle = "bg-sky-500 text-white border-sky-700";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 rounded-full border-b-4 font-bold shadow-md flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform ${colorStyle} ${className}`}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
};
