import React from "react";

/**
 * @uxId LBL_MIC_INSTRUCTION
 * @screens SCR_SETTINGS_PRIVACY
 * @description Ondersteunende tekst onder de microfoon-controleerknop.
 */
export interface LblMicInstructionProps {
  className?: string;
}

export const LblMicInstruction: React.FC<LblMicInstructionProps> = ({ className = "" }) => {
  return (
    <p className={`text-xs text-slate-500 text-center italic ${className}`}>
      Tik op de knop om microfoontoegang opnieuw te vragen in de browser.
    </p>
  );
};
