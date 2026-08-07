import type { KeyboardEvent } from "react";
import { BtnManualFlyDown, BtnManualFlyUp } from "../../components/ui";

interface VoiceSideScrollerMovementControlsProps {
  disabled: boolean;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRelease: () => void;
}

export const VoiceSideScrollerMovementControls = ({
  disabled,
  onMoveDown,
  onMoveUp,
  onRelease,
}: VoiceSideScrollerMovementControlsProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, direction: "down" | "up") => {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }
    event.preventDefault();
    if (direction === "up") {
      onMoveUp();
    } else {
      onMoveDown();
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    onRelease();
  };

  return (
    <div
      aria-label="Vliegknoppen"
      className="grid grid-cols-2 gap-2 landscape:grid-cols-1"
      data-component="VoiceSideScrollerMovementControls"
      data-testid="voice-side-scroller-movement-controls"
    >
      <div
        onKeyDown={(e) => handleKeyDown(e, "up")}
        onKeyUp={handleKeyUp}
        onPointerCancel={onRelease}
        onPointerDown={disabled ? undefined : onMoveUp}
        onPointerLeave={onRelease}
        onPointerUp={onRelease}
      >
        <BtnManualFlyUp className="w-full h-14 justify-center" />
      </div>
      <div
        onKeyDown={(e) => handleKeyDown(e, "down")}
        onKeyUp={handleKeyUp}
        onPointerCancel={onRelease}
        onPointerDown={disabled ? undefined : onMoveDown}
        onPointerLeave={onRelease}
        onPointerUp={onRelease}
      >
        <BtnManualFlyDown className="w-full h-14 justify-center" />
      </div>
    </div>
  );
};

VoiceSideScrollerMovementControls.displayName = "VoiceSideScrollerMovementControls";
