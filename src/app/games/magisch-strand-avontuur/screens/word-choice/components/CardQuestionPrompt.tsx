import React from "react";

/**
 * @uxId CARD_QUESTION_PROMPT
 * @screens SCR_KIES_WOORD_GAME
 * @description Bovenvak met mascottesticker, de vraagtekst en herhaalknop.
 */
export interface CardQuestionPromptProps {
  children?: React.ReactNode;
  className?: string;
}

export const CardQuestionPrompt: React.FC<CardQuestionPromptProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`p-4 bg-white rounded-3xl border-2 border-sky-200 shadow-md flex items-center gap-3 max-w-md w-full mx-auto ${className}`}>
      {children}
    </div>
  );
};
