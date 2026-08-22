import React from "react";

/**
 * @uxId BADGE_MODAL_STAR_HEADER
 * @screens SCR_ZEG_VLIEG_START
 * @description Decoratieve ster- of mascottebadge bovenaan de vlieg-instructiemodal.
 */
export interface BadgeModalStarHeaderProps {
  imgSrc?: string;
  className?: string;
}

export const BadgeModalStarHeader: React.FC<BadgeModalStarHeaderProps> = ({
  imgSrc,
  className = "",
}) => {
  return (
    <div
      className={`w-16 h-16 rounded-2xl border-2 border-amber-500 bg-amber-400 text-slate-900 shadow-md flex items-center justify-center -mt-10 mx-auto ${className}`}
    >
      {imgSrc ? (
        <img alt="" className="h-12 w-12 object-contain" draggable={false} src={imgSrc} />
      ) : (
        <span className="text-3xl">⭐</span>
      )}
    </div>
  );
};
