import { useEffect, useMemo, useRef, useState } from "react";
import { useProfile } from "../../../../contexts/ProfileContext";
import { BEZEM_ESCAPE_GAME_ID, recordRaceProgressSummary } from "../../logic/progress";
import {
  firstRewardUnlocks,
  readUnlockedRewardIds,
  resolveNewRewardUnlocks,
  saveUnlockedRewardIds,
  type RewardUnlock,
} from "../../logic/rewards";
import { formatList } from "./rewardDisplay";
import { RewardActionsPanel } from "./RewardActionsPanel";
import { RewardCard } from "./RewardCard";
import { readStoredRaceResult } from "./raceResultStorage";

interface RewardScreenProps {
  onBackToMenu?: () => void;
  onChooseWorld?: () => void;
  onPlayAgain?: () => void;
}

export const RewardScreen = ({
  onBackToMenu,
  onChooseWorld,
  onPlayAgain,
}: RewardScreenProps) => {
  const { currentProfile, updateProgress } = useProfile();
  const rewardProfileId = currentProfile?.id ?? "demo-profile";
  const progressSavedRef = useRef(false);
  const [raceResult] = useState(() => readStoredRaceResult());
  const [newRewards, setNewRewards] = useState<RewardUnlock[]>([]);
  const practicedWords = useMemo(
    () => formatList(raceResult.practicedWords, "nog geen woorden"),
    [raceResult.practicedWords],
  );
  const practicedConcepts = useMemo(
    () => formatList(raceResult.practicedConcepts, "nog geen plaatswoorden"),
    [raceResult.practicedConcepts],
  );
  const featuredReward = newRewards[0] ?? firstRewardUnlocks[0];
  const featuredRewardName = featuredReward?.label ?? "Woordster verzameld";
  const rewardSectionTitle = newRewards.length > 0 ? "Nieuwe beloning" : "Beloning";
  const rewardSectionText =
    newRewards.length > 0
      ? newRewards.map((reward) => reward.label).join(", ")
      : featuredRewardName;

  useEffect(() => {
    const unlockedRewardIds = readUnlockedRewardIds(rewardProfileId);
    const nextRewards = resolveNewRewardUnlocks({
      totalSpeed: raceResult.speedEarned,
      totalWordStars: raceResult.starsEarned,
      unlockedRewardIds,
    });

    setNewRewards(nextRewards);

    if (nextRewards.length === 0) {
      return;
    }

    saveUnlockedRewardIds(rewardProfileId, [
      ...unlockedRewardIds,
      ...nextRewards.map((reward) => reward.id),
    ]);
  }, [raceResult.speedEarned, raceResult.starsEarned, rewardProfileId]);

  useEffect(() => {
    const hasMeaningfulResult =
      raceResult.correctActions > 0 ||
      raceResult.practicedWords.length > 0 ||
      raceResult.starsEarned > 0;

    if (!hasMeaningfulResult || progressSavedRef.current) {
      return;
    }

    progressSavedRef.current = true;
    const progress = recordRaceProgressSummary(rewardProfileId, {
      audioRepeats: raceResult.audioRepeats,
      correctActions: raceResult.correctActions,
      hintsUsed: raceResult.hintsUsed,
      mistakes: raceResult.mistakes,
      playedAt: raceResult.playedAt,
      practicedConcepts: raceResult.practicedConcepts,
      practicedWords: raceResult.practicedWords,
      resultId: raceResult.resultId,
      speedEarned: raceResult.speedEarned,
      starsEarned: raceResult.starsEarned,
    });

    updateProgress(BEZEM_ESCAPE_GAME_ID, {
      completed: true,
      lastPlayed: raceResult.playedAt ?? new Date().toISOString(),
      score: progress.totalSpeed,
      stars: Math.min(3, Math.max(1, Math.ceil(raceResult.starsEarned / 4))),
    });
  }, [raceResult, rewardProfileId, updateProgress]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
      data-audio-repeats={raceResult.audioRepeats}
      data-correct-actions={raceResult.correctActions}
      data-hints-used={raceResult.hintsUsed}
      data-new-rewards={newRewards.map((reward) => reward.id).join(",")}
      data-practiced-concepts={raceResult.practicedConcepts.join(",")}
      data-practiced-words={raceResult.practicedWords.join(",")}
      data-profile-id={rewardProfileId}
      data-progress-saved={progressSavedRef.current ? "true" : "false"}
      data-result-id={raceResult.resultId ?? ""}
      data-shown-rewards={featuredReward?.id ?? ""}
      data-speed-earned={raceResult.speedEarned}
      data-stars-earned={raceResult.starsEarned}
      data-testid="reward-screen"
    >
      <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_7rem] gap-2 landscape:grid-cols-[minmax(0,1fr)_17rem] landscape:grid-rows-[minmax(0,1fr)]">
        <RewardCard
          featuredReward={featuredReward}
          featuredRewardName={featuredRewardName}
          practicedConcepts={practicedConcepts}
          practicedWords={practicedWords}
          raceResult={raceResult}
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
