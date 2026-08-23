import React from "react";

/**
 * @uxId LBL_TASK_SENTENCE
 * @screens SCR_ZEG_ZET_GAME
 * @description Instructiezin op het opdrachtenkaartje ('Zet de boot in de zee.').
 */
export interface LblTaskSentenceProps {
  sentence?: string;
  className?: string;
}

export const LblTaskSentence: React.FC<LblTaskSentenceProps> = ({
  sentence = "Zet de leeuw in de piste.",
  className = "",
}) => {
  return <h2 className={`font-black text-slate-900 text-lg flex-1 ${className}`}>{sentence}</h2>;
};
