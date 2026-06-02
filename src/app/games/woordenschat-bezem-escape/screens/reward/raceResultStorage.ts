export const RACE_RESULT_STORAGE_KEY = "woordenschat-bezem-escape:race-result";

export interface StoredRaceResult {
  audioRepeats: number;
  correctActions: number;
  hintsUsed: number;
  mistakes: number;
  playedAt?: string;
  practicedConcepts: string[];
  practicedWords: string[];
  resultId?: string;
  speedEarned: number;
  starsEarned: number;
}

export const emptyRaceResult: StoredRaceResult = {
  audioRepeats: 0,
  correctActions: 0,
  hintsUsed: 0,
  mistakes: 0,
  playedAt: undefined,
  practicedConcepts: [],
  practicedWords: [],
  resultId: undefined,
  speedEarned: 0,
  starsEarned: 0,
};

export const readStoredRaceResult = (): StoredRaceResult => {
  if (typeof window === "undefined") {
    return emptyRaceResult;
  }

  const rawResult = window.sessionStorage.getItem(RACE_RESULT_STORAGE_KEY);

  if (!rawResult) {
    return emptyRaceResult;
  }

  try {
    const parsedResult = JSON.parse(rawResult) as Partial<StoredRaceResult>;

    return {
      audioRepeats: Number(parsedResult.audioRepeats) || 0,
      correctActions: Number(parsedResult.correctActions) || 0,
      hintsUsed: Number(parsedResult.hintsUsed) || 0,
      mistakes: Number(parsedResult.mistakes) || 0,
      playedAt: typeof parsedResult.playedAt === "string" ? parsedResult.playedAt : undefined,
      practicedConcepts: Array.isArray(parsedResult.practicedConcepts)
        ? parsedResult.practicedConcepts.filter(Boolean)
        : [],
      practicedWords: Array.isArray(parsedResult.practicedWords)
        ? parsedResult.practicedWords.filter(Boolean)
        : [],
      resultId: typeof parsedResult.resultId === "string" ? parsedResult.resultId : undefined,
      speedEarned: Number(parsedResult.speedEarned) || 0,
      starsEarned: Number(parsedResult.starsEarned) || 0,
    };
  } catch {
    return emptyRaceResult;
  }
};
