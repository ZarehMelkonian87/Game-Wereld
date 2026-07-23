export interface RewardUnlock {
  id: string;
  label: string;
  type: "broom-color" | "sticker";
}
export const firstRewardUnlocks: RewardUnlock[] = [
  {
    id: "sticker-schelp-starter",
    label: "Schelp Sticker",
    type: "sticker",
  },
  {
    id: "broom-color-sea-blue",
    label: "Zee Blauwe Bezemkleur",
    type: "broom-color",
  },
];
const getRewardStorageKey = (profileId: string) => {
  return `strand-bezem-escape:${profileId}:unlocked-rewards`;
};
export const readUnlockedRewardIds = (profileId: string, storage: RuntimeStorage) => {
  const storedRewards = storage.get(getRewardStorageKey(profileId));
  if (!storedRewards) {
    return [];
  }
  try {
    const parsedRewards = JSON.parse(storedRewards);
    return Array.isArray(parsedRewards) ? (parsedRewards.filter(Boolean) as string[]) : [];
  } catch {
    return [];
  }
};
export const saveUnlockedRewardIds = (
  profileId: string,
  rewardIds: string[],
  storage: RuntimeStorage,
) => storage.set(getRewardStorageKey(profileId), JSON.stringify(rewardIds));
export const resolveNewRewardUnlocks = (params: {
  totalSpeed: number;
  totalWordStars: number;
  unlockedRewardIds: string[];
}) => {
  return firstRewardUnlocks.filter((reward) => {
    if (params.unlockedRewardIds.includes(reward.id)) {
      return false;
    }
    if (reward.type === "sticker") {
      return params.totalWordStars >= 1;
    }
    return params.totalSpeed >= 1;
  });
};
import type { RuntimeStorage } from "../../../game-platform/contracts";
