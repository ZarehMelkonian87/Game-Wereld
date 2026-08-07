import { useEffect, useMemo, useState } from "react";
import { useGameRuntime } from "../../runtime/GameRuntimeContext";
import {
  firstRewardUnlocks,
  readUnlockedRewardIds,
  resolveNewRewardUnlocks,
  saveUnlockedRewardIds,
  type RewardUnlock,
} from "../../logic/rewards";
import { TtlHeaderPill } from "../../components/ui";
import { formatList } from "./rewardDisplay";
import { RewardActionsPanel } from "./RewardActionsPanel";
import { RewardCard } from "./RewardCard";
import { readStoredRewardResult } from "./rewardResultStorage";

interface RewardScreenProps {
  onBackToMenu?: () => void;
  onChooseWorld?: () => void;
  onPlayAgain?: () => void;
}

/**
 * @uxId SCR_REWARD_SUMMARY
 * @screens SCR_REWARD_SUMMARY
 * @description Beloning & Resultaten Scherm (Scherm 4)
 */
export const RewardScreen = ({ onBackToMenu, onChooseWorld, onPlayAgain }: RewardScreenProps) => {
  const runtime = useGameRuntime();
  const rewardProfileId = runtime.identity.profileId;
  const [rewardResult] = useState(() => readStoredRewardResult(runtime.storage));
  const [newRewards, setNewRewards] = useState<RewardUnlock[]>([]);
  const practicedWords = useMemo(
    () => formatList(rewardResult.practicedWords, "nog geen woorden"),
    [rewardResult.practicedWords],
  );
  const practicedConcepts = useMemo(
    () => formatList(rewardResult.practicedConcepts, "nog geen plaatswoorden"),
    [rewardResult.practicedConcepts],
  );
  const featuredReward = newRewards[0] ?? firstRewardUnlocks[0];
  const featuredRewardName = featuredReward?.label ?? "Woordster verzameld";
  const rewardSectionTitle = newRewards.length > 0 ? "Nieuwe beloning" : "Beloning";
  const rewardSectionText =
    newRewards.length > 0
      ? newRewards.map((reward) => reward.label).join(", ")
      : featuredRewardName;

  useEffect(() => {
    const unlockedRewardIds = readUnlockedRewardIds(rewardProfileId, runtime.storage);
    const nextRewards = resolveNewRewardUnlocks({
      totalSpeed: rewardResult.speedEarned,
      totalWordStars: rewardResult.starsEarned,
      unlockedRewardIds,
    });

    setNewRewards(nextRewards);

    if (nextRewards.length === 0) {
      return;
    }

    saveUnlockedRewardIds(
      rewardProfileId,
      [...unlockedRewardIds, ...nextRewards.map((reward) => reward.id)],
      runtime.storage,
    );
  }, [rewardResult.speedEarned, rewardResult.starsEarned, rewardProfileId, runtime.storage]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-[4.25rem] landscape:px-3 landscape:pb-[calc(env(safe-area-inset-bottom)+0.5rem)] landscape:pt-[3.75rem]"
      data-audio-repeats={rewardResult.audioRepeats}
      data-correct-actions={rewardResult.correctActions}
      data-hints-used={rewardResult.hintsUsed}
      data-new-rewards={newRewards.map((reward) => reward.id).join(",")}
      data-practiced-concepts={rewardResult.practicedConcepts.join(",")}
      data-practiced-words={rewardResult.practicedWords.join(",")}
      data-profile-id={rewardProfileId}
      data-result-id={rewardResult.resultId ?? ""}
      data-shown-rewards={featuredReward?.id ?? ""}
      data-speed-earned={rewardResult.speedEarned}
      data-stars-earned={rewardResult.starsEarned}
      data-testid="reward-screen"
    >
      <div className="pointer-events-none absolute inset-x-0 top-[calc(env(safe-area-inset-top)+0.75rem)] z-20 flex justify-center px-3">
        <TtlHeaderPill data-testid="reward-title">Beloning</TtlHeaderPill>
      </div>
      <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-2">
        <RewardCard
          featuredReward={featuredReward}
          featuredRewardName={featuredRewardName}
          practicedConcepts={practicedConcepts}
          practicedWords={practicedWords}
          rewardResult={rewardResult}
          rewardSectionText={rewardSectionText}
          rewardSectionTitle={rewardSectionTitle}
        />
        <RewardActionsPanel
          onBackToMenu={onBackToMenu}
          onChooseWorld={onChooseWorld}
          onPlayAgain={onPlayAgain}
        />
      </div>
    </div>
  );
};

RewardScreen.displayName = "RewardScreen";
