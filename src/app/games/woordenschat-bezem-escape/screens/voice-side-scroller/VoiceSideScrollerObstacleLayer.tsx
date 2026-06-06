import { beachObjectStickerUrls } from "../../asset-urls";
import { classNames } from "../../components/ui/classNames";
import type {
  VoiceSideScrollerObstacle,
  VoiceSideScrollerObstacleKind,
} from "./voiceSideScrollerModel";

interface VoiceSideScrollerObstacleLayerProps {
  obstacles: VoiceSideScrollerObstacle[];
}

interface VoiceSideScrollerObstacleSpriteProps {
  kind: VoiceSideScrollerObstacleKind;
}

const shapeClassNames: Record<Exclude<VoiceSideScrollerObstacleKind, "parasol-edge">, string> = {
  cloud:
    "rounded-[999px] border-[3px] border-white bg-white/95 shadow-[0_5px_0_rgba(14,116,144,0.12)] before:absolute before:-left-2 before:bottom-2 before:h-8 before:w-8 before:rounded-full before:bg-white after:absolute after:left-7 after:-top-3 after:h-10 after:w-10 after:rounded-full after:bg-white",
  rock:
    "rounded-[58%_42%_46%_54%] border-[3px] border-slate-500 bg-slate-300 shadow-[0_5px_0_rgba(71,85,105,0.28)]",
  wave:
    "rounded-[999px] border-[3px] border-sky-500 bg-sky-200 shadow-[0_5px_0_rgba(14,116,144,0.22)] before:absolute before:left-3 before:top-2 before:h-3 before:w-10 before:rounded-full before:bg-white/85",
};

const VoiceSideScrollerObstacleSprite = ({
  kind,
}: VoiceSideScrollerObstacleSpriteProps) => {
  if (kind === "parasol-edge") {
    return (
      <img
        alt=""
        className="h-full w-full rotate-[16deg] object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.15)]"
        draggable={false}
        src={beachObjectStickerUrls.parasol}
      />
    );
  }

  return <div className={`relative h-full w-full ${shapeClassNames[kind]}`} />;
};

VoiceSideScrollerObstacleSprite.displayName = "VoiceSideScrollerObstacleSprite";

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
        <VoiceSideScrollerObstacleSprite kind={obstacle.kind} />
      </div>
    ))}
  </div>
);

VoiceSideScrollerObstacleLayer.displayName = "VoiceSideScrollerObstacleLayer";
