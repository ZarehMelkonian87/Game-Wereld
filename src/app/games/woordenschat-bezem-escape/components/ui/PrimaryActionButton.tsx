import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "./classNames";

interface PrimaryActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function PrimaryActionButton({
  children,
  className,
  iconLeft,
  iconRight,
  type = "button",
  ...buttonProps
}: PrimaryActionButtonProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      className={classNames(
        "inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-2xl border-2 border-emerald-600 bg-emerald-500 px-5 py-3 text-base font-black leading-none text-white shadow-[0_4px_0_rgba(4,120,87,0.75)] transition duration-150 hover:bg-emerald-400 active:translate-y-0.5 active:scale-[0.98] active:shadow-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {iconLeft ? <span className="flex h-5 w-5 items-center justify-center">{iconLeft}</span> : null}
      <span className="min-w-0 truncate">{children}</span>
      {iconRight ? <span className="flex h-5 w-5 items-center justify-center">{iconRight}</span> : null}
    </button>
  );
}
