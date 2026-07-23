import type { GameRegistry } from "../game-platform";
import { strandBezemEscapeConfig } from "./strand-bezem-escape/game.config";
import { StrandBezemEscapeGame } from "./strand-bezem-escape";

export const gameRegistry: GameRegistry = {
  "woordenschat-bezem-escape": {
    Component: StrandBezemEscapeGame,
    config: {
      ...strandBezemEscapeConfig,
      id: "woordenschat-bezem-escape",
      title: "Magisch Strand-Avontuur",
    },
  },
  [strandBezemEscapeConfig.id]: {
    Component: StrandBezemEscapeGame,
    config: strandBezemEscapeConfig,
  },
  "taal-bezem-escape": {
    Component: StrandBezemEscapeGame,
    config: { ...strandBezemEscapeConfig, id: "taal-bezem-escape", title: "Taal Strand-Avontuur" },
  },
  "taal-strand-bezem-escape": {
    Component: StrandBezemEscapeGame,
    config: {
      ...strandBezemEscapeConfig,
      id: "taal-strand-bezem-escape",
      title: "Taal Strand-Avontuur",
    },
  },
  "rekenen-bezem-escape": {
    Component: StrandBezemEscapeGame,
    config: {
      ...strandBezemEscapeConfig,
      id: "rekenen-bezem-escape",
      title: "Rekenen Strand-Avontuur",
    },
  },
  "rekenen-strand-bezem-escape": {
    Component: StrandBezemEscapeGame,
    config: {
      ...strandBezemEscapeConfig,
      id: "rekenen-strand-bezem-escape",
      title: "Rekenen Strand-Avontuur",
    },
  },
  "wereld-bezem-escape": {
    Component: StrandBezemEscapeGame,
    config: {
      ...strandBezemEscapeConfig,
      id: "wereld-bezem-escape",
      title: "Wereld Strand-Avontuur",
    },
  },
  "wereld-strand-bezem-escape": {
    Component: StrandBezemEscapeGame,
    config: {
      ...strandBezemEscapeConfig,
      id: "wereld-strand-bezem-escape",
      title: "Wereld Strand-Avontuur",
    },
  },
};

export const getGameRegistryEntry = (gameId?: string) => {
  if (!gameId) {
    return undefined;
  }

  return gameRegistry[gameId];
};
