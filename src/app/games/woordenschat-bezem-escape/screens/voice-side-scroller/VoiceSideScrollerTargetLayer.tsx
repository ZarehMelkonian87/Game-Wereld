import { Star } from "lucide-react";
import { getBeachObjectStickerUrl } from "../../asset-urls";
import { classNames } from "../../components/ui/classNames";
import type { VoiceSideScrollerTarget } from "./voiceSideScrollerModel";

interface VoiceSideScrollerTargetLayerProps {
  activeTargetId?: string;
  targets: VoiceSideScrollerTarget[];
}

export const VoiceSideScrollerTargetLayer = ({
  activeTargetId,
  targets,
}: VoiceSideScrollerTargetLayerProps) => (
  <div
    aria-hidden
    className="absolute inset-0 z-20"
    data-component="VoiceSideScrollerTargetLayer"
    data-testid="voice-side-scroller-target-layer"
  >
    {targets.map((target) => {
      const objectUrl = getBeachObjectStickerUrl(target.assetId);
      const isActive = target.id === activeTargetId;

      if (!objectUrl) {
        return null;
      }

      return (
        <div
          className={classNames(
            "absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 landscape:h-24 landscape:w-24",
            isActive
              ? "scale-110 drop-shadow-[0_0_18px_rgba(250,204,21,0.85)]"
              : "drop-shadow-[0_5px_0_rgba(21,48,74,0.15)]",
            target.collected && "scale-75 opacity-0",
          )}
          data-active={isActive ? "true" : "false"}
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
