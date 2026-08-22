import React from "react";

/**
 * @uxId BTN_TASK_KEYBOARD_TOGGLE
 * @screens SCR_ZEG_ZET_GAME
 * @description Toetsenbordknop in de opdracht header om het typ-modal venster te openen.
 */
export interface BtnTaskKeyboardToggleProps {
  onClick?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const BtnTaskKeyboardToggle: React.FC<BtnTaskKeyboardToggleProps> = ({
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label="Open toetsenbord invoer"
      className={`w-12 h-12 rounded-full bg-sky-500 text-white shadow-md border-2 border-sky-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-3 0h2v2H5v-2zm0-3h2v2H5V8zm11 10H8v-2h8v2zm1-3h-2v-2h2v2zm0-3h-2V8h2v2z" />
      </svg>
    </button>
  );
};
