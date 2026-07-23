import { z } from "zod";
import type { GameId, ProfileId } from "../contracts";

const practiceProjectionEventSchema = z.object({
  attempts: z.number().int().nonnegative(),
  hintsUsed: z.number().int().nonnegative(),
  isCorrect: z.boolean(),
  mode: z.string().optional(),
  recordedAt: z.string().datetime().optional(),
});

export type PracticeProjectionEvent = z.infer<typeof practiceProjectionEventSchema>;

export const readBrowserPracticeEvents = (
  profileId: ProfileId,
  gameId: GameId,
): PracticeProjectionEvent[] => {
  const raw = window.localStorage.getItem(`game-runtime:practice:${profileId}:${gameId}`);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((event) => {
      const result = practiceProjectionEventSchema.safeParse(event);
      return result.success ? [result.data] : [];
    });
  } catch {
    return [];
  }
};
