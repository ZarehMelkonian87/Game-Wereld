import React from "react";

/**
 * @uxId INFOBOX_VIDEO_ERROR_BANNER
 * @screens SCR_ZEG_ZET_GAME
 * @description Waarschuwings- en fallbackmelding bij videostoringen tijdens de opdracht.
 */
export interface InfoboxVideoErrorBannerProps {
  message?: string;
  className?: string;
}

export const InfoboxVideoErrorBanner: React.FC<InfoboxVideoErrorBannerProps> = ({
  message = "Video kon niet geladen worden. Lees de opdrachtzin of luister naar het geluid.",
  className = "",
}) => {
  return (
    <div
      className={`p-3 bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs rounded-2xl flex items-center gap-2 ${className}`}
    >
      <span className="text-base">📺</span>
      <span>{message}</span>
    </div>
  );
};
