import React from "react";
import { Volume2 } from "lucide-react";

/**
 * @uxId BTN_AUDIO_REPLAY_PROMPT
 * @screens SCR_KIES_WOORD_GAME
 * @description Audioknop voor het opnieuw afspelen van de gesproken vraag.
 */
export interface BtnAudioReplayPromptProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "data-testid"?: string;
}

export const BtnAudioReplayPrompt: React.FC<BtnAudioReplayPromptProps> = ({
  onClick,
  className = "",
  disabled = false,
  "data-testid": testId = "word-choice-audio-replay-button",
  "aria-label": ariaLabel = "Luister opnieuw",
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      aria-label={ariaLabel}
      className={`pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-sky-300 bg-sky-100 text-sky-700 shadow-[0_3px_0_rgba(14,116,144,0.2)] outline-none transition active:translate-y-0.5 focus-visible:ring-4 focus-visible:ring-sky-200 motion-reduce:transition-none hover:bg-sky-200 ${className}`}
      {...props}
    >
      <Volume2 className="h-6 w-6" strokeWidth={3} />
    </button>
  );
};
