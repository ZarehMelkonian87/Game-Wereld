import { PanelCard } from "../../components/ui";
import type { RewardUnlock } from "../../logic/rewards";
import type { StoredRaceResult } from "./raceResultStorage";
import { RewardPrizePanel } from "./RewardPrizePanel";
import { RewardResultSummary } from "./RewardResultSummary";

interface RewardCardProps {
  featuredReward?: RewardUnlock;
  featuredRewardName: string;
  practicedConcepts: string[];
  practicedWords: string[];
  raceResult: StoredRaceResult;
  rewardSectionText: string;
  rewardSectionTitle: string;
}

export const RewardCard = ({
  featuredReward,
  featuredRewardName,
  practicedConcepts,
  practicedWords,
  raceResult,
  rewardSectionText,
  rewardSectionTitle,
}: RewardCardProps) => (
  <div className="contents" data-component="RewardCard">
    <PanelCard
      aria-label="Resultaat en beloning"
      className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2 overflow-hidden !rounded-[1.65rem] !px-5 !py-3 landscape:grid-cols-[11rem_minmax(0,1fr)] landscape:grid-rows-1 landscape:gap-4 landscape:!p-4"
      data-testid="reward-card"
    >
      <RewardPrizePanel
        featuredReward={featuredReward}
        featuredRewardName={featuredRewardName}
        starsEarned={raceResult.starsEarned}
      />
      <RewardResultSummary
        featuredReward={featuredReward}
        practicedConcepts={practicedConcepts}
        practicedWords={practicedWords}
        raceResult={raceResult}
        rewardSectionText={rewardSectionText}
        rewardSectionTitle={rewardSectionTitle}
      />
    </PanelCard>
  </div>
);

RewardCard.displayName = "RewardCard";
