import { useNavigate, useParams } from "react-router";
import { miniGames } from "../../data/games";
import { WoordenschatBezemEscapeGame } from "../../games";
import { ComingSoonGameScreen } from "./ComingSoonGameScreen";

export const GamePlayScreen = () => {
  const navigate = useNavigate();
  const { theme, gameId } = useParams();
  const game = miniGames.find((candidate) => candidate.id === gameId);

  if (gameId === "woordenschat-bezem-escape") {
    return <WoordenschatBezemEscapeGame />;
  }

  return (
    <ComingSoonGameScreen
      game={game}
      onBack={() => navigate(theme ? `/games/${theme}` : "/home")}
    />
  );
};

GamePlayScreen.displayName = "GamePlayScreen";
