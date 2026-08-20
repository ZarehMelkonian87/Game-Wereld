import React from "react";
import { SummaryPill } from "../../../screens/reward/SummaryPill";

/**
 * @uxId STAT_BOX_HINTS
 * @screens SCR_REWARD_SUMMARY
 * @description Blauwe pil-statistiek voor het aantal gebruikte hints ('HINTS: 0').
 */
export interface StatBoxHintsProps {
  value?: number | string;
  label?: string;
}

export const StatBoxHints: React.FC<StatBoxHintsProps> = ({ value = 0, label = "Hints" }) => {
  return <SummaryPill label={label} tone="hint" value={value} />;
};
