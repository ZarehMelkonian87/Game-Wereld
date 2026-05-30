import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "./classNames";

interface PanelCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PanelCard({ children, className, ...panelProps }: PanelCardProps) {
  return (
    <div
      {...panelProps}
      className={classNames(
        "rounded-3xl border-2 border-white/90 bg-white/90 p-3 text-slate-900 shadow-[0_6px_0_rgba(15,23,42,0.12)] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
