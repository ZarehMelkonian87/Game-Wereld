import React from "react";

/**
 * @uxId INFOBOX_VIDEO_ERROR_BANNER
 * @screens SCR_ZEG_ZET_GAME
 * @description Fallback waarschuwingskaart bij problemen met video-afspelen.
 */
export interface InfoboxVideoErrorProps {
  message?: string;
  className?: string;
}

export const InfoboxVideoError: React.FC<InfoboxVideoErrorProps> = ({
  message = "Videostoring. Lees de instructie of gebruik de audioknop.",
  className = "",
}) => {
  return (
    <div
      className={`p-3 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold flex items-center gap-2 ${className}`}
    >
      <span>ℹ️</span>
      <span>{message}</span>
    </div>
  );
};
