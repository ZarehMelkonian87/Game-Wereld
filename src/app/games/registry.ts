import type { GameRegistry } from "../game-platform";
import { woordenschatBezemEscapeConfig } from "./woordenschat-bezem-escape/game.config";
import { WoordenschatBezemEscapeGame } from "./woordenschat-bezem-escape";
import { strandBezemEscapeConfig } from "./strand-bezem-escape/game.config";
import { StrandBezemEscapeGame } from "./strand-bezem-escape";

export const gameRegistry: GameRegistry = {
  [woordenschatBezemEscapeConfig.id]: {
    Component: WoordenschatBezemEscapeGame,
    config: woordenschatBezemEscapeConfig,
  },
  [strandBezemEscapeConfig.id]: {
    Component: StrandBezemEscapeGame,
    config: strandBezemEscapeConfig,
  },
  "taal-bezem-escape": {
    Component: WoordenschatBezemEscapeGame,
    config: { ...woordenschatBezemEscapeConfig, id: "taal-bezem-escape", title: "Taal Bezem Escape" },
  },
  "taal-strand-bezem-escape": {
    Component: StrandBezemEscapeGame,
    config: { ...strandBezemEscapeConfig, id: "taal-strand-bezem-escape", title: "Taal Strand-Avontuur" },
  },
  "rekenen-bezem-escape": {
    Component: WoordenschatBezemEscapeGame,
    config: { ...woordenschatBezemEscapeConfig, id: "rekenen-bezem-escape", title: "Rekenen Bezem Escape" },
  },
  "rekenen-strand-bezem-escape": {
    Component: StrandBezemEscapeGame,
    config: { ...strandBezemEscapeConfig, id: "rekenen-strand-bezem-escape", title: "Rekenen Strand-Avontuur" },
  },
  "wereld-bezem-escape": {
    Component: WoordenschatBezemEscapeGame,
    config: { ...woordenschatBezemEscapeConfig, id: "wereld-bezem-escape", title: "Wereld Bezem Escape" },
  },
  "wereld-strand-bezem-escape": {
    Component: StrandBezemEscapeGame,
    config: { ...strandBezemEscapeConfig, id: "wereld-strand-bezem-escape", title: "Wereld Strand-Avontuur" },
  },
};

export const getGameRegistryEntry = (gameId?: string) => {
  if (!gameId) {
    return undefined;
  }

  return gameRegistry[gameId];
};
