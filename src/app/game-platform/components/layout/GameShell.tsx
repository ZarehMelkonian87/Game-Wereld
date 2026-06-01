import type { ReactNode } from "react";
import { GameStage } from "./GameStage";

export interface GameShellProps {
  children: ReactNode;
  gameId: string;
  instructionCount?: number;
  label: string;
  objectCount?: number;
  stageName: string;
  testId?: string;
  worldId?: string;
}

export const GameShell = ({
  children,
  gameId,
  instructionCount,
  label,
  objectCount,
  stageName,
  testId,
  worldId,
}: GameShellProps) => (
  <main
    aria-label={label}
    className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-sky-100 text-slate-900"
    data-component="GameShell"
    data-game-id={gameId}
    data-instruction-count={instructionCount}
    data-object-count={objectCount}
    data-testid={testId}
    data-world-id={worldId}
  >
    <GameStage name={stageName}>{children}</GameStage>
  </main>
);

GameShell.displayName = "GameShell";
