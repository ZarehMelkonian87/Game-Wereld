import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { registerServiceWorker } from "./registerServiceWorker";
import "./styles/index.css";

try {
  if (typeof window !== "undefined" && window.parent && window.parent !== window && (window.parent as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = (window.parent as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  }
} catch (e) {}

registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
