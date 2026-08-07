import { Star } from "lucide-react";
import { voiceSideScrollerObjectSpriteUrls } from "../../asset-urls";
import { classNames } from "../../components/ui/classNames";
import type { VoiceSideScrollerTarget } from "./voiceSideScrollerModel";

interface VoiceSideScrollerTargetLayerProps {
  targets: VoiceSideScrollerTarget[];
}

export const VoiceSideScrollerTargetLayer = ({ targets }: VoiceSideScrollerTargetLayerProps) => (
  <div
    aria-hidden
    className="absolute inset-0 z-20"
    data-component="VoiceSideScrollerTargetLayer"
    data-testid="voice-side-scroller-target-layer"
  >
    {targets.map((target) => {
      const objectUrl =
        voiceSideScrollerObjectSpriteUrls[
          target.assetId as keyof typeof voiceSideScrollerObjectSpriteUrls
        ];

      if (!objectUrl) {
        return null;
      }

      return (
        <div
          className={classNames(
            "absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150 landscape:h-24 landscape:w-24",
            "drop-shadow-[0_5px_0_rgba(21,48,74,0.15)]",
            target.collected && "scale-75 opacity-0",
          )}
          data-active="false"
          data-collectible-label={target.collectibleLabel}
          data-testid={`voice-side-scroller-target-${target.assetId}`}
          key={target.id}
          style={{
            left: `${target.x * 100}%`,
            top: `${target.y * 100}%`,
          }}
        >
          <Star
            className="absolute -right-1 -top-1 h-9 w-9 text-amber-300 drop-shadow-[0_2px_0_rgba(180,83,9,0.22)]"
            fill="currentColor"
            strokeWidth={2.5}
          />
          <img
            alt=""
            className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] object-contain"
            draggable={false}
            src={objectUrl}
          />
        </div>
      );
    })}
  </div>
);

VoiceSideScrollerTargetLayer.displayName = "VoiceSideScrollerTargetLayer";
