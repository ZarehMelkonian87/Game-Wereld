import { beachBackgrounds } from "../../asset-urls";

interface VoiceSideScrollerBackgroundProps {
  scrollX: number;
}

export const VoiceSideScrollerBackground = ({ scrollX }: VoiceSideScrollerBackgroundProps) => (
  <div
    aria-hidden
    className="absolute inset-0 bg-sky-200"
    data-component="VoiceSideScrollerBackground"
    data-testid="voice-side-scroller-background"
  >
    <div
      className="absolute inset-0"
      data-layer="base-beach"
      style={{
        backgroundImage: `url(${beachBackgrounds.voiceSideScroller})`,
        backgroundPositionX: `${-Math.round(scrollX * 1200)}px`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
      }}
    />
  </div>
);

VoiceSideScrollerBackground.displayName = "VoiceSideScrollerBackground";
