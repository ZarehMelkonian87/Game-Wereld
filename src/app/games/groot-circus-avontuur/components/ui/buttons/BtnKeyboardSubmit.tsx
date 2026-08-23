import React from "react";
import { BtnPrimaryPlay, type BtnPrimaryPlayProps } from "./BtnPrimaryPlay";

/**
 * @uxId BTN_KEYBOARD_SUBMIT
 * @screens SCR_ZEG_ZET_KEYBOARD_OVERLAY
 * @description Bevestigingsknop in de typ-overlay om de getypte zin als antwoord te gebruiken.
 */
export const BtnKeyboardSubmit: React.FC<BtnPrimaryPlayProps> = (props) => (
  <BtnPrimaryPlay label="Gebruik zin" aria-label="Gebruik getypte zin" {...props} />
);
