import type { ButtonHTMLAttributes } from "react";
import { classNames } from "./classNames";

interface ObjectStickerButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  imageUrl: string;
  label: string;
  selected?: boolean;
  showLabel?: boolean;
}

export function ObjectStickerButton({
  className,
  imageUrl,
  label,
  selected = false,
  showLabel = true,
  type = "button",
  ...buttonProps
}: ObjectStickerButtonProps) {
  return (
    <button
      {...buttonProps}
      aria-label={label}
      aria-pressed={selected || undefined}
      title={label}
      type={type}
      className={classNames(
        "flex min-h-[82px] min-w-[78px] shrink-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-white/95 px-2 py-2 text-slate-900 shadow-[0_3px_0_rgba(15,23,42,0.18)] transition duration-150 active:translate-y-0.5 active:scale-[0.98] active:shadow-none disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-emerald-500 ring-2 ring-emerald-200"
          : "border-slate-300 hover:border-sky-400 hover:bg-sky-50",
        className,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50/80">
        <img
          src={imageUrl}
          alt=""
          className="max-h-11 max-w-11 object-contain"
          draggable={false}
        />
      </span>
      {showLabel ? (
        <span className="max-w-[64px] truncate text-center text-[0.7rem] font-black leading-tight">
          {label}
        </span>
      ) : null}
    </button>
  );
}
