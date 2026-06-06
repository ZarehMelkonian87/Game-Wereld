import { getBeachObjectStickerUrl } from "../../asset-urls";
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
        <img
          alt=""
          className={[
            "absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 object-contain transition-transform duration-200 landscape:h-20 landscape:w-20",
            isActive ? "scale-110 drop-shadow-[0_0_18px_rgba(250,204,21,0.85)]" : "drop-shadow-[0_5px_0_rgba(21,48,74,0.15)]",
          ].join(" ")}
          data-active={isActive ? "true" : "false"}
          data-testid={`voice-side-scroller-target-${target.assetId}`}
          draggable={false}
          key={target.id}
          src={objectUrl}
          style={{
            left: `${target.x * 100}%`,
            opacity: target.collected ? 0 : 1,
            top: `${target.y * 100}%`,
          }}
        />
      );
    })}
  </div>
);

VoiceSideScrollerTargetLayer.displayName = "VoiceSideScrollerTargetLayer";
