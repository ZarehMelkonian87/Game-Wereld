import { type ButtonHTMLAttributes } from "react";
import { Lock, Play, CheckCircle2 } from "lucide-react";

export interface LockedPlayButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> {
  canPlay: boolean;
  lockedLabel?: string;
  onClick?: () => void;
  readyLabel?: string;
  showCheckIcon?: boolean;
}

/**
 * Reusable Play/Start button for download-gated platforms (T-46).
 * Remains disabled & locked until 100% download completion is achieved.
 */
export const LockedPlayButton = ({
  canPlay,
  className = "",
  disabled = false,
  lockedLabel = "Speel nu (pas na 100% download)",
  onClick,
  readyLabel = "Klaar! Start avontuur",
  showCheckIcon = true,
  ...buttonProps
}: LockedPlayButtonProps) => {
  const isButtonDisabled = !canPlay || disabled;

  if (!canPlay) {
    return (
      <button
        aria-disabled="true"
        aria-label={lockedLabel}
        className={`relative flex min-h-[52px] w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-700/60 bg-slate-800/80 px-6 py-3.5 text-center font-black text-slate-400 shadow-inner transition-all duration-200 select-none ${className}`}
        data-component="LockedPlayButton"
        data-state="locked"
        disabled
        title={lockedLabel}
        type="button"
        {...buttonProps}
      >
        <Lock aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" />
        <span className="truncate text-base leading-tight tracking-wide">{lockedLabel}</span>
      </button>
    );
  }

  return (
    <button
      aria-label={readyLabel}
      className={`group relative flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 px-6 py-3.5 text-center font-black text-white shadow-[0_4px_20px_rgba(16,185,129,0.45)] transition-all duration-150 hover:brightness-105 active:translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/80 ${className}`}
      data-component="LockedPlayButton"
      data-state="ready"
      disabled={isButtonDisabled}
      onClick={onClick}
      title={readyLabel}
      type="button"
      {...buttonProps}
    >
      {showCheckIcon ? (
        <CheckCircle2
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-white drop-shadow transition-transform group-hover:scale-110"
        />
      ) : (
        <Play
          aria-hidden="true"
          className="h-5 w-5 shrink-0 fill-white text-white drop-shadow transition-transform group-hover:scale-110"
        />
      )}
      <span className="truncate text-base leading-tight tracking-wide text-white drop-shadow-sm">
        {readyLabel}
      </span>
    </button>
  );
};

LockedPlayButton.displayName = "LockedPlayButton";
