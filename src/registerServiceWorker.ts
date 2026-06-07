const shouldRegisterServiceWorker = () =>
  "serviceWorker" in navigator &&
  window.isSecureContext &&
  !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

export const registerServiceWorker = () => {
  if (!shouldRegisterServiceWorker()) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Installatie blijft optioneel; de app moet ook zonder service worker werken.
    });
  });
};
