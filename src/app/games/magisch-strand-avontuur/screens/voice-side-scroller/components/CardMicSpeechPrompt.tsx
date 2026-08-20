import React from "react";

/**
 * @uxId CARD_MIC_SPEECH_PROMPT
 * @screens SCR_ZEG_VLIEG_ACTIVE
 * @description Spraak statusbalk kaart onderaan de vlieggame: 'Noem wat je ziet'.
 */
export interface CardMicSpeechPromptProps {
  promptText?: string;
  className?: string;
}

export const CardMicSpeechPrompt: React.FC<CardMicSpeechPromptProps> = ({
  promptText = "Noem wat je ziet",
  className = "",
}) => {
  return (
    <div
      className={`p-3 bg-white/90 rounded-2xl shadow border border-sky-200 flex items-center gap-3 ${className}`}
    >
      <span className="text-xl animate-pulse">🎙️</span>
      <span className="font-extrabold text-sky-900 text-sm">{promptText}</span>
    </div>
  );
};
