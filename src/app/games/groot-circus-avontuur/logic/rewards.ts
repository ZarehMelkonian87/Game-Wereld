import { z } from "zod";
import type { RuntimeStorage } from "../../../game-platform/contracts";

export interface RewardUnlock {
  id: string;
  label: string;
  type: "broom-color" | "sticker";
}

const rewardIdsSchema = z.array(z.string().min(1));
export const firstRewardUnlocks: RewardUnlock[] = [
  { id: "sticker-leeuw-starter", label: "Leeuw Sticker", type: "sticker" },
  {
    id: "broom-color-circus-red",
    label: "Circus Rode Bezemkleur",
    type: "broom-color",
  },
];

const getRewardStorageKey = (profileId: string) =>
  `groot-circus-avontuur:${profileId}:unlocked-rewards`;

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
