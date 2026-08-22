import {
  isLoadableGameEntry,
  type GameCapability,
  type GameManifest,
  type GameModule,
  type GameRegistryEntry,
} from "../game-platform";

export const getMissingRequiredCapabilities = (
  manifest: GameManifest,
  available: ReadonlySet<GameCapability>,
) => manifest.requiredCapabilities.filter((capability) => !available.has(capability));

export const loadGameModule = async (entry: GameRegistryEntry): Promise<GameModule> => {
  if (!isLoadableGameEntry(entry)) {
    throw new Error("Deze registryentry heeft geen loader.");
  }
  const module = await entry.load();
  if (typeof module.Game !== "function") {
    throw new TypeError("De gamemodule exporteert geen geldige Game-component.");
  }
  return module;
};
