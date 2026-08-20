import React from "react";
import { SummaryPill } from "../../../screens/reward/SummaryPill";

/**
 * @uxId STAT_BOX_STERREN
 * @screens SCR_REWARD_SUMMARY
 * @description Gele pil-statistiek voor het aantal verdiende sterren ('STERREN: 0/30').
 */
export interface StatBoxSterrenProps {
  value?: number | string;
  label?: string;
}

export const StatBoxSterren: React.FC<StatBoxSterrenProps> = ({
  value = 0,
  label = "Sterren",
}) => {
  return <SummaryPill label={label} tone="star" value={value} />;
};
