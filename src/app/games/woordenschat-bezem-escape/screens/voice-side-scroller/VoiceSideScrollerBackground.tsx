import { beachBackgrounds } from "../../asset-urls";

interface VoiceSideScrollerBackgroundProps {
  scrollX: number;
}

export const VoiceSideScrollerBackground = ({
  scrollX,
}: VoiceSideScrollerBackgroundProps) => (
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
    <div
      className="absolute inset-x-0 top-0 h-[36%] opacity-80"
      data-layer="slow-sky"
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0 10%, rgba(255,255,255,0.78) 12% 18%, transparent 22% 48%, rgba(255,255,255,0.72) 52% 58%, transparent 64% 100%)",
        backgroundPositionX: `${-Math.round(scrollX * 260)}px`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "34rem 100%",
      }}
    />
    <div
      className="absolute inset-x-0 top-[43%] h-[16%] opacity-70"
      data-layer="sea-waves"
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0 8%, rgba(255,255,255,0.76) 10% 18%, transparent 22% 42%, rgba(255,255,255,0.7) 46% 54%, transparent 60% 100%)",
        backgroundPositionX: `${-Math.round(scrollX * 680)}px`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "24rem 100%",
      }}
    />
    <div
      className="absolute inset-x-0 bottom-0 h-[30%] opacity-50"
      data-layer="fast-sand"
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0 14%, rgba(255,255,255,0.38) 16% 18%, transparent 22% 50%, rgba(255,255,255,0.32) 54% 56%, transparent 62% 100%)",
        backgroundPositionX: `${-Math.round(scrollX * 920)}px`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "28rem 100%",
      }}
    />
  </div>
);

VoiceSideScrollerBackground.displayName = "VoiceSideScrollerBackground";
