import type { ReactNode } from "react";
import { GameShell } from "../../../../game-platform";
import type { GameWorld } from "../../types";
import { GameBackgroundMusic } from "../audio/GameBackgroundMusic";

interface MagischStrandAvontuurShellProps {
  children: ReactNode;
  world: GameWorld;
}

export const MagischStrandAvontuurShell = ({ children, world }: MagischStrandAvontuurShellProps) => (
  <GameShell
    gameId="magisch-strand-avontuur"
    instructionCount={world.instructions.length}
    label="Magisch Strand-Avontuur"
    objectCount={world.objects.length}
    stageName={world.name}
    testId="magisch-strand-avontuur-layout"
    worldId={world.id}
  >
    <GameBackgroundMusic />
    {children}
  </GameShell>
);

MagischStrandAvontuurShell.displayName = "MagischStrandAvontuurShell";
