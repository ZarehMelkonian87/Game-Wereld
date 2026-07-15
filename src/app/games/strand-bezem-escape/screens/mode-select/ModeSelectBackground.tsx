import type { DevtoolsComponent } from "./devtools";

export const ModeSelectBackground: DevtoolsComponent = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_9%,rgba(255,255,255,0.72),transparent_35%),radial-gradient(circle_at_15%_82%,rgba(255,211,96,0.26),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,242,190,0.24))]"
    data-component="ModeSelectBackground"
  />
);

ModeSelectBackground.displayName = "ModeSelectBackground";
