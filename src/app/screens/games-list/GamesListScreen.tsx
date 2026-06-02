import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useProfile } from "../../contexts/ProfileContext";
import { gameThemes, miniGames, type MiniGame } from "../../data/games";
import { EmptyGamesMessage } from "./EmptyGamesMessage";
import { GamesGrid } from "./GamesGrid";
import { GamesListHeader } from "./GamesListHeader";

export const GamesListScreen = () => {
  const navigate = useNavigate();
  const { theme: themeId } = useParams();
  const { currentProfile } = useProfile();
  const theme = gameThemes.find((candidate) => candidate.id === themeId);
  const games = miniGames.filter((game) => game.themeId === themeId);

  useEffect(() => {
    if (!theme) {
      navigate("/home");
    }
  }, [theme, navigate]);

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-component="GamesListScreen">
        <p className="text-2xl text-cyan-300">Zone niet gevonden</p>
      </div>
    );
  }

  const getGameProgress = (gameId: string) =>
    currentProfile?.progress.find((progress) => progress.gameId === gameId);

  const handleSelectGame = (game: MiniGame) => {
    if (game.id === "woordenschat-bezem-escape") {
      navigate(`/games/${theme.id}/${game.id}`);
      return;
    }

    alert(`${game.name} - Komt binnenkort beschikbaar!`);
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
    </div>
  );
};

GamesListScreen.displayName = "GamesListScreen";
