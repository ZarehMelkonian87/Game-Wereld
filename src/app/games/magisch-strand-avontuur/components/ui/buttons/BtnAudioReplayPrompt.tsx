import React from "react";
import { BtnAudioToggle, type BtnAudioToggleProps } from "./BtnAudioToggle";

/**
 * @uxId BTN_AUDIO_REPLAY_PROMPT
 * @screens SCR_KIES_WOORD_GAME
 * @description Audioknop voor het opnieuw afspelen van de gesproken vraag.
 */
export const BtnAudioReplayPrompt: React.FC<Partial<BtnAudioToggleProps>> = (props) => (
  <BtnAudioToggle onToggle={props.onToggle ?? (() => undefined)} variant="replay" {...props} />
);
