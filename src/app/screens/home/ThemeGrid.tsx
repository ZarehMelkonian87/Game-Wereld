import { Zap } from "lucide-react";
import type { Profile } from "../../game-platform";
import { gameThemes } from "../../data/games";
import { ThemeCard } from "./ThemeCard";

interface ThemeGridProps {
  onSelectTheme: (themeId: string) => void;
  profile: Profile;
}

export const ThemeGrid = ({ onSelectTheme, profile }: ThemeGridProps) => (
  <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5" data-component="ThemeGrid">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2">
        <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-400 flex-shrink-0" />
        <h3 className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-black text-center">
          GAME ZONES
        </h3>
        <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-400 flex-shrink-0" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 pb-6">
        {gameThemes.map((theme, index) => (
          <ThemeCard
            index={index}
            key={theme.id}
            onSelect={onSelectTheme}
            profile={profile}
            theme={theme}
          />
        ))}
      </div>
    </div>
  </div>
);

ThemeGrid.displayName = "ThemeGrid";
