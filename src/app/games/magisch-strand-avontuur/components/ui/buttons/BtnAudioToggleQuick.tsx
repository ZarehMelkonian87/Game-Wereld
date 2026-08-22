import React from "react";
import { BtnAudioToggle, type BtnAudioToggleProps } from "./BtnAudioToggle";

/**
 * @uxId BTN_AUDIO_TOGGLE_QUICK
 * @screens SCR_MAIN_TITLE
 * @description Snelle audioknop voor het in- of uitschakelen van geluid vanuit het hoofdscherm.
 */
export const BtnAudioToggleQuick: React.FC<Partial<BtnAudioToggleProps>> = (props) => (
  <BtnAudioToggle onToggle={props.onToggle ?? (() => undefined)} variant="quick" {...props} />
);
