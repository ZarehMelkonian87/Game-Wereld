import type { ButtonHTMLAttributes } from "react";
import { classNames } from "../../utils/classNames";

export interface StickerObjectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  imageUrl: string;
  label: string;
  selected?: boolean;
  showLabel?: boolean;
  size?: "default" | "tray";
}

export const StickerObject = ({
  className,
  imageUrl,
  label,
  selected = false,
  showLabel = true,
  size = "default",
  type = "button",
  ...buttonProps
}: StickerObjectProps) => {
  const isTraySize = size === "tray";

  return (
    <button
      {...buttonProps}
      aria-label={label}
      aria-pressed={selected || undefined}
      className={classNames(
        "flex max-h-full shrink-0 flex-col items-center justify-center gap-1 text-slate-900 transition duration-150 active:translate-y-0.5 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        isTraySize ? "touch-pan-x" : "touch-manipulation",
        isTraySize
          ? "min-h-[56px] min-w-[54px] rounded-xl border-0 bg-transparent px-1 py-1 shadow-none"
          : "min-h-[82px] min-w-[78px] rounded-2xl border-2 bg-white/95 px-2 py-2 shadow-[0_3px_0_rgba(15,23,42,0.18)] active:shadow-none",
        isTraySize && selected && "scale-105 drop-shadow-[0_0_0.45rem_rgba(16,185,129,0.75)]",
        !isTraySize &&
          (selected
            ? "border-emerald-500 ring-2 ring-emerald-200"
            : "border-slate-300 hover:border-sky-400 hover:bg-sky-50"),
        className,
      )}
      data-component="StickerObject"
      data-selected={selected || undefined}
      data-size={size}
      title={label}
      type={type}
    >
      <span
        className={classNames(
          "flex items-center justify-center",
          isTraySize ? "h-12 w-12" : "h-12 w-12 rounded-xl bg-sky-50/80",
        )}
        data-slot="image-frame"
      >
        <img
          alt=""
          className={classNames(
            "object-contain",
            isTraySize
              ? "max-h-12 max-w-12 drop-shadow-[0_3px_0_rgba(15,23,42,0.14)]"
              : "max-h-11 max-w-11",
          )}
          data-slot="image"
          draggable={false}
          src={imageUrl}
        />
      </span>
      {showLabel ? (
        <span
          className={classNames(
            "truncate text-center font-black leading-tight",
            isTraySize ? "max-w-[48px] text-[0.58rem]" : "max-w-[64px] text-[0.7rem]",
          )}
          data-slot="label"
        >
          {label}
        </span>
      ) : null}
    </button>
  );
};

StickerObject.displayName = "StickerObject";

