import { useParams } from "react-router";
import { GameHost } from "../../game-host";

export const GamePlayScreen = () => {
  const { gameId = "unknown-game" } = useParams();
  return <GameHost key={gameId} />;
};

GamePlayScreen.displayName = "GamePlayScreen";
