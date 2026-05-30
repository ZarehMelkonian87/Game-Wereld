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

function getRewardStorageKey(profileId: string) {
  return `woordenschat-bezem-escape:${profileId}:unlocked-rewards`;
}

export function readUnlockedRewardIds(profileId: string) {
  if (typeof window === "undefined") {
    return [];
  }

  const storedRewards = window.localStorage.getItem(getRewardStorageKey(profileId));
  if (!storedRewards) {
    return [];
  }

  try {
    const parsedRewards = JSON.parse(storedRewards);
    return Array.isArray(parsedRewards) ? parsedRewards.filter(Boolean) as string[] : [];
  } catch {
    return [];
  }
}

export function saveUnlockedRewardIds(profileId: string, rewardIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getRewardStorageKey(profileId), JSON.stringify(rewardIds));
}

export function resolveNewRewardUnlocks(params: {
  totalSpeed: number;
  totalWordStars: number;
  unlockedRewardIds: string[];
}) {
  return firstRewardUnlocks.filter((reward) => {
    if (params.unlockedRewardIds.includes(reward.id)) {
      return false;
    }

    if (reward.type === "sticker") {
      return params.totalWordStars >= 1;
    }

    return params.totalSpeed >= 1;
  });
}
