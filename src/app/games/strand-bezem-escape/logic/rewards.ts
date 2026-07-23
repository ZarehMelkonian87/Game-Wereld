import { z } from "zod";
import type { RuntimeStorage } from "../../../game-platform/contracts";

export interface RewardUnlock {
  id: string;
  label: string;
  type: "broom-color" | "sticker";
}

const rewardIdsSchema = z.array(z.string().min(1));
export const firstRewardUnlocks: RewardUnlock[] = [
  { id: "sticker-schelp-starter", label: "Schelp Sticker", type: "sticker" },
  {
    id: "broom-color-sea-blue",
    label: "Zee Blauwe Bezemkleur",
    type: "broom-color",
  },
];

const getRewardStorageKey = (profileId: string) =>
  `strand-bezem-escape:${profileId}:unlocked-rewards`;

export const readUnlockedRewardIds = (profileId: string, storage: RuntimeStorage) => {
  const storedRewards = storage.get(getRewardStorageKey(profileId));
  if (!storedRewards) return [];
  try {
    return rewardIdsSchema.parse(JSON.parse(storedRewards));
  } catch {
    return [];
  }
};

export const saveUnlockedRewardIds = (
  profileId: string,
  rewardIds: string[],
  storage: RuntimeStorage,
) => storage.set(getRewardStorageKey(profileId), JSON.stringify(rewardIdsSchema.parse(rewardIds)));

export const resolveNewRewardUnlocks = (params: {
  totalSpeed: number;
  totalWordStars: number;
  unlockedRewardIds: string[];
}) =>
  firstRewardUnlocks.filter((reward) => {
    if (params.unlockedRewardIds.includes(reward.id)) return false;
    return reward.type === "sticker" ? params.totalWordStars >= 1 : params.totalSpeed >= 1;
  });
