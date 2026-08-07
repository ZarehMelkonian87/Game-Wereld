import React from "react";

/**
 * @uxId STAT_BOX_AUDIO
 * @screens SCR_REWARD_SUMMARY
 * @description Witte pil-statistiek voor aantal audio-herhalingen ('AUDIO: 0').
 */
export interface StatBoxAudioProps {
  value?: number | string;
  className?: string;
}

export const StatBoxAudio: React.FC<StatBoxAudioProps> = ({
  value = 0,
  className = "",
}) => {
  return (
    <div className={`px-3 py-1 bg-white text-slate-700 border border-slate-300 font-bold text-xs rounded-full shadow-sm flex items-center gap-1 ${className}`}>
      <span>AUDIO:</span>
      <span className="font-extrabold">{value}</span>
    </div>
  );
};
