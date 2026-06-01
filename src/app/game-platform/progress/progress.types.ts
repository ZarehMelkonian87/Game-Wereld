export interface GameProgressSummary {
  correctWithHelp: number;
  correctWithoutHelp: number;
  gameId: string;
  hintsUsed: number;
  lastPlayedAt?: string;
  profileId: string;
  roundsPlayed: number;
}

