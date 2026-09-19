import { z } from "zod";
import type { RuntimeStorage } from "../../../game-platform/contracts";

export interface RewardUnlock {
  id: string;
  label: string;
  type: "broom-color" | "broom-skin" | "broom-trail" | "sticker";
  /** Cumulatief aantal woordsterren (⭐) waarbij deze beloning wordt vrijgespeeld. */
  unlockAfterWordStars: number;
}

/**
 * "Strandschat" — het ENIGE beloningssysteem (zie GDD-index 7.2.b).
 * Eén oplopende verzamelcurve, gestuurd door het cumulatieve aantal
 * woordsterren (⭐) van het actieve profiel. Uitbreidbaar: voeg een regel toe.
 *
 * De drempels zijn voorlopige, te tunen waarden (taak T-02).
 */
// Oplopende "Strandschat"-curve (T-02). ~2 sterren per goed antwoord, ~24-32
// per ronde: een snelle eerste win (3), daarna rustig oplopend zodat de laatste
// beloning ~3-4 rondes duurt en de motivatie langer vasthoudt.
export const strandRewards: RewardUnlock[] = [
  {
    id: "sticker-schelp-starter",
    label: "Schelp Sticker",
    type: "sticker",
    unlockAfterWordStars: 3,
  },
  {
    id: "broom-color-sea-blue",
    label: "Zeeblauwe Bezemkleur",
    type: "broom-color",
    unlockAfterWordStars: 8,
  },
  { id: "sticker-dolfijn", label: "Dolfijn Sticker", type: "sticker", unlockAfterWordStars: 16 },
  {
    id: "broom-trail-strand",
    label: "Strand Sprankel",
    type: "broom-trail",
    unlockAfterWordStars: 28,
  },
  { id: "broom-skin-strand", label: "Strandbezem", type: "broom-skin", unlockAfterWordStars: 42 },
  {
    id: "sticker-ster-helper",
    label: "Ster Helper Sticker",
    type: "sticker",
    unlockAfterWordStars: 60,
  },
  { id: "broom-skin-goud", label: "Gouden Bezem", type: "broom-skin", unlockAfterWordStars: 85 },
];

const rewardIdsSchema = z.array(z.string().min(1));

const getRewardStorageKey = (profileId: string) =>
  `magisch-strand-avontuur:${profileId}:unlocked-rewards`;

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

/**
 * Cumulatieve, per-profiel bewaarde totalen. Dit is de bron van waarheid voor
 * de sterrenteller én voor het vrijspelen van beloningen — over alle sessies
 * en alle spelmodi heen (geen accounts/database nodig, puur lokaal per profiel).
 */
export interface ProfileTotals {
  speed: number;
  wordStars: number;
}

const profileTotalsSchema = z.object({
  speed: z.number().nonnegative(),
  wordStars: z.number().nonnegative(),
});

export const emptyProfileTotals: ProfileTotals = { speed: 0, wordStars: 0 };

const getTotalsStorageKey = (profileId: string) => `magisch-strand-avontuur:${profileId}:totals`;

/** Zet het cumulatieve profieltotaal terug op nul (gebruikt bij "voortgang resetten"). */
export const resetProfileTotals = (profileId: string, storage: RuntimeStorage) => {
  storage.remove(getTotalsStorageKey(profileId));
};

export const readProfileTotals = (profileId: string, storage: RuntimeStorage): ProfileTotals => {
  const raw = storage.get(getTotalsStorageKey(profileId));
  if (!raw) return emptyProfileTotals;
  try {
    return profileTotalsSchema.parse(JSON.parse(raw));
  } catch {
    return emptyProfileTotals;
  }
};

/**
 * Telt de zojuist verdiende sterren/tempo op bij het cumulatieve profieltotaal,
 * bewaart het en geeft het nieuwe totaal terug.
 */
export const addProfileTotals = (
  profileId: string,
  storage: RuntimeStorage,
  delta: { speed: number; wordStars: number },
): ProfileTotals => {
  const current = readProfileTotals(profileId, storage);
  const next: ProfileTotals = {
    speed: Math.max(0, current.speed + delta.speed),
    wordStars: Math.max(0, current.wordStars + delta.wordStars),
  };
  storage.set(getTotalsStorageKey(profileId), JSON.stringify(profileTotalsSchema.parse(next)));
  return next;
};

/**
 * Bepaalt welke beloningen nieuw vrijgespeeld worden op basis van het
 * CUMULATIEVE aantal woordsterren (niet per ronde). Geeft alleen beloningen
 * terug die de drempel halen en nog niet ontgrendeld zijn.
 */
export const resolveNewRewardUnlocks = (params: {
  totalWordStars: number;
  unlockedRewardIds: string[];
}) =>
  strandRewards.filter(
    (reward) =>
      !params.unlockedRewardIds.includes(reward.id) &&
      params.totalWordStars >= reward.unlockAfterWordStars,
  );

/** De eerstvolgende nog niet vrijgespeelde beloning (voor "volgend doel"-weergave). */
export const getNextRewardGoal = (unlockedRewardIds: string[]): RewardUnlock | undefined =>
  strandRewards.find((reward) => !unlockedRewardIds.includes(reward.id));
