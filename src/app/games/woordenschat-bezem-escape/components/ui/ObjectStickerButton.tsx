import type { ButtonHTMLAttributes } from "react";
import { classNames } from "./classNames";

interface ObjectStickerButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  imageUrl: string;
  label: string;
  selected?: boolean;
  showLabel?: boolean;
  size?: "default" | "tray";
}

export function ObjectStickerButton({
  className,
  imageUrl,
  label,
  selected = false,
  showLabel = true,
  size = "default",
  type = "button",
  ...buttonProps
}: ObjectStickerButtonProps) {
  const isTraySize = size === "tray";

  return (
    <button
      {...buttonProps}
      aria-label={label}
      aria-pressed={selected || undefined}
      title={label}
      type={type}
      className={classNames(
        "flex max-h-full shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-white/95 text-slate-900 shadow-[0_3px_0_rgba(15,23,42,0.18)] transition duration-150 active:translate-y-0.5 active:scale-[0.98] active:shadow-none disabled:pointer-events-none disabled:opacity-50",
        isTraySize ? "touch-pan-x" : "touch-manipulation",
        isTraySize ? "min-h-[56px] min-w-[54px] px-1 py-1" : "min-h-[82px] min-w-[78px] px-2 py-2",
        selected
          ? "border-emerald-500 ring-2 ring-emerald-200"
          : "border-slate-300 hover:border-sky-400 hover:bg-sky-50",
        className,
      )}
    >
      <span
        className={classNames(
          "flex items-center justify-center rounded-xl bg-sky-50/80",
          isTraySize ? "h-8 w-8" : "h-12 w-12",
        )}
      >
        <img
          src={imageUrl}
          alt=""
          className={classNames("object-contain", isTraySize ? "max-h-7 max-w-7" : "max-h-11 max-w-11")}
          draggable={false}
        />
      </span>
      {showLabel ? (
        <span
          className={classNames(
            "truncate text-center font-black leading-tight",
            isTraySize ? "max-w-[48px] text-[0.58rem]" : "max-w-[64px] text-[0.7rem]",
          )}
        >
          {label}
        </span>
      ) : null}
    </button>
  );
}
