import React from "react";

/**
 * @uxId FOOTER_QUIZ_PROGRESS
 * @screens SCR_KIES_WOORD_GAME
 * @description Voortgangsbalk voor 'Tempo' (0/10) en beloningsvoortgang (0/30 sterren) onderaan de quiz.
 */
export interface FooterQuizProgressProps {
  progress?: number;
  maxProgress?: number;
  className?: string;
}

export const FooterQuizProgress: React.FC<FooterQuizProgressProps> = ({
  progress = 0,
  maxProgress = 10,
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, (progress / maxProgress) * 100));

  return (
    <div className={`p-3 bg-amber-100/90 rounded-2xl border border-amber-300 shadow flex items-center justify-between gap-4 max-w-md w-full mx-auto ${className}`}>
      <span className="font-extrabold text-amber-950 text-xs whitespace-nowrap">Voortgang {progress}/{maxProgress}</span>
      <div className="flex-1 h-3 bg-amber-200 rounded-full overflow-hidden border border-amber-400">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
