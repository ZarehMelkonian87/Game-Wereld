import { motion } from "motion/react";
import { Lock, Star } from "lucide-react";
import type { GameProgress } from "../../game-platform";
import type { GameTheme, MiniGame } from "../../data/games";
import {
  getDifficultyColor,
  getDifficultyIcon,
  getDifficultyText,
} from "./gameDifficulty";

interface GameListCardProps {
  game: MiniGame;
  index: number;
  isLocked?: boolean;
  onSelect: (game: MiniGame) => void;
  progress?: GameProgress;
  theme: GameTheme;
}

export const GameListCard = ({
  game,
  index,
  isLocked = false,
  onSelect,
  progress,
  theme,
}: GameListCardProps) => (
  <motion.button
    animate={{ opacity: 1, x: 0 }}
    className={`game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 border-3 sm:border-4 border-slate-600 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl min-h-[140px] sm:min-h-[150px] flex items-center gap-3 sm:gap-4 relative overflow-hidden ${
      isLocked ? "opacity-50" : ""
    }`}
    data-component="GameListCard"
    disabled={isLocked}
    initial={{ opacity: 0, x: -20 }}
    onClick={() => {
      if (!isLocked) {
        onSelect(game);
      }
    }}
    transition={{ delay: index * 0.05 }}
    type="button"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-400/10 rounded-full blur-3xl" />

    <div className="text-4xl sm:text-5xl md:text-6xl flex-shrink-0 drop-shadow-lg relative z-10">
      {game.icon}
    </div>

    <div className="flex-1 text-left relative z-10 min-w-0">
      <div className="flex items-center gap-2 mb-1 sm:mb-2">
        <h3 className="text-base sm:text-lg md:text-xl text-white font-black truncate">
          {game.name}
        </h3>
        {isLocked ? <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" /> : null}
      </div>
      <p className="text-xs sm:text-sm text-cyan-300 mb-2 sm:mb-3 font-semibold line-clamp-2">
        {game.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`bg-gradient-to-r ${getDifficultyColor(
            game.difficulty,
          )} text-white text-xs px-2 sm:px-3 py-1 rounded-full font-black flex items-center gap-1`}
        >
          {getDifficultyIcon(game.difficulty)}
          {getDifficultyText(game.difficulty)}
        </span>

        {progress && progress.stars > 0 ? (
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, starIndex) => (
              <Star
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  starIndex < progress.stars
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-600"
                }`}
                key={`${theme.id}-${game.id}-${starIndex}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  </motion.button>
);

GameListCard.displayName = "GameListCard";
