import React from "react";

/**
 * @uxId BTN_AUDIO_TOGGLE
 * @uxId BTN_AUDIO_TOGGLE_QUICK
 * @uxId BTN_AUDIO_REPLAY_PROMPT
 * @screens SCR_MAIN_TITLE | SCR_KIES_WOORD_GAME | SCR_ZEG_ZET_GAME
 * @description Audioknop voor het in/uitschakelen van geluid of het opnieuw afspelen van gesproken instructies.
 */
export interface BtnAudioToggleProps {
  isMuted?: boolean;
  onToggle: () => void;
  variant?: "quick" | "replay" | "default";
  className?: string;
}

export const BtnAudioToggle: React.FC<BtnAudioToggleProps> = ({
  isMuted = false,
  onToggle,
  variant = "default",
  className = "",
}) => {
  const bgClass =
    variant === "replay"
      ? "bg-blue-500 text-white"
      : "bg-white text-slate-700 border border-slate-200";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isMuted ? "Geluid inschakelen" : "Geluid uitschakelen"}
      className={`w-12 h-12 rounded-full shadow flex items-center justify-center hover:scale-105 active:scale-95 transition-transform ${bgClass} ${className}`}
    >
      {isMuted ? (
        <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  );
};

export const BtnAudioToggleQuick: React.FC<Partial<BtnAudioToggleProps>> = (props) => (
  <BtnAudioToggle onToggle={props.onToggle ?? (() => undefined)} variant="quick" {...props} />
);
