export type PracticeResult = "correct" | "with-help" | "incorrect" | "skipped";

export interface GameProgress {
  completed: boolean;
  gameId: string;
  lastPlayed: string;
  score: number;
  stars: number;
}

export interface PracticeEvent {
  attempts: number;
  audioRepeats: number;
  createdAt: string;
  difficulty: number;
  gameId: string;
  hintsUsed: number;
  practicedItemIds: string[];
  profileId: string;
  responseTimeMs?: number;
  result: PracticeResult;
  sessionId: string;
  skill: string;
  taskId: string;
}

export interface GameProgressSummary {
  correctWithHelp: number;
  correctWithoutHelp: number;
  gameId: string;
  hintsUsed: number;
  lastPlayedAt?: string;
  profileId: string;
  roundsPlayed: number;
}
