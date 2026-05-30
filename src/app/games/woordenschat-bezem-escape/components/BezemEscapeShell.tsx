import type { ReactNode } from "react";
import type { GameWorld } from "../types";

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
      className="h-[100svh] overflow-hidden bg-[#c7f1ee] p-3 text-slate-900"
    >
      <section
        data-testid="bezem-escape-stage"
        aria-label={world.name}
        className="relative h-full w-full overflow-hidden rounded-lg border-4 border-white/80 bg-[#dff8f6] shadow-inner"
      >
        {children}
      </section>
    </main>
  );
}
