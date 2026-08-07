import React from "react";

/**
 * @uxId LBL_KEYBOARD_EXAMPLE
 * @screens SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Instructie voorbeeldtekst in de typ-overlay ('Bijvoorbeeld: Zet de boot in de zee.').
 */
export interface LblKeyboardExampleProps {
  exampleText?: string;
  className?: string;
}

export const LblKeyboardExample: React.FC<LblKeyboardExampleProps> = ({
  exampleText = "Bijvoorbeeld: Zet de boot in de zee.",
  className = "",
}) => {
  return (
    <p className={`text-xs text-slate-500 text-center italic ${className}`}>
      {exampleText}
    </p>
  );
};
