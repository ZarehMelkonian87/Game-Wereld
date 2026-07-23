import { ArrowDown, ArrowUp } from "lucide-react";
import type { KeyboardEvent } from "react";
import { PrimaryActionButton } from "../../components/ui";

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
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, direction: "down" | "up") => {
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

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
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
      <PrimaryActionButton
        aria-label="Omhoog vliegen"
        className="h-14 min-w-0 touch-none select-none text-sm"
        disabled={disabled}
        iconLeft={<ArrowUp className="h-5 w-5" strokeWidth={3.5} />}
        onKeyDown={(event) => handleKeyDown(event, "up")}
        onKeyUp={handleKeyUp}
        onPointerCancel={onRelease}
        onPointerDown={onMoveUp}
        onPointerLeave={onRelease}
        onPointerUp={onRelease}
        size="compact"
      >
        Omhoog
      </PrimaryActionButton>
      <PrimaryActionButton
        aria-label="Omlaag vliegen"
        className="h-14 min-w-0 touch-none select-none text-sm"
        disabled={disabled}
        iconLeft={<ArrowDown className="h-5 w-5" strokeWidth={3.5} />}
        onKeyDown={(event) => handleKeyDown(event, "down")}
        onKeyUp={handleKeyUp}
        onPointerCancel={onRelease}
        onPointerDown={onMoveDown}
        onPointerLeave={onRelease}
        onPointerUp={onRelease}
        size="compact"
      >
        Omlaag
      </PrimaryActionButton>
    </div>
  );
};

VoiceSideScrollerMovementControls.displayName = "VoiceSideScrollerMovementControls";
