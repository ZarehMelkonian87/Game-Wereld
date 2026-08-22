import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "../../utils/classNames";

export interface GamePanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "glass" | "solid" | "transparent";
}

const variantClasses: Record<NonNullable<GamePanelProps["variant"]>, string> = {
  glass:
    "border-white/90 bg-white/90 text-slate-900 shadow-[0_6px_0_rgba(15,23,42,0.12)] backdrop-blur-sm",
  solid: "border-white bg-white text-slate-900 shadow-[0_6px_0_rgba(15,23,42,0.14)]",
  transparent:
    "border-white/55 bg-white/45 text-slate-900 shadow-[0_4px_0_rgba(15,23,42,0.08)] backdrop-blur-sm",
};

export const GamePanel = ({
  children,
  className,
  variant = "glass",
  ...panelProps
}: GamePanelProps) => (
  <div
    {...panelProps}
    className={classNames("rounded-3xl border-2 p-3", variantClasses[variant], className)}
    data-component="GamePanel"
  >
    {children}
  </div>
);

GamePanel.displayName = "GamePanel";
