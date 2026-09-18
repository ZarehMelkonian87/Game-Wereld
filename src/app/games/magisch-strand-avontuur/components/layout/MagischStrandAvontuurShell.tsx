import type { ReactNode } from "react";
import { GameShell } from "../../../../game-platform";
import { PortraitGuard } from "../../../../platform";
import { useReducedMotionSetting } from "../../logic/useReducedMotionSetting";
import type { GameWorld } from "../../types";
import { GameBackgroundMusic } from "../audio/GameBackgroundMusic";

interface MagischStrandAvontuurShellProps {
  children: ReactNode;
  world: GameWorld;
}

export const MagischStrandAvontuurShell = ({
  children,
  world,
}: MagischStrandAvontuurShellProps) => {
  // De in-app "Rustige animaties"-toggle dempt zware animaties naast de
  // OS-instelling `prefers-reduced-motion` (T-14). `display: contents` houdt de
  // lay-out ongewijzigd; het attribuut stuurt alleen de CSS in `theme.css`.
  const reducedMotion = useReducedMotionSetting();

  return (
    <GameShell
      gameId="magisch-strand-avontuur"
      instructionCount={world.instructions.length}
      label="Magisch Strand-Avontuur"
      objectCount={world.objects.length}
      stageName={world.name}
      testId="magisch-strand-avontuur-layout"
      worldId={world.id}
    >
      <div
        className="contents"
        data-app-reduced-motion={reducedMotion ? "true" : "false"}
        data-testid="magisch-strand-avontuur-motion-scope"
      >
        <GameBackgroundMusic />
        {children}
        {/* Nooit liggend op mobiel (T-42): overlay + best-effort orientatie-lock. */}
        <PortraitGuard />
      </div>
    </GameShell>
  );
};

MagischStrandAvontuurShell.displayName = "MagischStrandAvontuurShell";
