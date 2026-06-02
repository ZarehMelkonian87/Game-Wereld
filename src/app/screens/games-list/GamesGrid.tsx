import type { GameProgress } from "../../contexts/ProfileContext";
import type { GameTheme, MiniGame } from "../../data/games";
import { GameListCard } from "./GameListCard";

interface GamesGridProps {
  games: MiniGame[];
  getGameProgress: (gameId: string) => GameProgress | undefined;
  onSelectGame: (game: MiniGame) => void;
  theme: GameTheme;
}

export const GamesGrid = ({ games, getGameProgress, onSelectGame, theme }: GamesGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-6" data-component="GamesGrid">
    {games.map((game, index) => (
      <GameListCard
        game={game}
        index={index}
        isLocked={false}
        key={game.id}
        onSelect={onSelectGame}
        progress={getGameProgress(game.id)}
        theme={theme}
      />
    ))}
  </div>
);

GamesGrid.displayName = "GamesGrid";
