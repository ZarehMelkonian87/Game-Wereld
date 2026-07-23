/// <reference types="vite/client" />
import { registerPwaWorker } from "./app/pwa/pwaLifecycle";

const shouldRegisterServiceWorker = () =>
  import.meta.env.PROD && "serviceWorker" in navigator && window.isSecureContext;

export const registerServiceWorker = async () => {
  if (!shouldRegisterServiceWorker()) {
    if ("serviceWorker" in navigator && !import.meta.env.PROD) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
    return undefined;
  }

  const { registerSW } = await import("virtual:pwa-register");
  return registerPwaWorker(registerSW);
};
