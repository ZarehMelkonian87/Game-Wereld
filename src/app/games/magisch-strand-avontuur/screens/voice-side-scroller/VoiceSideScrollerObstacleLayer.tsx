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
        data-collision-height={obstacle.collisionBox.height}
        data-collision-offset-x={obstacle.collisionBox.offsetX}
        data-collision-offset-y={obstacle.collisionBox.offsetY}
        data-collision-width={obstacle.collisionBox.width}
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
          className="h-full w-full object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.15)]"
          data-obstacle-sprite={obstacle.kind}
          draggable={false}
          src={voiceSideScrollerObstacleSpriteUrls[obstacle.kind]}
        />
      </div>
    ))}
  </div>
);

VoiceSideScrollerObstacleLayer.displayName = "VoiceSideScrollerObstacleLayer";
