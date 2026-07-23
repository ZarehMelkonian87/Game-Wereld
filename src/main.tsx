import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { registerServiceWorker } from "./registerServiceWorker";
import "./styles/index.css";

interface ReactDevToolsWindow extends Window {
  __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown;
}

const attachParentReactDevToolsHook = () => {
  if (typeof window === "undefined" || !window.parent || window.parent === window) {
    return;
  }

  try {
    const parentWindow = window.parent as ReactDevToolsWindow;
    const currentWindow = window as ReactDevToolsWindow;

    if (parentWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      currentWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__ = parentWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    }
  } catch (error: unknown) {
    if (import.meta.env.DEV) {
      console.debug("React DevTools-hook uit parent frame is niet beschikbaar.", error);
    }
  }
};

attachParentReactDevToolsHook();

registerServiceWorker();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("App-root #root ontbreekt in index.html.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
