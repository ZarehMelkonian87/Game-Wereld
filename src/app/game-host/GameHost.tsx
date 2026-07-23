import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useProfile } from "../contexts/ProfileContext";
import {
  createBrowserGameRuntime,
  createEventId,
  createProfileId,
  createSessionId,
  isLoadableGameEntry,
  type GameCapability,
  type GameModule,
  type GameRuntime,
} from "../game-platform";
import { getGameRegistryEntry, resolveCanonicalGameId } from "../games";
import { acquireActiveGameSession } from "../pwa/pwaLifecycle";
import { ComingSoonGameScreen } from "../screens/game-play/ComingSoonGameScreen";
import {
  createRepositoryPracticeWriter,
  createRepositoryRuntimeStorage,
  gameSessionRecordSchema,
  reportStorageWriteFailure,
  useStorageRepositories,
  type SettingsRecord,
} from "../storage";
import { GameHostStatusScreen } from "./GameHostStatusScreen";
import { GameRuntimeBoundary } from "./GameRuntimeBoundary";
import { getMissingRequiredCapabilities, loadGameModule } from "./gameHostContracts";

type LoadState =
  | { status: "loading" }
  | { error: Error; status: "error" }
  | { module: GameModule; settings: SettingsRecord[]; status: "ready" };

const availableCapabilities = (): Set<GameCapability> => {
  const capabilities = new Set<GameCapability>();
  if (typeof Audio !== "undefined") capabilities.add("audio");
  if (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  ) {
    capabilities.add("microphone");
  }
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    capabilities.add("offline-package");
  }
  return capabilities;
};

