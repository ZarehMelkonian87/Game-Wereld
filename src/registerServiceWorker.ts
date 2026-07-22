/// <reference types="vite/client" />

const shouldRegisterServiceWorker = () =>
  import.meta.env.PROD &&
  "serviceWorker" in navigator &&
  window.isSecureContext &&
  !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

export const registerServiceWorker = () => {
  if (!shouldRegisterServiceWorker()) {
    if ("serviceWorker" in navigator && !import.meta.env.PROD) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Installatie blijft optioneel; de app moet ook zonder service worker werken.
    });
  });
};
