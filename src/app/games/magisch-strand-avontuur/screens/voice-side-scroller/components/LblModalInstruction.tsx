import React from "react";

/**
 * @uxId LBL_MODAL_INSTRUCTION
 * @screens SCR_ZEG_VLIEG_START
 * @description Spelregels instructietekst onder de titel in de vlieg-modal.
 */
export interface LblModalInstructionProps {
  className?: string;
}

export const LblModalInstruction: React.FC<LblModalInstructionProps> = ({
  className = "",
}) => {
  return (
    <p className={`text-sm font-black leading-tight text-sky-900 ${className}`}>
      Vlieg zo ver mogelijk. Noem plaatjes die je ziet. Raak geen obstakel.
    </p>
  );
};
