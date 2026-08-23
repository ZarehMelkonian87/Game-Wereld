import React from "react";

/**
 * @uxId LBL_KEYBOARD_EXAMPLE
 * @screens SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Instructie voorbeeldtekst in de typ-overlay ('Bijvoorbeeld: Zet de leeuw in de piste.').
 */
export interface LblKeyboardExampleProps {
  exampleText?: string;
  className?: string;
}

export const LblKeyboardExample: React.FC<LblKeyboardExampleProps> = ({
  exampleText = "Bijvoorbeeld: Zet de leeuw in de piste.",
  className = "",
}) => {
  return <p className={`text-xs text-slate-500 text-center italic ${className}`}>{exampleText}</p>;
};
