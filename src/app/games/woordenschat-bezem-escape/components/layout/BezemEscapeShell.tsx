import type { ReactNode } from "react";
import type { GameWorld } from "../../types";
import { GameStage } from "./GameStage";

interface BezemEscapeShellProps {
  children: ReactNode;
  world: GameWorld;
}

export function BezemEscapeShell({ children, world }: BezemEscapeShellProps) {
  return (
    <main
      data-testid="woordenschat-bezem-layout"
      data-world-id={world.id}
      data-object-count={world.objects.length}
      data-instruction-count={world.instructions.length}
      aria-label="+1 Woordenschat Bezem Escape"
      className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-sky-100 text-slate-900"
    >
      <GameStage name={world.name}>{children}</GameStage>
    </main>
  );
}
