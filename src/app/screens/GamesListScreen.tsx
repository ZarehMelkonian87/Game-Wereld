import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useProfile } from "../contexts/ProfileContext";
import { gameThemes, miniGames } from "../data/games";
import { ArrowLeft, Star, Lock, Flame, Zap } from "lucide-react";
import { useEffect } from "react";

export function GamesListScreen() {
  const navigate = useNavigate();
  const { theme: themeId } = useParams();
  const { currentProfile } = useProfile();

  const theme = gameThemes.find((t) => t.id === themeId);
  const games = miniGames.filter((g) => g.themeId === themeId);

  useEffect(() => {
    if (!theme) {
      navigate("/home");
    }
  }, [theme, navigate]);

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-cyan-300">Zone niet gevonden</p>
      </div>
    );
  }

  const getGameProgress = (gameId: string) => {
    return currentProfile?.progress.find((p) => p.gameId === gameId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "from-green-500 to-emerald-600";
      case "medium":
        return "from-yellow-500 to-orange-600";
      case "hard":
        return "from-red-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "EASY";
      case "medium":
        return "MEDIUM";
      case "hard":
        return "HARD";
      default:
        return difficulty;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <Zap className="w-3 h-3" />;
      case "medium":
        return <Flame className="w-3 h-3" />;
      case "hard":
        return <Flame className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col safe-area-inset">
      {/* Header */}
      <div className={`bg-gradient-to-br ${theme.color} px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 shadow-2xl border-b-4 border-white/20`}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/home")}
            className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-black/20 rounded-lg sm:rounded-xl active:bg-black/30 border-2 border-white/20"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

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

      {/* Games List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-6">
            {games.map((game, index) => {
              const progress = getGameProgress(game.id);
              const isLocked = false;

              return (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!isLocked) {
                      if (game.id === "woordenschat-bezem-escape") {
                        navigate(`/games/${theme.id}/${game.id}`);
                        return;
                      }

                      alert(`${game.name} - Komt binnenkort beschikbaar!`);
                    }
                  }}
                  className={`game-card-3d bg-gradient-to-br from-slate-700 to-slate-800 border-3 sm:border-4 border-slate-600 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl min-h-[140px] sm:min-h-[150px] flex items-center gap-3 sm:gap-4 relative overflow-hidden ${
                    isLocked ? "opacity-50" : ""
                  }`}
                  disabled={isLocked}
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
                      {isLocked && <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs sm:text-sm text-cyan-300 mb-2 sm:mb-3 font-semibold line-clamp-2">
                      {game.description}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`bg-gradient-to-r ${getDifficultyColor(game.difficulty)} text-white text-xs px-2 sm:px-3 py-1 rounded-full font-black flex items-center gap-1`}>
                        {getDifficultyIcon(game.difficulty)}
                        {getDifficultyText(game.difficulty)}
                      </span>

                      {progress && progress.stars > 0 && (
                        <div className="flex items-center gap-1">
                          {[...Array(3)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                i < progress.stars ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {games.length === 0 && (
            <div className="text-center py-12 px-4">
              <p className="text-lg sm:text-xl md:text-2xl text-cyan-300 font-bold">
                Nieuwe games komen eraan! 🎮
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
