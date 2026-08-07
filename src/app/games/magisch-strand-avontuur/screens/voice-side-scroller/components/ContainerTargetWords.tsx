import React from "react";
import { ChipWordTags } from "./ChipWordTags";

/**
 * @uxId CONTAINER_TARGET_WORDS
 * @screens SCR_ZEG_VLIEG_START
 * @description Verzameling van te noemen strandwoorden met ster-iconen.
 */
export interface ContainerTargetWordsProps {
  words: string[];
  className?: string;
}

export const ContainerTargetWords: React.FC<ContainerTargetWordsProps> = ({
  words,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap justify-center gap-1.5 ${className}`}>
      {words.map((word) => (
        <ChipWordTags key={word} word={word} />
      ))}
    </div>
  );
};
