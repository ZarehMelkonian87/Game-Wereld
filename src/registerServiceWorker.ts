/// <reference types="vite/client" />
import { registerPwaWorker } from "./app/pwa/pwaLifecycle";
import { appDiagnostics } from "./app/diagnostics";

const shouldRegisterServiceWorker = () =>
  import.meta.env.PROD && "serviceWorker" in navigator && window.isSecureContext;

export const registerServiceWorker = async () => {
  if (!shouldRegisterServiceWorker()) {
    if ("serviceWorker" in navigator && !import.meta.env.PROD) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister())),
        )
        .catch((error: unknown) => {
          appDiagnostics.record({
            context: {
              errorCode: error instanceof Error ? error.name : "unknown",
              operation: "unregister-development-workers",
              recovery: "continue-without-cleanup",
            },
            event: "service-worker-cleanup-failed",
            severity: "warn",
            subsystem: "service-worker",
          });
        });
    }
    return undefined;
  }

  try {
    const { registerSW } = await import("virtual:pwa-register");
    return registerPwaWorker(registerSW);
  } catch (error) {
    appDiagnostics.record({
      context: {
        errorCode: error instanceof Error ? error.name : "unknown",
        operation: "load-registration-adapter",
        recovery: "retry-on-next-load",
      },
      event: "service-worker-adapter-failed",
      severity: "error",
      subsystem: "service-worker",
    });
    return undefined;
  }
};
