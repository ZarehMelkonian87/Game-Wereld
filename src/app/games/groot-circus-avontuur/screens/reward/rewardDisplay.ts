import { broomIconUrls, getBeachObjectStickerUrl } from "../../asset-urls";
import type { RewardUnlock } from "../../logic/rewards";

export const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

export const formatList = (values: string[], emptyLabel: string) => {
  const uniqueValues = unique(values);
  return uniqueValues.length > 0 ? uniqueValues : [emptyLabel];
};

export const getRewardAssetUrl = (reward: RewardUnlock | undefined) => {
  if (!reward) {
    return broomIconUrls.basic;
  }

  if (reward.type === "sticker") {
    return getBeachObjectStickerUrl("leeuw") ?? broomIconUrls.basic;
  }

  return broomIconUrls.basic;
};
