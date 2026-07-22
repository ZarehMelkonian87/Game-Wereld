import type { SceneZone } from "../../types";
import { getZoneCenter, parseSimplePolygonPath } from "../../logic/scene-zones";

interface TargetZoneHintProps {
  zone: SceneZone;
  pulsing?: boolean;
}

export const TargetZoneHint = ({ zone, pulsing = false }: TargetZoneHintProps) => {
  const center = getZoneCenter(zone);
  const polygonPoints = parseSimplePolygonPath(zone.visualHintPath);

  let ringWidth = Math.min(zone.width * 0.7, 42);
  let ringHeight = Math.min(zone.height * 0.7, 32);

  if (polygonPoints.length >= 3) {
    const minX = Math.min(...polygonPoints.map((p) => p.x));
    const maxX = Math.max(...polygonPoints.map((p) => p.x));
    const minY = Math.min(...polygonPoints.map((p) => p.y));
    const maxY = Math.max(...polygonPoints.map((p) => p.y));

    ringWidth = Math.max(16, Math.min((maxX - minX) * 0.65, 42));
    ringHeight = Math.max(14, Math.min((maxY - minY) * 0.65, 32));
  }

  return (
    <>
      {/* 1. Ambient Sunbeam Glow (renders boundary polygon if visualHintPath is defined) */}
      {zone.visualHintPath ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          data-shape="path"
          data-testid="target-zone-hint-boundary"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <style>{`
            @keyframes sunbeamBreathing {
              0%, 100% {
                fill-opacity: 0.05;
                filter: blur(6px);
              }
              50% {
                fill-opacity: 0.16;
                filter: blur(9px);
              }
            }
            @keyframes sunbeamEdgeShimmer {
              0%, 100% {
                stroke-opacity: 0.10;
                filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.1));
              }
              50% {
                stroke-opacity: 0.30;
                filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.35));
              }
            }
            .sunbeam-glow {
              animation: sunbeamBreathing 4s infinite ease-in-out;
            }
            .sunbeam-edge {
              animation: sunbeamEdgeShimmer 3.5s infinite ease-in-out;
            }
          `}</style>

          <path
            className="fill-amber-400 stroke-none transition-all duration-500 sunbeam-glow"
            d={zone.visualHintPath}
            fillRule="evenodd"
            vectorEffect="non-scaling-stroke"
          />

          <path
            className="fill-none stroke-amber-400 transition-all duration-500 sunbeam-edge"
            d={zone.visualHintPath}
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[1.5rem] bg-amber-400/8 shadow-[0_0_16px_rgba(245,158,11,0.2)] blur-[2px] transition-all duration-500"
          style={{
            height: `${zone.height}%`,
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            width: `${zone.width}%`,
          }}
        />
      )}

      {/* 2. Rotating Concentric Magic Rings (rendered at the true centroid of the target zone) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute"
        data-testid="target-zone-hint-magic-rings"
        style={{
          left: `${center.x - ringWidth / 2}%`,
          top: `${center.y - ringHeight / 2}%`,
          width: `${ringWidth}%`,
          height: `${ringHeight}%`,
        }}
        viewBox="0 0 100 100"
      >
        <style>{`
          @keyframes rotateMagicCW {
            from { stroke-dashoffset: 350; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes rotateMagicCCW {
            from { stroke-dashoffset: -350; }
            to { stroke-dashoffset: 0; }
          }
          .magic-ring-outer {
            stroke-dasharray: 10 14;
            animation: rotateMagicCW ${pulsing ? "5s" : "10s"} linear infinite;
          }
          .magic-ring-inner {
            stroke-dasharray: 6 9;
            animation: rotateMagicCCW ${pulsing ? "3.5s" : "7s"} linear infinite;
          }
          .magic-ring-sparkles {
            stroke-dasharray: 0 30;
            animation: rotateMagicCW ${pulsing ? "2.5s" : "5s"} linear infinite;
          }
        `}</style>
        
        {/* Outer Ring */}
        <ellipse
          cx="50"
          cy="50"
          rx="45"
          ry="38"
          fill="none"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="1.6"
          className="magic-ring-outer"
          style={{
            filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))",
          }}
        />

        {/* Inner Ring */}
        <ellipse
          cx="50"
          cy="50"
          rx="32"
          ry="27"
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="1.2"
          className="magic-ring-inner"
          style={{
            filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.85)) drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))",
          }}
        />

        {/* Sparkle Beads */}
        <ellipse
          cx="50"
          cy="50"
          rx="45"
          ry="38"
          fill="none"
          stroke="rgba(255, 255, 255, 0.98)"
          strokeWidth="3.2"
          strokeLinecap="round"
          className="magic-ring-sparkles"
          style={{
            filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 8px rgba(251, 191, 36, 0.7))",
          }}
        />
      </svg>
    </>
  );
};

TargetZoneHint.displayName = "TargetZoneHint";
