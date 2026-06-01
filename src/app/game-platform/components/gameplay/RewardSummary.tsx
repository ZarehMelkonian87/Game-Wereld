import type { ReactNode } from "react";
import { GamePanel } from "../primitives";

export interface RewardSummaryProps {
  actions?: ReactNode;
  children: ReactNode;
  title: string;
}

export const RewardSummary = ({ actions, children, title }: RewardSummaryProps) => (
  <GamePanel data-component="RewardSummary">
    <div className="grid gap-3">
      <h2 className="text-xl font-black leading-tight text-slate-900" data-slot="title">
        {title}
      </h2>
      <div data-slot="content">{children}</div>
      {actions ? <div className="flex flex-wrap gap-2" data-slot="actions">{actions}</div> : null}
    </div>
  </GamePanel>
);

RewardSummary.displayName = "RewardSummary";

