import React from "react";

/**
 * @uxId BADGE_KEYBOARD_HEADER
 * @screens SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Blauwe toetsenbordicoon-badge bovenaan het typ-modal venster.
 */
export interface BadgeKeyboardHeaderProps {
  className?: string;
}

export const BadgeKeyboardHeader: React.FC<BadgeKeyboardHeaderProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`w-14 h-14 rounded-2xl border-2 border-sky-600 bg-sky-500 text-white shadow-md flex items-center justify-center -mt-10 mx-auto ${className}`}
    >
      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
        <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-3 0h2v2H5v-2zm0-3h2v2H5V8zm11 10H8v-2h8v2zm1-3h-2v-2h2v2zm0-3h-2V8h2v2z" />
      </svg>
    </div>
  );
};
