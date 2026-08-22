import React from "react";

/**
 * @uxId BTN_TASK_AUDIO
 * @screens SCR_ZEG_ZET_GAME
 * @description Microfoonknop in de opdracht header om spraak in te spreken of beluisteren.
 */
export interface BtnTaskAudioProps {
  onClick?: () => void;
  className?: string;
  isRecording?: boolean;
}

export const BtnTaskAudio: React.FC<BtnTaskAudioProps> = ({
  onClick,
  className = "",
  isRecording = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Opdracht inspreken of beluisteren"
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white transition-all active:scale-95 ${
        isRecording ? "bg-red-500 animate-pulse" : "bg-emerald-500 hover:bg-emerald-400"
      } ${className}`}
    >
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
      </svg>
    </button>
  );
};
