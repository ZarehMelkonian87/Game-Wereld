import type { ReactNode } from "react";
import { GameShell } from "../../../../game-platform";
import type { GameWorld } from "../../types";
import { GameBackgroundMusic } from "../audio/GameBackgroundMusic";

interface MagischStrandAvontuurShellProps {
  children: ReactNode;
  world: GameWorld;
}

export const MagischStrandAvontuurShell = ({
  children,
  world,
}: MagischStrandAvontuurShellProps) => (
  <GameShell
    gameId="groot-circus-avontuur"
    instructionCount={world.instructions.length}
    label="Groot Circus-Avontuur"
    objectCount={world.objects.length}
    stageName={world.name}
    testId="groot-circus-avontuur-layout"
    worldId={world.id}
  >
    <GameBackgroundMusic />
    {children}
  </GameShell>
);

MagischStrandAvontuurShell.displayName = "MagischStrandAvontuurShell";
