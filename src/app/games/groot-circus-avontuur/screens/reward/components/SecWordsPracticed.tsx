import React from "react";

/**
 * @uxId SEC_WORDS_PRACTICED
 * @screens SCR_REWARD_SUMMARY
 * @description Overzicht van geoefende woorden met pil-tag.
 */
export interface SecWordsPracticedProps {
  wordsList?: string;
  className?: string;
}

export const SecWordsPracticed: React.FC<SecWordsPracticedProps> = ({
  wordsList = "nog geen woorden",
  className = "",
}) => {
  return (
    <div className={`p-3 bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
        Woorden geoefend:
      </span>
      <span className="inline-block px-3 py-1 bg-amber-100 text-amber-950 font-extrabold text-xs rounded-full">
        {wordsList}
      </span>
    </div>
  );
};
