import { motion } from "motion/react";
import type { GameTheme } from "../../data/games";
import { miniGames } from "../../data/games";
import type { Profile } from "../../game-platform";

interface ThemeCardProps {
  index: number;
  onSelect: (themeId: string) => void;
  theme: GameTheme;
  profile: Profile;
}

export const ThemeCard = ({ index, onSelect, theme, profile }: ThemeCardProps) => {
  const themeGames = miniGames.filter((game) => game.themeId === theme.id);
  const totalGames = themeGames.length;
  const completedGames = themeGames.filter((game) => {
    const prog = profile.progress.find((p) => p.gameId === game.id);
    return prog?.completed;
  }).length;

  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      className={`game-card-3d bg-gradient-to-br ${theme.color} p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border-3 sm:border-4 border-white/20 min-h-[160px] sm:min-h-[180px] md:min-h-[200px] flex flex-col items-center justify-center text-white relative overflow-hidden`}
      data-component="ThemeCard"
      initial={{ opacity: 0, y: 20 }}
      onClick={() => onSelect(theme.id)}
      transition={{ delay: index * 0.05 }}
      type="button"
      whileHover={{ scale: 1.03, rotate: 1 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-2xl" />
      <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3 drop-shadow-2xl relative z-10">
        {theme.icon}
      </div>
      <div className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2 font-black drop-shadow-lg relative z-10 text-center leading-tight px-1">
        {theme.name}
      </div>
      <div className="text-xs sm:text-sm opacity-90 text-center px-1 sm:px-2 font-semibold relative z-10 leading-tight">
        {theme.description}
      </div>
      {totalGames > 0 ? (
        <div className="mt-3 bg-black/30 px-3 py-1 rounded-full text-xs font-black text-cyan-200 border border-white/10 flex items-center gap-1 relative z-10">
          <span>🎮</span> {completedGames}/{totalGames}
        </div>
      ) : null}
    </motion.button>
  );
};

ThemeCard.displayName = "ThemeCard";
