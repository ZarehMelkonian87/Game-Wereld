import React from "react";
import { BadgeKeyboardHeader, TtlKeyboardModal } from "../../../components/ui";

/**
 * @uxId CARD_MODAL_KEYBOARD_INPUT
 * @screens SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Pop-up venster dat opent wanneer op de toetsenbordknop wordt getikt.
 */
export interface CardModalKeyboardInputProps {
  children?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export const CardModalKeyboardInput: React.FC<CardModalKeyboardInputProps> = ({
  children,
  className = "",
  "data-testid": testId = "card-modal-keyboard-input",
}) => {
  return (
    <div
      data-testid={testId}
      className={`p-6 bg-white rounded-3xl shadow-xl border-2 border-sky-200 max-w-sm w-full space-y-4 ${className}`}
    >
      <BadgeKeyboardHeader />
      <TtlKeyboardModal />
      {children}
    </div>
  );
};
