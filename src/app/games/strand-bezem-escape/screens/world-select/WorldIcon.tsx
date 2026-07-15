import { worldIconUrls } from "../../asset-urls";
import type { WorldIconId } from "../../types";
import type { DevtoolsComponent } from "./devtools";

interface WorldIconProps {
  icon: WorldIconId;
}

export const WorldIcon: DevtoolsComponent<WorldIconProps> = ({ icon }) => (
  <span
    className="grid h-[3.55rem] w-[3.55rem] shrink-0 place-items-center"
    data-component="WorldIcon"
    data-icon-id={icon}
  >
    <img
      alt=""
      className="h-full w-full object-contain drop-shadow-[0_3px_0_rgba(21,48,74,0.13)]"
      draggable={false}
      src={worldIconUrls[icon]}
    />
  </span>
);

WorldIcon.displayName = "WorldIcon";
