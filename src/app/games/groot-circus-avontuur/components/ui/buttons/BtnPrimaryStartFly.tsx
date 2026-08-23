import React from "react";
import { BtnPrimaryPlay, type BtnPrimaryPlayProps } from "./BtnPrimaryPlay";

/**
 * @uxId BTN_PRIMARY_START_FLY
 * @screens SCR_ZEG_VLIEG_START
 * @description Startknop in de vlieg-instructiemodal om het bezemvliegen direct te starten.
 */
export const BtnPrimaryStartFly: React.FC<BtnPrimaryPlayProps> = (props) => (
  <BtnPrimaryPlay label="Start Vliegen" aria-label="Start Zeg en Vlieg" {...props} />
);
