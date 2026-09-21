import { isLoadableGameEntry, type GameRegistryEntry } from "../game-platform/contracts";
import { comingSoonGameManifests } from "./catalog-manifests";
import { magischStrandAvontuurManifest } from "./magisch-strand-avontuur/manifest";
import { grootCircusAvontuurManifest } from "./groot-circus-avontuur/manifest";

export const gameRegistry: Record<string, GameRegistryEntry> = {
  [magischStrandAvontuurManifest.id]: {
    load: () => import("./magisch-strand-avontuur"),
    manifest: magischStrandAvontuurManifest,
  },
  [grootCircusAvontuurManifest.id]: {
    load: () => import("./groot-circus-avontuur"),
    manifest: grootCircusAvontuurManifest,
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
