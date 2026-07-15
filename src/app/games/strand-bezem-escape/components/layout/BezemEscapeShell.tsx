import type { ReactNode } from "react";
import { GameShell } from "../../../../game-platform";
import type { GameWorld } from "../../types";
import { GameBackgroundMusic } from "../audio/GameBackgroundMusic";

interface BezemEscapeShellProps {
  children: ReactNode;
  world: GameWorld;
}

export const BezemEscapeShell = ({ children, world }: BezemEscapeShellProps) => (
  <GameShell
    gameId="strand-bezem-escape"
    instructionCount={world.instructions.length}
    label="Magisch Strand-Avontuur"
    objectCount={world.objects.length}
    stageName={world.name}
    testId="woordenschat-bezem-layout"
    worldId={world.id}
  >
    <GameBackgroundMusic />
    {children}
  </GameShell>
);

BezemEscapeShell.displayName = "BezemEscapeShell";
