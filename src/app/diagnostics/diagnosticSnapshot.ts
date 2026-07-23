import { DATABASE_NAME, DATABASE_VERSION } from "../storage";
import { getGameRegistryEntry } from "../games";
import { isLoadableGameEntry } from "../game-platform";
import { getPwaLifecycleSnapshot } from "../pwa/pwaLifecycle";
import { APP_RELEASE, appDiagnostics } from "./appDiagnostics";

export interface DiagnosticSnapshot {
  build: string;
  caches: string[];
  capabilities: {
    cacheStorage: boolean;
    indexedDb: boolean;
    online: boolean;
    serviceWorker: boolean;
    speechRecognition: boolean;
  };
  database: { name: string; version: number };
  game?: { contentVersion: string; id: string };
  offlinePackages: string[];
  quota: { quotaBytes?: number; usageBytes?: number };
  release: string;
  route: string;
  serviceWorker: string;
  session: string;
}

const SESSION_KEY = "game-wereld:diagnostic-session";
const fallbackSession = crypto.randomUUID();

const getAnonymousSession = () => {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    appDiagnostics.record({
      context: {
        operation: "create-anonymous-diagnostic-session",
        recovery: "use-memory-session",
      },
      event: "diagnostic-session-storage-unavailable",
      severity: "warn",
      subsystem: "diagnostics",
    });
    return fallbackSession;
  }
};

export const collectDiagnosticSnapshot = async (): Promise<DiagnosticSnapshot> => {
  const cacheNames =
    "caches" in window
      ? await caches.keys().catch((error: unknown) => {
          appDiagnostics.record({
            context: {
              errorCode: error instanceof Error ? error.name : "unknown",
              operation: "inspect-cache-storage",
              recovery: "show-empty-cache-list",
            },
            event: "cache-inspection-failed",
            severity: "warn",
            subsystem: "offline-package",
          });
          return [];
        })
      : [];
  const safeCacheNames = cacheNames.filter((name) => name.startsWith("game-wereld-"));
  const estimate = navigator.storage?.estimate
    ? await navigator.storage.estimate().catch((): StorageEstimate => ({}))
    : {};
  const speechRecognition = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  const gameId = window.location.pathname.split("/")[3];
  const gameEntry = gameId ? getGameRegistryEntry(gameId) : undefined;

  return {
    build: import.meta.env.MODE,
    caches: safeCacheNames,
    capabilities: {
      cacheStorage: "caches" in window,
      indexedDb: "indexedDB" in window,
      online: navigator.onLine,
      serviceWorker: "serviceWorker" in navigator,
      speechRecognition,
    },
    database: { name: DATABASE_NAME, version: DATABASE_VERSION },
    game:
      gameEntry && isLoadableGameEntry(gameEntry)
        ? { contentVersion: gameEntry.manifest.contentVersion, id: gameEntry.manifest.id }
        : undefined,
    offlinePackages: safeCacheNames.filter((name) => name.startsWith("game-wereld-offline-")),
    quota: { quotaBytes: estimate.quota, usageBytes: estimate.usage },
    release: APP_RELEASE,
    route: window.location.pathname,
    serviceWorker: getPwaLifecycleSnapshot().status,
    session: getAnonymousSession(),
  };
};
