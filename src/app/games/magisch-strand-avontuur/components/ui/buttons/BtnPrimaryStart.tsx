import React from "react";
import { BtnPrimaryPlay, type BtnPrimaryPlayProps } from "./BtnPrimaryPlay";

/**
 * @uxId BTN_PRIMARY_START
 * @screens SCR_ADVENTURE_SELECT
 * @description Startknop onderaan het avontuur-selectiescherm om de geselecteerde game te starten.
 */
export const BtnPrimaryStart: React.FC<BtnPrimaryPlayProps> = (props) => (
  <BtnPrimaryPlay label="Start Spel" aria-label="Start spel" {...props} />
);
