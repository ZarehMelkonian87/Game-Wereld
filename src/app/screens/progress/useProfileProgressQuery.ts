import { useCallback, useEffect, useState } from "react";
import { createGameId, createProfileId } from "../../game-platform";
import {
  PRACTICE_PROJECTOR_VERSION,
  type PracticeEventEnvelope,
  type ProgressProjection,
  type RepositoryBundle,
  type StorageApplicationError,
} from "../../storage";

type ProgressQueryState =
  | { status: "loading" }
  | { error: StorageApplicationError; status: "error" }
  | {
      events: PracticeEventEnvelope[];
      projections: ProgressProjection[];
      status: "ready";
    }
  | { status: "rebuilding" };

export const useProfileProgressQuery = (
  profileIdValue: string | undefined,
  repositories: RepositoryBundle,
) => {
  const [state, setState] = useState<ProgressQueryState>({ status: "loading" });
  const [reloadVersion, setReloadVersion] = useState(0);
  const refresh = useCallback(() => setReloadVersion((value) => value + 1), []);

  useEffect(() => {
    if (!profileIdValue) return;
    let active = true;
    const profileId = createProfileId(profileIdValue);
    setState({ status: "loading" });
    void Promise.all([
      repositories.practice.listForProfile(profileId),
      repositories.progress.listForProfile(profileId),
    ])
      .then(async ([events, projections]) => {
        const eventsByGame = new Map<string, PracticeEventEnvelope[]>();
        events.forEach((event) => {
          eventsByGame.set(event.gameId, [...(eventsByGame.get(event.gameId) ?? []), event]);
        });
        const projectionsByGame = new Map<string, ProgressProjection>(
          projections.map((projection) => [projection.gameId, projection]),
        );
        const gamesToRebuild = [...eventsByGame.entries()].filter(([gameId, gameEvents]) => {
          const projection = projectionsByGame.get(gameId);
          return (
            projection?.projectorVersion !== PRACTICE_PROJECTOR_VERSION ||
            projection.sourceSelection.eventCount !== gameEvents.length
          );
        });
        if (gamesToRebuild.length === 0) return { events, projections };
        if (active) setState({ status: "rebuilding" });
        const rebuilt = await Promise.all(
          gamesToRebuild.map(([gameId]) =>
            repositories.progress.rebuild(
              profileId,
              createGameId(gameId),
              new Date().toISOString(),
            ),
          ),
        );
        rebuilt.forEach((projection) => projectionsByGame.set(projection.gameId, projection));
        return { events, projections: [...projectionsByGame.values()] };
      })
      .then((result) => {
        if (active) setState({ ...result, status: "ready" });
      })
      .catch((error: StorageApplicationError) => {
        if (active) setState({ error, status: "error" });
      });
    return () => {
      active = false;
    };
  }, [profileIdValue, reloadVersion, repositories]);

  return { refresh, state };
};
