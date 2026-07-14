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
        <style>{`
          @keyframes sunbeamBreathing {
            0%, 100% {
              fill-opacity: 0.07;
              filter: blur(7px);
            }
            50% {
              fill-opacity: 0.20;
              filter: blur(10px);
            }
          }
          @keyframes sunbeamBreathingFast {
            0%, 100% {
              fill-opacity: 0.15;
              filter: blur(6px);
            }
            50% {
              fill-opacity: 0.32;
              filter: blur(9px);
            }
          }
          @keyframes sunbeamBorderShimmer {
            0%, 100% {
              stroke-opacity: 0.12;
              stroke-width: 4px;
              filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.15));
            }
            50% {
              stroke-opacity: 0.38;
              stroke-width: 6px;
              filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.45));
            }
          }
          @keyframes sunbeamBorderShimmerFast {
            0%, 100% {
              stroke-opacity: 0.35;
              stroke-width: 5px;
              filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.35));
            }
            50% {
              stroke-opacity: 0.85;
              stroke-width: 7.5px;
              filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.75));
            }
          }
          .sunbeam-glow {
            animation: sunbeamBreathing 4s infinite ease-in-out;
          }
          .sunbeam-glow-fast {
            animation: sunbeamBreathingFast 1.8s infinite ease-in-out;
          }
          .sunbeam-edge {
            animation: sunbeamBorderShimmer 3.5s infinite ease-in-out;
          }
          .sunbeam-edge-fast {
            animation: sunbeamBorderShimmerFast 1.5s infinite ease-in-out;
          }
        `}</style>

        {/* Soft back-glow to highlight the target region beautifully (always shown, pulses in interactive mode) */}
        <path
          className={classNames(
            "fill-amber-400 stroke-none transition-all duration-500",
            pulsing ? "sunbeam-glow-fast" : "sunbeam-glow"
          )}
          d={zone.visualHintPath}
          fillRule="evenodd"
          vectorEffect="non-scaling-stroke"
        />

        {/* Ambient edge-glow blur (shown slightly stronger in hint mode, pulses in interactive mode) */}
        <path
          className={classNames(
            "fill-none stroke-amber-400 transition-all duration-500",
            pulsing ? "sunbeam-edge-fast" : "sunbeam-edge"
          )}
          d={zone.visualHintPath}
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Crisp Border with subtle inner/outer glow - ONLY SHOWN WHEN DRAGGING/SELECTING (pulsing === true) */}
        {pulsing && (
          <path
            className="fill-none stroke-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.65)] animate-pulse"
            d={zone.visualHintPath}
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.0"
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
