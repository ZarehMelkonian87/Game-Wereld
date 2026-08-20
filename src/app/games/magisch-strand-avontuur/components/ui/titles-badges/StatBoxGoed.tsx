import React from "react";
import { SummaryPill } from "../../../screens/reward/SummaryPill";

/**
 * @uxId STAT_BOX_GOED
 * @screens SCR_REWARD_SUMMARY
 * @description Lichtgroene pil-statistiek voor foutloze antwoorden ('GOED: 0').
 */
export interface StatBoxGoedProps {
  value?: number | string;
  label?: string;
  className?: string;
}

export const StatBoxGoed: React.FC<StatBoxGoedProps> = ({
  value = 0,
  label = "Goed",
}) => {
  return <SummaryPill label={label} tone="good" value={value} />;
};
