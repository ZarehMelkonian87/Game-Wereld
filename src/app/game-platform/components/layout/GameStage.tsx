import type { ReactNode } from "react";

export interface GameStageProps {
  children: ReactNode;
  name: string;
}

export const GameStage = ({ children, name }: GameStageProps) => (
  <section
    aria-label={name}
    className="relative isolate h-full w-full overflow-hidden bg-sky-100"
    data-component="GameStage"
    data-testid="game-stage"
  >
    {children}
  </section>
);

GameStage.displayName = "GameStage";
