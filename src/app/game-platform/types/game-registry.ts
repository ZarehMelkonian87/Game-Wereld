import type { ComponentType } from "react";
import type { GameConfig } from "./game-config";

export interface GameRegistryEntry {
  Component: ComponentType;
  config: GameConfig;
}

export type GameRegistry = Record<string, GameRegistryEntry>;
