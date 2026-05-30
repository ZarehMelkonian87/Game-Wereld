import type { ReactNode } from "react";

interface GameStageProps {
  children: ReactNode;
  name: string;
}

export function GameStage({ children, name }: GameStageProps) {
  return (
    <section
      data-testid="bezem-escape-stage"
      aria-label={name}
      className="relative isolate h-full w-full overflow-hidden bg-sky-100"
    >
      {children}
    </section>
  );
}