export const GameHost = () => {
  const navigate = useNavigate();
  const { repositories } = useStorageRepositories();
  const { currentProfile } = useProfile();
  const { gameId: routeGameId, theme } = useParams();
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const closedRef = useRef(false);
  const sessionStartedRef = useRef(false);
  const sessionStartPromiseRef = useRef<Promise<void>>(Promise.resolve());
  const sessionEffectMountedRef = useRef(false);
  const correlationIdRef = useRef(crypto.randomUUID());
  const sessionIdRef = useRef(createSessionId(crypto.randomUUID()));
  const runtimeClockRef = useRef({ now: () => new Date() });
  const runtimeIdsRef = useRef({
    eventId: () => createEventId(crypto.randomUUID()),
    sessionId: () => createSessionId(crypto.randomUUID()),
  });
  const profileId = currentProfile ? createProfileId(currentProfile.id) : undefined;
  const canonicalGameId = routeGameId ? resolveCanonicalGameId(routeGameId) : undefined;
  const registryEntry = routeGameId ? getGameRegistryEntry(routeGameId) : undefined;
  const contentVersion =
    registryEntry && isLoadableGameEntry(registryEntry)
      ? registryEntry.manifest.contentVersion
      : undefined;
  const backPath = theme ? `/games/${theme}` : "/home";

  const closeSession = useCallback(
    (status: "abandoned" | "completed" | "crashed") => {
      if (closedRef.current) return;
      closedRef.current = true;
      void sessionStartPromiseRef.current
        .then(() =>
          repositories.sessions.finish(sessionIdRef.current, status, new Date().toISOString()),
        )
        .catch(reportStorageWriteFailure);
    },
    [repositories.sessions],
  );

  useEffect(() => {
    if (routeGameId && canonicalGameId && canonicalGameId !== routeGameId && theme) {
      void navigate(`/games/${theme}/${canonicalGameId}`, { replace: true });
    }
  }, [canonicalGameId, navigate, routeGameId, theme]);

  useEffect(() => {
    if (!profileId || !registryEntry || !isLoadableGameEntry(registryEntry) || !canonicalGameId) {
      return;
    }
    const releaseActiveGameSession = acquireActiveGameSession();
    sessionEffectMountedRef.current = true;
    if (!sessionStartedRef.current) {
      sessionStartedRef.current = true;
      sessionStartPromiseRef.current = repositories.sessions.start(
        gameSessionRecordSchema.parse({
          contentVersion: registryEntry.manifest.contentVersion,
          contractVersion: 1,
          gameId: canonicalGameId,
          id: sessionIdRef.current,
          profileId,
          startedAt: new Date().toISOString(),
          status: "started",
        }),
      );
      void sessionStartPromiseRef.current.catch(reportStorageWriteFailure);
    }
    return () => {
      releaseActiveGameSession();
      sessionEffectMountedRef.current = false;
      queueMicrotask(() => {
        if (!sessionEffectMountedRef.current) closeSession("abandoned");
      });
    };
  }, [canonicalGameId, closeSession, profileId, registryEntry, repositories.sessions]);

  useEffect(() => {
    if (!registryEntry || !isLoadableGameEntry(registryEntry) || !profileId) return;
    let active = true;
    setLoadState({ status: "loading" });
    Promise.all([loadGameModule(registryEntry), repositories.settings.listForProfile(profileId)])
      .then(([module, settings]) => {
        if (active) setLoadState({ module, settings, status: "ready" });
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadState({
            error: error instanceof Error ? error : new Error("Gamechunk kon niet laden."),
            status: "error",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [loadAttempt, profileId, registryEntry, repositories.settings]);

  useEffect(() => {
    const handlePreloadError = (event: Event) => {
      event.preventDefault();
      setLoadState({
        error: new Error("Er is een nieuwe appversie beschikbaar."),
        status: "error",
      });
    };
    window.addEventListener("vite:preloadError", handlePreloadError);
    return () => window.removeEventListener("vite:preloadError", handlePreloadError);
  }, []);

  const runtime = useMemo<GameRuntime | null>(() => {
    if (!profileId || !canonicalGameId || !contentVersion || loadState.status !== "ready")
      return null;
    const identity = {
      gameId: canonicalGameId,
      profileId,
      sessionId: sessionIdRef.current,
    };
    const storage = createRepositoryRuntimeStorage({
      initialRecords: loadState.settings,
      profileId,
      settings: repositories.settings,
    });
    const practice = createRepositoryPracticeWriter({
      clock: runtimeClockRef.current,
      contentVersion,
      identity,
      ids: runtimeIdsRef.current,
      practice: repositories.practice,
    });
    return createBrowserGameRuntime({
      clock: runtimeClockRef.current,
      gameId: canonicalGameId,
      ids: runtimeIdsRef.current,
      onComplete: () => {
        closeSession("completed");
        void navigate(backPath);
      },
      onExit: () => {
        closeSession("abandoned");
        void navigate(backPath);
      },
      practice,
      profileId,
      sessionId: sessionIdRef.current,
      storage,
    });
  }, [
    backPath,
    canonicalGameId,
    closeSession,
    contentVersion,
    loadState,
    navigate,
    profileId,
    repositories.practice,
    repositories.settings,
  ]);

  if (!currentProfile) {
    return (
      <GameHostStatusScreen
        description="Kies eerst een speler om een game te starten."
        onBack={() => navigate("/profiles")}
        title="Geen speler gekozen"
      />
    );
  }

  if (!registryEntry || !canonicalGameId) {
    return (
      <GameHostStatusScreen
        correlationId={correlationIdRef.current}
        description="Deze game bestaat niet of is niet meer beschikbaar."
        onBack={() => navigate(backPath)}
        title="Game niet gevonden"
      />
    );
  }

  if (!isLoadableGameEntry(registryEntry)) {
    return (
      <ComingSoonGameScreen
        game={{
          description: registryEntry.manifest.description,
          difficulty: "easy",
          icon: registryEntry.manifest.icon,
          id: registryEntry.manifest.id,
          name: registryEntry.manifest.title,
          releaseStatus: "coming-soon",
          themeId: registryEntry.manifest.themeId,
        }}
        onBack={() => navigate(backPath)}
      />
    );
  }

  const missingCapabilities = getMissingRequiredCapabilities(
    registryEntry.manifest,
    availableCapabilities(),
  );
  if (missingCapabilities.length > 0) {
    return (
      <GameHostStatusScreen
        description={`Dit apparaat mist: ${missingCapabilities.join(", ")}. Kies een ander apparaat of ga veilig terug.`}
        onBack={() => navigate(backPath)}
        title="Deze game kan hier niet starten"
      />
    );
  }

  if (loadState.status === "loading" || !runtime) {
    return (
      <GameHostStatusScreen
        description="We zetten het avontuur voor je klaar."
        onBack={() => navigate(backPath)}
        title="Game laden…"
      />
    );
  }

  if (loadState.status === "error") {
    return (
      <GameHostStatusScreen
        correlationId={correlationIdRef.current}
        description={loadState.error.message}
        onBack={() => navigate(backPath)}
        onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
        onUpdate={() => window.location.reload()}
        title="Laden is niet gelukt"
      />
    );
  }

  const { Game } = loadState.module;

  return (
    <GameRuntimeBoundary
      correlationId={correlationIdRef.current}
      onBack={() => {
        closeSession("crashed");
        navigate(backPath);
      }}
      onCrash={() => {
        runtime.diagnostics.log({
          correlationId: correlationIdRef.current,
          event: "game-runtime-crash",
          severity: "error",
          subsystem: "game-host",
          timestamp: runtime.clock.now().toISOString(),
        });
        closeSession("crashed");
      }}
      onRetry={() => window.location.reload()}
    >
      <Game runtime={runtime} />
    </GameRuntimeBoundary>
  );
};

GameHost.displayName = "GameHost";
