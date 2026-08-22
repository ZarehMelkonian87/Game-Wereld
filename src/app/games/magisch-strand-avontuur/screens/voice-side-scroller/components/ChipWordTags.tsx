import React from "react";

/**
 * @uxId CHIP_WORD_TAGS
 * @screens SCR_ZEG_VLIEG_START
 * @description Gele capsule chip met ster-icoon en te noemen woord.
 */
export interface ChipWordTagsProps {
  word: string;
  className?: string;
}

export const ChipWordTags: React.FC<ChipWordTagsProps> = ({ word, className = "" }) => {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border-2 border-white bg-amber-50 px-2.5 text-xs font-black text-amber-950 shadow-[0_2px_0_rgba(180,83,9,0.12)] ${className}`}
    >
      <span className="mr-1 text-amber-400">★</span>
      {word}
    </span>
  );
};
