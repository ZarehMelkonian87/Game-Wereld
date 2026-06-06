import { voiceSideScrollerObstacleSpriteUrls } from "../../asset-urls";
import { classNames } from "../../components/ui/classNames";
import type { VoiceSideScrollerObstacle } from "./voiceSideScrollerModel";

interface VoiceSideScrollerObstacleLayerProps {
  obstacles: VoiceSideScrollerObstacle[];
}

export const VoiceSideScrollerObstacleLayer = ({
  obstacles,
}: VoiceSideScrollerObstacleLayerProps) => (
  <div
    aria-hidden
    className="absolute inset-0 z-20"
    data-component="VoiceSideScrollerObstacleLayer"
    data-testid="voice-side-scroller-obstacle-layer"
  >
    {obstacles.map((obstacle) => (
      <div
        className={classNames(
          "absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200",
          obstacle.hit && "opacity-45",
        )}
        data-hit={obstacle.hit ? "true" : "false"}
        data-obstacle-kind={obstacle.kind}
        data-testid={`voice-side-scroller-obstacle-${obstacle.kind}`}
        key={obstacle.id}
        style={{
          height: `${obstacle.height * 100}%`,
          left: `${obstacle.x * 100}%`,
          top: `${obstacle.y * 100}%`,
          width: `${obstacle.width * 100}%`,
        }}
      >
        <img
          alt=""
          className={classNames(
            "h-full w-full object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.15)]",
            obstacle.kind === "parasol-edge" && "rotate-[16deg]",
          )}
          data-obstacle-sprite={obstacle.kind}
          draggable={false}
          src={voiceSideScrollerObstacleSpriteUrls[obstacle.kind]}
        />
      </div>
    ))}
  </div>
);

VoiceSideScrollerObstacleLayer.displayName = "VoiceSideScrollerObstacleLayer";
