import type { GameRegistry } from "../game-platform";
import { woordenschatBezemEscapeConfig } from "./woordenschat-bezem-escape/game.config";
import { WoordenschatBezemEscapeGame } from "./woordenschat-bezem-escape";

export const gameRegistry: GameRegistry = {
  [woordenschatBezemEscapeConfig.id]: {
    Component: WoordenschatBezemEscapeGame,
    config: woordenschatBezemEscapeConfig,
  },
};

export const getGameRegistryEntry = (gameId?: string) => {
  if (!gameId) {
    return undefined;
  }

  return gameRegistry[gameId];
};
