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
      projection: ProgressProjection | null;
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
    const gameId = createGameId("strand-bezem-escape");
    setState({ status: "loading" });
    void Promise.all([
      repositories.practice.listForProfile(profileId, gameId),
      repositories.progress.get(profileId, gameId),
    ])
      .then(async ([events, projection]) => {
        const needsRebuild =
          events.length > 0 &&
          (projection?.projectorVersion !== PRACTICE_PROJECTOR_VERSION ||
            projection.sourceSelection.eventCount !== events.length);
        if (!needsRebuild) return { events, projection };
        if (active) setState({ status: "rebuilding" });
        const rebuilt = await repositories.progress.rebuild(
          profileId,
          gameId,
          new Date().toISOString(),
        );
        return { events, projection: rebuilt };
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
