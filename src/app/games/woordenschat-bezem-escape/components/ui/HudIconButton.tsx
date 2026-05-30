import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "./classNames";

type HudIconButtonTone = "blue" | "green" | "yellow" | "white";

const toneClasses: Record<HudIconButtonTone, string> = {
  blue: "border-sky-500 bg-sky-100 text-sky-950 shadow-sky-700/25 hover:bg-sky-200",
  green: "border-emerald-500 bg-emerald-100 text-emerald-950 shadow-emerald-700/25 hover:bg-emerald-200",
  yellow: "border-amber-400 bg-amber-100 text-amber-950 shadow-amber-700/25 hover:bg-amber-200",
  white: "border-slate-300 bg-white text-slate-900 shadow-slate-500/20 hover:bg-slate-50",
};

interface HudIconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: ReactNode;
  label: string;
  pressed?: boolean;
  showLabel?: boolean;
  tone?: HudIconButtonTone;
}

export function HudIconButton({
  className,
  icon,
  label,
  pressed = false,
  showLabel = false,
  tone = "white",
  type = "button",
  ...buttonProps
}: HudIconButtonProps) {
  return (
    <button
      {...buttonProps}
      aria-label={label}
      aria-pressed={pressed || undefined}
      title={label}
      type={type}
      className={classNames(
        "inline-flex min-h-11 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-2xl border-2 font-black leading-none shadow-[0_3px_0] transition duration-150 active:translate-y-0.5 active:scale-[0.98] active:shadow-none disabled:pointer-events-none disabled:opacity-50",
        showLabel ? "px-3 text-sm" : "w-11 px-0",
        pressed && "translate-y-0.5 shadow-none ring-2 ring-white ring-offset-2 ring-offset-sky-200",
        toneClasses[tone],
        className,
      )}
    >
      <span className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
        {icon}
      </span>
      {showLabel ? <span className="max-w-24 truncate">{label}</span> : null}
    </button>
  );
}
