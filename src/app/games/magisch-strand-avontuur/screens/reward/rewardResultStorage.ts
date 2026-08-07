import { z } from "zod";
import type { RuntimeStorage } from "../../../../game-platform/contracts";

export const REWARD_RESULT_STORAGE_KEY = "magisch-strand-avontuur:reward-result";
const storedRewardResultSchema = z.object({
  audioRepeats: z.number().nonnegative(),
  correctActions: z.number().nonnegative(),
  hintsUsed: z.number().nonnegative(),
  mistakes: z.number().nonnegative(),
  playedAt: z.string().datetime().optional(),
  practicedConcepts: z.array(z.string()),
  practicedWords: z.array(z.string()),
  resultId: z.string().optional(),
  speedEarned: z.number().nonnegative(),
  starsEarned: z.number().nonnegative(),
});
export type StoredRewardResult = z.infer<typeof storedRewardResultSchema>;

export const emptyRewardResult: StoredRewardResult = {
  audioRepeats: 0,
  correctActions: 0,
  hintsUsed: 0,
  mistakes: 0,
  practicedConcepts: [],
  practicedWords: [],
  speedEarned: 0,
  starsEarned: 0,
};

export const readStoredRewardResult = (storage: RuntimeStorage): StoredRewardResult => {
  const rawResult = storage.get(REWARD_RESULT_STORAGE_KEY, "session");
  if (!rawResult) return emptyRewardResult;
  try {
    return storedRewardResultSchema.parse({
      ...emptyRewardResult,
      ...storedRewardResultSchema.partial().parse(JSON.parse(rawResult)),
    });
  } catch {
    return emptyRewardResult;
  }
};
