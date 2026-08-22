import { createContext, useContext, type ReactNode } from "react";
import type { GameRuntime } from "../../../game-platform/contracts";

const GameRuntimeContext = createContext<GameRuntime | null>(null);

export const GameRuntimeProvider = ({
  children,
  runtime,
}: {
  children: ReactNode;
  runtime: GameRuntime;
}) => <GameRuntimeContext.Provider value={runtime}>{children}</GameRuntimeContext.Provider>;

GameRuntimeProvider.displayName = "GameRuntimeProvider";

export const useGameRuntime = () => {
  const runtime = useContext(GameRuntimeContext);
  if (!runtime) {
    throw new Error("GameRuntime ontbreekt. Mount de game via GameHost of een fake runtime.");
  }
  return runtime;
};
