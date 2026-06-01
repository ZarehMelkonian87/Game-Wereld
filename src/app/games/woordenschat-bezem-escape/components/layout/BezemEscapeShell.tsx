import type { ReactNode } from "react";
import { GameShell } from "../../../../game-platform";
import type { GameWorld } from "../../types";

interface BezemEscapeShellProps {
  children: ReactNode;
  world: GameWorld;
}

export const BezemEscapeShell = ({ children, world }: BezemEscapeShellProps) => (
  <GameShell
    gameId="woordenschat-bezem-escape"
    instructionCount={world.instructions.length}
    label="+1 Woordenschat Bezem Escape"
    objectCount={world.objects.length}
    stageName={world.name}
    testId="woordenschat-bezem-layout"
    worldId={world.id}
  >
    {children}
  </GameShell>
);

BezemEscapeShell.displayName = "BezemEscapeShell";
