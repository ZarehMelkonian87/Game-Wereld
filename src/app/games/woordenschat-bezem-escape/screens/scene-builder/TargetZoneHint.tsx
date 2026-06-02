import type { SceneZone } from "../../types";

interface TargetZoneHintProps {
  zone: SceneZone;
}

export const TargetZoneHint = ({ zone }: TargetZoneHintProps) => {
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
          className="fill-amber-200/20 stroke-amber-400 drop-shadow-[0_0_0.45rem_rgba(255,255,255,0.72)]"
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
      className="pointer-events-none absolute rounded-[1.5rem] border-4 border-dashed border-amber-400 bg-amber-200/20 shadow-[0_0_0_5px_rgba(255,255,255,0.72)]"
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
