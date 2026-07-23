import { isLoadableGameEntry, type GameRegistryEntry } from "../game-platform/contracts";
import { comingSoonGameManifests } from "./catalog-manifests";
import { rekenenStrandManifest } from "./rekenen-strand/manifest";
import { strandBezemEscapeManifest } from "./strand-bezem-escape/manifest";

export const gameRegistry: Record<string, GameRegistryEntry> = {
  [strandBezemEscapeManifest.id]: {
    load: () => import("./strand-bezem-escape"),
    manifest: strandBezemEscapeManifest,
  },
  [rekenenStrandManifest.id]: {
    load: () => import("./rekenen-strand"),
    manifest: rekenenStrandManifest,
  },
  ...Object.fromEntries(comingSoonGameManifests.map((manifest) => [manifest.id, { manifest }])),
};

export const getGameRegistryEntry = (gameId?: string) => {
  if (!gameId) {
    return undefined;
  }
  return gameRegistry[gameId];
};

export const getLoadableGameRegistryEntries = () =>
  Object.values(gameRegistry).filter(isLoadableGameEntry);
