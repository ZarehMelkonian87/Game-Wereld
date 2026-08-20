import React from "react";
import { SummaryPill } from "../../../screens/reward/SummaryPill";

/**
 * @uxId STAT_BOX_TEMPO
 * @screens SCR_REWARD_SUMMARY
 * @description Paarse pil-statistiek voor antwoordsnelheid ('TEMPO: +3').
 */
export interface StatBoxTempoProps {
  value?: number | string;
  label?: string;
}

export const StatBoxTempo: React.FC<StatBoxTempoProps> = ({ value = "+0", label = "Tempo" }) => {
  return <SummaryPill label={label} tone="tempo" value={value} />;
};
