import { ArrowDown, ArrowUp } from "lucide-react";
import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { classNames } from "../../components/ui/classNames";

interface VoiceSideScrollerThumbRailProps {
  disabled: boolean;
  onNeutral: () => void;
  onVerticalInput: (value: number) => void;
}

/**
 * Duim-rail voor fijne, eenhandige hoogtecontrole (UX-304). De rail is een
 * aanvulling: de `↑ Omhoog`/`↓ Omlaag`-knoppen blijven de toegankelijke,
 * toetsenbord-bedienbare basis, dus de rail zelf staat buiten de tab-volgorde.
 * Sleep-positie wordt vertaald naar een continue waarde [-1, 1] (omhoog is
 * negatief) die de bestaande engine-invoer voedt.
 */
export const VoiceSideScrollerThumbRail = ({
  disabled,
  onNeutral,
  onVerticalInput,
}: VoiceSideScrollerThumbRailProps) => {
  const trackRef = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState(0);
  const [active, setActive] = useState(false);

  const applyFromClientY = (clientY: number) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const rect = track.getBoundingClientRect();
    const half = rect.height / 2;
    const next = half > 0 ? Math.min(1, Math.max(-1, (clientY - (rect.top + half)) / half)) : 0;
    setValue(next);
    onVerticalInput(next);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }
    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture kan in sommige omgevingen ontbreken; de rail werkt
      // ook zonder capture (pointerleave/up geven dan neutraal terug).
    }
    setActive(true);
    applyFromClientY(event.clientY);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!active) {
      return;
    }
    applyFromClientY(event.clientY);
  };

  const release = () => {
    if (!active) {
      return;
    }
    setActive(false);
    setValue(0);
    onNeutral();
  };

  const knobPercent = ((value + 1) / 2) * 100;

  return (
    <button
      aria-hidden="true"
      className={classNames(
        "pointer-events-auto absolute right-2 top-1/2 z-20 flex h-[clamp(9rem,42vh,15rem)] w-12 -translate-y-1/2 touch-none select-none flex-col items-center justify-between rounded-full border-2 border-white/60 bg-white/45 p-2 shadow-[0_4px_0_rgba(15,23,42,0.08)] outline-none backdrop-blur-md disabled:opacity-40 landscape:right-3",
        active && "ring-2 ring-emerald-300",
      )}
      data-component="VoiceSideScrollerThumbRail"
      data-testid="voice-side-scroller-thumb-rail"
      data-value={value.toFixed(2)}
      disabled={disabled}
      onPointerCancel={release}
      onPointerDown={handlePointerDown}
      onPointerLeave={release}
      onPointerMove={handlePointerMove}
      onPointerUp={release}
      ref={trackRef}
      tabIndex={-1}
      type="button"
    >
      <ArrowUp aria-hidden="true" className="h-4 w-4 text-slate-700" strokeWidth={3} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8663d] shadow-[0_4px_10px_rgba(232,102,61,0.45)]"
        style={{ top: `${knobPercent}%` }}
      />
      <ArrowDown aria-hidden="true" className="h-4 w-4 text-slate-700" strokeWidth={3} />
    </button>
  );
};

VoiceSideScrollerThumbRail.displayName = "VoiceSideScrollerThumbRail";
