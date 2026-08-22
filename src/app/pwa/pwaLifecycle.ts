export type PwaLifecycleStatus =
  | "unsupported"
  | "registering"
  | "ready"
  | "offline-ready"
  | "update-waiting"
  | "update-postponed"
  | "updating"
  | "error";

export interface PwaLifecycleSnapshot {
  error?: string;
  gameSessionActive: boolean;
  status: PwaLifecycleStatus;
}

type UpdateServiceWorker = (reloadPage?: boolean) => Promise<void>;
interface RegisterWorkerOptions {
  immediate: boolean;
  onNeedRefresh: () => void;
  onOfflineReady: () => void;
  onRegisterError: (error: unknown) => void;
  onRegisteredSW: (scriptUrl: string, registration?: ServiceWorkerRegistration) => void;
}
export type RegisterWorker = (options: RegisterWorkerOptions) => UpdateServiceWorker;

let snapshot: PwaLifecycleSnapshot = {
  gameSessionActive: false,
  status: "registering",
};
let updateServiceWorker: UpdateServiceWorker | undefined;
let registrationPromise: Promise<UpdateServiceWorker> | undefined;
let activeGameSessions = 0;
const listeners = new Set<() => void>();

const publish = (patch: Partial<PwaLifecycleSnapshot>) => {
  snapshot = { ...snapshot, ...patch };
  listeners.forEach((listener) => listener());
};

export const getPwaLifecycleSnapshot = () => snapshot;

export const subscribeToPwaLifecycle = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const acquireActiveGameSession = () => {
  activeGameSessions += 1;
  publish({ gameSessionActive: true });
  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeGameSessions = Math.max(0, activeGameSessions - 1);
    const gameSessionActive = activeGameSessions > 0;
    publish({
      gameSessionActive,
      status:
        !gameSessionActive && snapshot.status === "update-postponed"
          ? "update-waiting"
          : snapshot.status,
    });
  };
};

export const activateWaitingPwaUpdate = async () => {
  if (!updateServiceWorker) return;
  if (snapshot.gameSessionActive) {
    publish({ status: "update-postponed" });
    return;
  }
  publish({ status: "updating" });
  try {
    await updateServiceWorker(true);
  } catch (error) {
    appDiagnostics.record({
      context: {
        errorCode: error instanceof Error ? error.name : "unknown",
        operation: "activate-update",
        recovery: "retry",
      },
      event: "service-worker-update-failed",
      severity: "error",
      subsystem: "service-worker",
    });
    publish({
      error: error instanceof Error ? error.message : "De app-update kon niet worden geactiveerd.",
      status: "error",
    });
  }
};

export const registerPwaWorker = (registerWorker: RegisterWorker) => {
  if (registrationPromise) return registrationPromise;
  if (!("serviceWorker" in navigator)) {
    publish({ status: "unsupported" });
    return Promise.resolve(async () => undefined);
  }

  registrationPromise = new Promise<UpdateServiceWorker>((resolve) => {
    updateServiceWorker = registerWorker({
      immediate: true,
      onNeedRefresh: () => {
        publish({
          status: snapshot.gameSessionActive ? "update-postponed" : "update-waiting",
        });
      },
      onOfflineReady: () => publish({ status: "offline-ready" }),
      onRegisterError: (error) => {
        appDiagnostics.record({
          context: {
            errorCode: error instanceof Error ? error.name : "unknown",
            operation: "register",
            recovery: "retry-on-next-load",
          },
          event: "service-worker-register-failed",
          severity: "error",
          subsystem: "service-worker",
        });
        publish({
          error: error instanceof Error ? error.message : "Service worker registreren is mislukt.",
          status: "error",
        });
      },
      onRegisteredSW: (_scriptUrl, registration) => {
        publish({ status: registration ? "ready" : "error" });
      },
    });
    resolve(updateServiceWorker);
  });
  return registrationPromise;
};

export const resetPwaLifecycleForTests = () => {
  activeGameSessions = 0;
  registrationPromise = undefined;
  updateServiceWorker = undefined;
  snapshot = { gameSessionActive: false, status: "registering" };
  listeners.clear();
};
import { appDiagnostics } from "../diagnostics";
