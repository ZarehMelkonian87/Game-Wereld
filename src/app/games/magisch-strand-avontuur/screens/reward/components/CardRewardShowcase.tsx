import React from "react";

/**
 * @uxId CARD_REWARD_SHOWCASE
 * @screens SCR_REWARD_SUMMARY
 * @description Centraal kader dat de verdiende sticker (Schelp Sticker) en regenboog-ster badge toont.
 */
export interface CardRewardShowcaseProps {
  children?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export const CardRewardShowcase: React.FC<CardRewardShowcaseProps> = ({
  children,
  className = "",
  "data-testid": testId = "card-reward-showcase",
}) => {
  return (
    <div
      data-testid={testId}
      className={`p-6 bg-amber-50 rounded-3xl border-2 border-amber-300 shadow-md text-center flex flex-col items-center gap-3 ${className}`}
    >
      <span className="text-6xl animate-bounce">🐚</span>
      {children}
    </div>
  );
};
