import React from "react";

/**
 * @uxId IMG_MASCOT_SPEAKER
 * @screens SCR_KIES_WOORD_GAME
 * @description Illustratie-badge van de sterrenfeemascotte die de vraag uitspreekt.
 */
export interface ImgMascotSpeakerProps {
  className?: string;
}

export const ImgMascotSpeaker: React.FC<ImgMascotSpeakerProps> = ({ className = "" }) => {
  return (
    <div
      className={`w-12 h-12 rounded-2xl bg-amber-300 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-sm ${className}`}
    >
      ⭐
    </div>
  );
};
