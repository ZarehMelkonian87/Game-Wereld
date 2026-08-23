import type { DevtoolsComponent } from "./devtools";

export const WorldSelectBackground: DevtoolsComponent = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.72),transparent_38%),radial-gradient(circle_at_12%_78%,rgba(255,210,88,0.28),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,240,178,0.26))]"
    data-component="WorldSelectBackground"
  />
);

WorldSelectBackground.displayName = "WorldSelectBackground";
