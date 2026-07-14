import { classNames } from "../../components/ui/classNames";
import type { SceneZone } from "../../types";

interface TargetZoneHintProps {
  zone: SceneZone;
  pulsing?: boolean;
}

export const TargetZoneHint = ({ zone, pulsing = false }: TargetZoneHintProps) => {
  if (zone.visualHintPath) {
    return (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        data-shape="path"
        data-testid="target-zone-hint"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {/* Soft back-glow to highlight the target region beautifully (always shown, pulses in interactive mode) */}
        <path
          className={classNames(
            "fill-amber-400/12 transition-all duration-700 blur-[8px]",
            pulsing ? "animate-pulse fill-amber-400/22" : "fill-amber-400/12"
          )}
          d={zone.visualHintPath}
          fillRule="evenodd"
          vectorEffect="non-scaling-stroke"
        />

        {/* Ambient edge-glow blur (shown slightly stronger in hint mode, pulses in interactive mode) */}
        <path
          className={classNames(
            "fill-none stroke-amber-400/20 blur-[3px] transition-all duration-700",
            pulsing ? "stroke-amber-400/35" : "stroke-amber-400/15"
          )}
          d={zone.visualHintPath}
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
          vectorEffect="non-scaling-stroke"
        />

        {/* Crisp Border with subtle inner/outer glow - ONLY SHOWN WHEN DRAGGING/SELECTING (pulsing === true) */}
        {pulsing && (
          <path
            className="fill-none stroke-amber-400/90 drop-shadow-[0_0_6px_rgba(245,158,11,0.65)] animate-pulse"
            d={zone.visualHintPath}
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={classNames(
        "pointer-events-none absolute rounded-[1.5rem] transition-all duration-500",
        pulsing
          ? "border-2 border-amber-400 bg-amber-400/20 shadow-[0_0_12px_rgba(245,158,11,0.5),inset_0_0_8px_rgba(245,158,11,0.2)] animate-pulse"
          : "bg-amber-400/12 shadow-[0_0_16px_rgba(245,158,11,0.3)] blur-[2px]"
      )}
      data-shape="rect"
      data-testid="target-zone-hint"
      style={{
        height: `${zone.height}%`,
        left: `${zone.x}%`,
        top: `${zone.y}%`,
        width: `${zone.width}%`,
      }}
    />
  );
};

TargetZoneHint.displayName = "TargetZoneHint";
