import { voiceSideScrollerAvatarStateUrls } from "../../asset-urls";

interface VoiceSideScrollerPlayerProps {
  isSlowed: boolean;
  playerY: number;
  speed: number;
}

const getBroomState = (isSlowed: boolean, speed: number) => {
  if (isSlowed) {
    return "slowed";
  }

  if (speed >= 4) {
    return "boosted";
  }

  return "flying";
};

export const VoiceSideScrollerPlayer = ({
  isSlowed,
  playerY,
  speed,
}: VoiceSideScrollerPlayerProps) => (
  <div
    aria-hidden
    className="absolute left-[12%] z-30 h-24 w-28 will-change-transform"
    data-asset-state={getBroomState(isSlowed, speed)}
    data-slowed={isSlowed ? "true" : "false"}
    data-component="VoiceSideScrollerPlayer"
    data-testid="voice-side-scroller-player"
    style={{
      top: `${playerY * 100}%`,
      transform: "translateY(-50%)",
    }}
  >
    <div
      className={
        isSlowed
          ? "bezem-scroller-bump relative h-full w-full"
          : "bezem-scroller-float relative h-full w-full"
      }
    >
      <img
        alt=""
        className="absolute -top-1 left-8 h-20 w-20 object-contain drop-shadow-[0_5px_0_rgba(21,48,74,0.18)]"
        draggable={false}
        src={
          isSlowed
            ? voiceSideScrollerAvatarStateUrls.slowed
            : voiceSideScrollerAvatarStateUrls.flying
        }
      />
    </div>
  </div>
);

VoiceSideScrollerPlayer.displayName = "VoiceSideScrollerPlayer";
