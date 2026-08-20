import React from "react";

/**
 * @uxId BANNER_REWARD_SUMMARY
 * @screens SCR_REWARD_SUMMARY
 * @description Onderste trofee-banner op het beloningsscherm.
 */
export interface BannerRewardSummaryProps {
  rewardText?: string;
  className?: string;
}

export const BannerRewardSummary: React.FC<BannerRewardSummaryProps> = ({
  rewardText = "Beloning: Schelp Sticker",
  className = "",
}) => {
  return (
    <div
      className={`p-4 bg-amber-300 text-amber-950 font-black text-base rounded-2xl shadow flex items-center justify-center gap-2 border border-amber-400 ${className}`}
    >
      <span>🏆</span>
      <span>{rewardText}</span>
    </div>
  );
};
