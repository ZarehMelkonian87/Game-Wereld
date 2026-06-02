import type { GameTheme } from "../../data/games";
import { BackButton } from "../shared";

interface GamesListHeaderProps {
  onBack: () => void;
  theme: GameTheme;
}

export const GamesListHeader = ({ onBack, theme }: GamesListHeaderProps) => (
  <div
    className={`bg-gradient-to-br ${theme.color} px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 shadow-2xl border-b-4 border-white/20`}
    data-component="GamesListHeader"
  >
    <div className="max-w-4xl mx-auto">
      <div className="mb-3 sm:mb-4">
        <BackButton label="Terug naar home" onClick={onBack} variant="light" />
      </div>

      <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
        <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-2xl flex-shrink-0">
          {theme.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-black mb-1 drop-shadow-lg">
            {theme.name}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-semibold">
            {theme.description}
          </p>
        </div>
      </div>
    </div>
  </div>
);

GamesListHeader.displayName = "GamesListHeader";
