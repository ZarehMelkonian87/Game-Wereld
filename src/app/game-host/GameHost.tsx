import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useProfile } from "../contexts/ProfileContext";
import {
  createBrowserGameRuntime,
  createProfileId,
  createSessionId,
  isLoadableGameEntry,
  type GameCapability,
  type GameModule,
  type GameRuntime,
} from "../game-platform";
import { getGameRegistryEntry, resolveCanonicalGameId } from "../games";
import { ComingSoonGameScreen } from "../screens/game-play/ComingSoonGameScreen";
import { GameHostStatusScreen } from "./GameHostStatusScreen";
import { GameRuntimeBoundary } from "./GameRuntimeBoundary";
import { getMissingRequiredCapabilities, loadGameModule } from "./gameHostContracts";
import { gameSessionRepository } from "./sessionRepository";

type LoadState =
  | { status: "loading" }
  | { error: Error; status: "error" }
  | { module: GameModule; status: "ready" };

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
  const { currentProfile, updateProgress } = useProfile();
  const { gameId: routeGameId, theme } = useParams();
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const closedRef = useRef(false);
  const sessionStartedRef = useRef(false);
  const correlationIdRef = useRef(crypto.randomUUID());
  const sessionIdRef = useRef(createSessionId(crypto.randomUUID()));
  const profileId = currentProfile ? createProfileId(currentProfile.id) : undefined;
  const canonicalGameId = routeGameId ? resolveCanonicalGameId(routeGameId) : undefined;
  const registryEntry = routeGameId ? getGameRegistryEntry(routeGameId) : undefined;
  const backPath = theme ? `/games/${theme}` : "/home";

  const closeSession = useCallback((status: "abandoned" | "completed" | "crashed") => {
    if (closedRef.current) return;
    closedRef.current = true;
    gameSessionRepository.finish(sessionIdRef.current, status, new Date().toISOString());
  }, []);

  useEffect(() => {
    if (routeGameId && canonicalGameId && canonicalGameId !== routeGameId && theme) {
      void navigate(`/games/${theme}/${canonicalGameId}`, { replace: true });
    }
  }, [canonicalGameId, navigate, routeGameId, theme]);

  useEffect(() => {
    if (
      !profileId ||
      !registryEntry ||
      !isLoadableGameEntry(registryEntry) ||
      !canonicalGameId ||
      sessionStartedRef.current
    ) {
      return;
    }
    sessionStartedRef.current = true;
    gameSessionRepository.start({
      gameId: canonicalGameId,
      profileId,
      sessionId: sessionIdRef.current,
      startedAt: new Date().toISOString(),
      status: "started",
    });
    return () => closeSession("abandoned");
  }, [canonicalGameId, closeSession, profileId, registryEntry]);

  useEffect(() => {
    if (!registryEntry || !isLoadableGameEntry(registryEntry)) return;
    let active = true;
    setLoadState({ status: "loading" });
    loadGameModule(registryEntry)
      .then((module) => {
        if (active) setLoadState({ module, status: "ready" });
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
  }, [loadAttempt, registryEntry]);

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
    if (!profileId || !canonicalGameId) return null;
    return createBrowserGameRuntime({
      gameId: canonicalGameId,
      onComplete: (summary) => {
        closeSession("completed");
        updateProgress(canonicalGameId, {
          completed: true,
          lastPlayed: new Date().toISOString(),
          score: summary.score,
          stars: summary.stars,
        });
        void navigate(backPath);
      },
      onExit: () => {
        closeSession("abandoned");
        void navigate(backPath);
      },
      onUpdateProgress: (progress) => updateProgress(canonicalGameId, progress),
      profileId,
      sessionId: sessionIdRef.current,
    });
  }, [backPath, canonicalGameId, closeSession, navigate, profileId, updateProgress]);

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
