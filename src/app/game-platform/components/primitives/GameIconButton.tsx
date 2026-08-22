import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "../../utils/classNames";

export type GameIconButtonTone = "blue" | "green" | "red" | "white" | "yellow";

export interface GameIconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  icon: ReactNode;
  label: string;
  pressed?: boolean;
  showLabel?: boolean;
  tone?: GameIconButtonTone;
}

const toneClasses: Record<GameIconButtonTone, string> = {
  blue: "border-sky-500 bg-sky-100 text-sky-950 shadow-sky-700/25 hover:bg-sky-200",
  green:
    "border-emerald-500 bg-emerald-100 text-emerald-950 shadow-emerald-700/25 hover:bg-emerald-200",
  red: "border-rose-500 bg-rose-100 text-rose-950 shadow-rose-700/25 hover:bg-rose-200",
  white: "border-slate-300 bg-white text-slate-900 shadow-slate-500/20 hover:bg-slate-50",
  yellow: "border-amber-400 bg-amber-100 text-amber-950 shadow-amber-700/25 hover:bg-amber-200",
};

export const GameIconButton = ({
  className,
  icon,
  label,
  pressed,
  showLabel = false,
  tone = "white",
  type = "button",
  ...buttonProps
}: GameIconButtonProps) => (
  <button
    {...buttonProps}
    aria-label={label}
    aria-pressed={pressed}
    className={classNames(
      "inline-flex min-h-12 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-2xl border-2 font-black leading-none shadow-[0_3px_0] outline-none transition duration-150 active:translate-y-0.5 active:scale-[0.98] active:shadow-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-700 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none",
      showLabel ? "px-3 text-sm" : "w-12 px-0",
      pressed && "translate-y-0.5 shadow-none ring-2 ring-white ring-offset-2 ring-offset-sky-200",
      toneClasses[tone],
      className,
    )}
    data-component="GameIconButton"
    data-tone={tone}
    title={label}
    type={type}
  >
    <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center" data-slot="icon">
      {icon}
    </span>
    {showLabel ? (
      <span className="max-w-24 truncate" data-slot="label">
        {label}
      </span>
    ) : null}
  </button>
);

GameIconButton.displayName = "GameIconButton";
