import type { GameManifest } from "./game-manifest";
import type { GameModule } from "./game-runtime";

export type AvailableGameRegistryEntry = {
  load: () => Promise<GameModule>;
  manifest: GameManifest;
};

export type ComingSoonGameRegistryEntry = {
  manifest: GameManifest;
};

export type GameRegistryEntry = AvailableGameRegistryEntry | ComingSoonGameRegistryEntry;

export const isLoadableGameEntry = (
  entry: GameRegistryEntry,
): entry is AvailableGameRegistryEntry => "load" in entry;
