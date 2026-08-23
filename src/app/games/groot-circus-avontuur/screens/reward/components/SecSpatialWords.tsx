import React from "react";

/**
 * @uxId SEC_SPATIAL_WORDS
 * @screens SCR_REWARD_SUMMARY
 * @description Overzicht van geoefende ruimtelijke plaatswoorden met pil-tag.
 */
export interface SecSpatialWordsProps {
  wordsList?: string;
  className?: string;
}

export const SecSpatialWords: React.FC<SecSpatialWordsProps> = ({
  wordsList = "nog geen plaatswoorden",
  className = "",
}) => {
  return (
    <div className={`p-3 bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
        Plaatswoorden geoefend:
      </span>
      <span className="inline-block px-3 py-1 bg-sky-100 text-sky-950 font-extrabold text-xs rounded-full">
        {wordsList}
      </span>
    </div>
  );
};
