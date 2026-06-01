import { BookOpen, Orbit, PawPrint, School, Waves } from "lucide-react";
import type { ReactNode } from "react";
import type { WorldIconId } from "../../types";
import type { DevtoolsComponent } from "./devtools";

interface WorldIconProps {
  icon: WorldIconId;
}

const iconById: Record<WorldIconId, ReactNode> = {
  barn: <School className="h-7 w-7" strokeWidth={3} />,
  book: <BookOpen className="h-7 w-7" strokeWidth={3} />,
  paw: <PawPrint className="h-7 w-7" strokeWidth={3} />,
  planet: <Orbit className="h-7 w-7" strokeWidth={3} />,
  slide: (
    <svg className="h-7 w-7" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 20 16 6M13 6h5v14M5 20h14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  ),
  waves: <Waves className="h-7 w-7" strokeWidth={3} />,
};

export const WorldIcon: DevtoolsComponent<WorldIconProps> = ({ icon }) => (
  <span
    className="grid h-12 w-12 shrink-0 place-items-center rounded-[1.1rem] border-[3px] border-white bg-white/90 text-slate-700 shadow-[0_4px_0_rgba(21,48,74,0.12)]"
    data-component="WorldIcon"
    data-icon-id={icon}
  >
    {iconById[icon]}
  </span>
);

WorldIcon.displayName = "WorldIcon";
