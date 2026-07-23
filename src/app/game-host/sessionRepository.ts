import type { GameId, ProfileId, SessionId } from "../game-platform/contracts";

export interface GameSessionRecord {
  finishedAt?: string;
  gameId: GameId;
  profileId: ProfileId;
  sessionId: SessionId;
  startedAt: string;
  status: "abandoned" | "completed" | "crashed" | "started";
}

const sessions = new Map<SessionId, GameSessionRecord>();

export const gameSessionRepository = {
  finish: (
    sessionId: SessionId,
    status: Exclude<GameSessionRecord["status"], "started">,
    finishedAt: string,
  ) => {
    const session = sessions.get(sessionId);
    if (session?.status === "started") {
      sessions.set(sessionId, { ...session, finishedAt, status });
    }
  },
  read: (sessionId: SessionId) => sessions.get(sessionId),
  start: (session: GameSessionRecord) => {
    sessions.set(session.sessionId, session);
  },
};
