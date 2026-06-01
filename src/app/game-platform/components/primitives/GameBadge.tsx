import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "../../utils/classNames";

export interface GameBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: "blue" | "green" | "neutral" | "yellow";
}

const toneClasses: Record<NonNullable<GameBadgeProps["tone"]>, string> = {
  blue: "border-sky-300 bg-sky-100 text-sky-950",
  green: "border-emerald-300 bg-emerald-100 text-emerald-950",
  neutral: "border-slate-300 bg-white text-slate-900",
  yellow: "border-amber-300 bg-amber-100 text-amber-950",
};

export const GameBadge = ({
  children,
  className,
  tone = "neutral",
  ...badgeProps
}: GameBadgeProps) => (
  <span
    {...badgeProps}
    className={classNames(
      "inline-flex min-h-8 items-center justify-center rounded-full border-2 px-3 text-xs font-black leading-none",
      toneClasses[tone],
      className,
    )}
    data-component="GameBadge"
    data-tone={tone}
  >
    {children}
  </span>
);

GameBadge.displayName = "GameBadge";

