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
        {/* Soft back-glow to highlight the target region beautifully */}
        <path
          className={classNames(
            "fill-amber-400/10 stroke-amber-400/25 blur-[4px] transition-all duration-700",
            pulsing && "fill-amber-400/20 stroke-amber-500/40"
          )}
          d={zone.visualHintPath}
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
          vectorEffect="non-scaling-stroke"
        />
        {/* Primary golden border and transparent card overlay */}
        <path
          className={classNames(
            "fill-amber-400/15 stroke-amber-400/80 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all duration-700",
            pulsing && "animate-pulse fill-amber-400/25 stroke-amber-500"
          )}
          d={zone.visualHintPath}
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={classNames(
        "pointer-events-none absolute rounded-[1.5rem] border-2 border-amber-400 bg-amber-400/15 shadow-[0_0_12px_rgba(245,158,11,0.5),inset_0_0_8px_rgba(245,158,11,0.2)] transition-all duration-500",
        pulsing && "animate-pulse border-amber-500 bg-amber-400/25"
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
