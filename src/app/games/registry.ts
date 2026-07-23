import {
  createGameId,
  isLoadableGameEntry,
  type GameId,
  type GameRegistryEntry,
} from "../game-platform/contracts";
import { comingSoonGameManifests } from "./catalog-manifests";
import { strandBezemEscapeManifest } from "./strand-bezem-escape/manifest";

export const gameRegistry: Record<string, GameRegistryEntry> = {
  [strandBezemEscapeManifest.id]: {
    load: () => import("./strand-bezem-escape"),
    manifest: strandBezemEscapeManifest,
  },
  ...Object.fromEntries(comingSoonGameManifests.map((manifest) => [manifest.id, { manifest }])),
};

export const legacyGameAliases: Readonly<Record<string, GameId>> = {
  "woordenschat-bezem-escape": strandBezemEscapeManifest.id,
  "taal-bezem-escape": createGameId("taal-strand-bezem-escape"),
  "rekenen-bezem-escape": createGameId("rekenen-strand-bezem-escape"),
  "wereld-bezem-escape": createGameId("wereld-strand-bezem-escape"),
};

export const resolveCanonicalGameId = (gameId: string): GameId =>
  legacyGameAliases[gameId] ?? createGameId(gameId);

export const getGameRegistryEntry = (gameId?: string) => {
  if (!gameId) {
    return undefined;
  }
  return gameRegistry[resolveCanonicalGameId(gameId)];
};

export const getLoadableGameRegistryEntries = () =>
  Object.values(gameRegistry).filter(isLoadableGameEntry);
