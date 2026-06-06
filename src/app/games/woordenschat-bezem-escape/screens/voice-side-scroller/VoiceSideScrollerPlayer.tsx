import { avatarIconUrls, broomIconUrls } from "../../asset-urls";

interface VoiceSideScrollerPlayerProps {
  playerY: number;
}

export const VoiceSideScrollerPlayer = ({
  playerY,
}: VoiceSideScrollerPlayerProps) => (
  <div
    aria-hidden
    className="absolute left-[12%] z-30 h-24 w-28 will-change-transform"
    data-component="VoiceSideScrollerPlayer"
    data-testid="voice-side-scroller-player"
    style={{
      top: `${playerY * 100}%`,
      transform: "translateY(-50%)",
    }}
  >
    <img
      alt=""
      className="absolute bottom-0 left-0 h-16 w-24 rotate-[-8deg] object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.18)]"
      draggable={false}
      src={broomIconUrls.basic}
    />
    <img
      alt=""
      className="absolute -top-1 left-8 h-20 w-20 object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.18)]"
      draggable={false}
      src={avatarIconUrls.avatar01}
    />
  </div>
);

VoiceSideScrollerPlayer.displayName = "VoiceSideScrollerPlayer";
