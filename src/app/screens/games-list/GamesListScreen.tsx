import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useProfile } from "../../contexts/ProfileContext";
import { gameThemes, miniGames, type MiniGame } from "../../data/games";
import { getGameRegistryEntry } from "../../games";
import { EmptyGamesMessage } from "./EmptyGamesMessage";
import { GamesGrid } from "./GamesGrid";
import { GamesListHeader } from "./GamesListHeader";

export const GamesListScreen = () => {
  const navigate = useNavigate();
  const { theme: themeId } = useParams();
  const { currentProfile } = useProfile();
  const [comingSoonGame, setComingSoonGame] = useState<MiniGame | null>(null);

  const theme = gameThemes.find((candidate) => candidate.id === themeId);
  const games = miniGames.filter((game) => game.themeId === themeId);

  useEffect(() => {
    if (!theme) {
      navigate("/home");
    }
  }, [theme, navigate]);

  if (!theme) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-component="GamesListScreen"
      >
        <p className="text-2xl text-cyan-300">Zone niet gevonden</p>
      </div>
    );
  }

  const getGameProgress = (gameId: string) =>
    currentProfile?.progress.find((progress) => progress.gameId === gameId);

  const handleSelectGame = (game: MiniGame) => {
    if (getGameRegistryEntry(game.id)) {
      navigate(`/games/${theme.id}/${game.id}`);
      return;
    }

    setComingSoonGame(game);
  };

  return (
    <div className="min-h-screen flex flex-col safe-area-inset" data-component="GamesListScreen">
      <GamesListHeader onBack={() => navigate("/home")} theme={theme} />
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <GamesGrid
            games={games}
            getGameProgress={getGameProgress}
            onSelectGame={handleSelectGame}
            theme={theme}
          />
          {games.length === 0 ? <EmptyGamesMessage /> : null}
        </div>
      </div>

      {comingSoonGame ? (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-cyan-400 p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl relative"
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="text-6xl sm:text-7xl mb-4 drop-shadow-lg">{comingSoonGame.icon}</div>
            <h3 className="text-2xl sm:text-3xl text-white font-black mb-2">
              {comingSoonGame.name}
            </h3>
            <p className="text-cyan-300 font-bold text-sm sm:text-base mb-6 leading-relaxed">
              Deze game is momenteel nog in aanbouw. Kom snel terug om dit avontuur te spelen! 🛠️🎮
            </p>
            <motion.button
              className="game-button bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-8 py-3.5 rounded-xl text-lg font-black border-3 border-cyan-300/50 w-full cursor-pointer"
              onClick={() => setComingSoonGame(null)}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              OKÉ, COOL!
            </motion.button>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
};

GamesListScreen.displayName = "GamesListScreen";
