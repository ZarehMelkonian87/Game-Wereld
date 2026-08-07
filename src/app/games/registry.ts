import { isLoadableGameEntry, type GameRegistryEntry } from "../game-platform/contracts";
import { comingSoonGameManifests } from "./catalog-manifests";
import { rekenenStrandManifest } from "./rekenen-strand/manifest";
import { magischStrandAvontuurManifest } from "./magisch-strand-avontuur/manifest";

export const gameRegistry: Record<string, GameRegistryEntry> = {
  [magischStrandAvontuurManifest.id]: {
    load: () => import("./magisch-strand-avontuur"),
    manifest: magischStrandAvontuurManifest,
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
