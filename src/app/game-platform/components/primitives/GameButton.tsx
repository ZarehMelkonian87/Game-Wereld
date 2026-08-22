import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "../../utils/classNames";

export type GameButtonSize = "compact" | "default" | "large";
export type GameButtonTone = "blue" | "green" | "neutral" | "red" | "yellow";

export interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  size?: GameButtonSize;
  tone?: GameButtonTone;
}

const toneClasses: Record<GameButtonTone, string> = {
  blue: "border-sky-800 bg-sky-700 text-white shadow-[0_4px_0_rgba(3,105,161,0.75)] hover:bg-sky-800",
  green:
    "border-emerald-800 bg-emerald-700 text-white shadow-[0_4px_0_rgba(4,120,87,0.75)] hover:bg-emerald-800",
  neutral:
    "border-slate-300 bg-white text-slate-900 shadow-[0_4px_0_rgba(15,23,42,0.16)] hover:bg-slate-50",
  red: "border-rose-800 bg-rose-700 text-white shadow-[0_4px_0_rgba(190,18,60,0.55)] hover:bg-rose-800",
  yellow:
    "border-amber-400 bg-amber-300 text-amber-950 shadow-[0_4px_0_rgba(180,83,9,0.35)] hover:bg-amber-200",
};

const sizeClasses: Record<GameButtonSize, string> = {
  compact: "min-h-12 rounded-xl px-3 py-2 text-sm",
  default: "min-h-12 rounded-2xl px-5 py-3 text-base",
  large: "min-h-14 rounded-3xl px-6 py-4 text-lg",
};

export const GameButton = ({
  children,
  className,
  iconLeft,
  iconRight,
  size = "default",
  tone = "green",
  type = "button",
  ...buttonProps
}: GameButtonProps) => (
  <button
    {...buttonProps}
    className={classNames(
      "inline-flex touch-manipulation items-center justify-center gap-2 border-2 font-black leading-none outline-none transition duration-150 active:translate-y-0.5 active:scale-[0.98] active:shadow-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-700 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none",
      toneClasses[tone],
      sizeClasses[size],
      className,
    )}
    data-component="GameButton"
    data-tone={tone}
    type={type}
  >
    {iconLeft ? (
      <span className="flex h-5 w-5 items-center justify-center" data-slot="icon-left">
        {iconLeft}
      </span>
    ) : null}
    <span className="min-w-0 truncate" data-slot="label">
      {children}
    </span>
    {iconRight ? (
      <span className="flex h-5 w-5 items-center justify-center" data-slot="icon-right">
        {iconRight}
      </span>
    ) : null}
  </button>
);

GameButton.displayName = "GameButton";
