import React from "react";

/**
 * @uxId CARD_MODAL_ZEG_VLIEG_START
 * @screens SCR_ZEG_VLIEG_START
 * @description Centraal wit venster met de instructies en instellingen van Zeg & Vlieg.
 */
export interface CardModalZegVliegStartProps {
  children?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export const CardModalZegVliegStart: React.FC<CardModalZegVliegStartProps> = ({
  children,
  className = "",
  "data-testid": testId = "card-modal-zeg-vlieg-start",
}) => {
  return (
    <div
      data-testid={testId}
      className={`p-6 bg-white rounded-3xl shadow-xl border-2 border-sky-100 max-w-sm w-full text-center space-y-4 ${className}`}
    >
      {children}
    </div>
  );
};
