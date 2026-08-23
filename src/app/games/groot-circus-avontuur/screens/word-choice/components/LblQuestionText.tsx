import React from "react";

/**
 * @uxId LBL_QUESTION_TEXT
 * @screens SCR_KIES_WOORD_GAME
 * @description Vraagtekst op het vraagkaartje: 'Waar is de krab?'.
 */
export interface LblQuestionTextProps {
  questionText?: string;
  className?: string;
}

export const LblQuestionText: React.FC<LblQuestionTextProps> = ({
  questionText = "Waar is de leeuw?",
  className = "",
}) => {
  return (
    <h2 className={`font-extrabold text-sky-950 text-xl flex-1 ${className}`}>{questionText}</h2>
  );
};
