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
        <path
          className={classNames(
            "fill-amber-200/20 stroke-amber-400 drop-shadow-[0_0_0.45rem_rgba(255,255,255,0.72)]",
            pulsing && "animate-pulse fill-amber-300/30 stroke-amber-500"
          )}
          d={zone.visualHintPath}
          fillRule="evenodd"
          strokeDasharray="2.6 2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={classNames(
        "pointer-events-none absolute rounded-[1.5rem] border-4 border-dashed border-amber-400 bg-amber-200/20 shadow-[0_0_0_5px_rgba(255,255,255,0.72)]",
        pulsing && "animate-pulse border-amber-500 bg-amber-300/30"
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
