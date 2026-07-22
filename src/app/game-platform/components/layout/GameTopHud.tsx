import type { ReactNode } from "react";
import { ArrowLeft, Volume2 } from "lucide-react";
import { GameIconButton, GameStarCounter } from "../primitives";
import { HintButton } from "../gameplay/HintButton";

export interface GameTopHudProps {
  leftSlot?: ReactNode;
  onAudioClick?: () => void;
  onBackClick?: () => void;
  onBackToMenu?: () => void;
  onHintClick?: () => void;
  onHintPointerDown?: () => void;
  rightSlot?: ReactNode;
  showHint?: boolean;
  showParentBack?: boolean;
  starCount: number;
}

export const GameTopHud = ({
  leftSlot,
  onAudioClick,
  onBackClick,
  onBackToMenu,
  onHintClick,
  onHintPointerDown,
  rightSlot,
  showHint = true,
  showParentBack = false,
  starCount,
}: GameTopHudProps) => {
  const handleBack = onBackClick ?? onBackToMenu;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20"
      data-component="GameTopHud"
      data-testid="gameplay-top-hud"
      style={{
        paddingLeft: "calc(env(safe-area-inset-left) + 0.75rem)",
        paddingRight: "calc(env(safe-area-inset-right) + 0.75rem)",
        paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)",
      }}
    >
      <div className="grid grid-cols-[minmax(44px,1fr)_auto_minmax(44px,1fr)] items-start gap-2">
        <div className="flex justify-start gap-2" data-slot="left">
          {leftSlot}
          {showParentBack || handleBack ? (
            <GameIconButton
              className="pointer-events-auto"
              data-testid="parent-hold-back-button"
              icon={<ArrowLeft className="h-5 w-5" strokeWidth={3} />}
              label="Terug"
              onClick={handleBack}
              tone="white"
            />
          ) : null}
          <GameIconButton
            className="pointer-events-auto"
            icon={<Volume2 className="h-5 w-5" strokeWidth={3} />}
            label="Audio"
            onClick={onAudioClick}
            tone="blue"
          />
        </div>

        <div className="flex justify-center" data-slot="center">
          <GameStarCounter value={starCount} />
        </div>

        <div className="flex justify-end" data-slot="right">
          {rightSlot}
          {showHint ? (
            <HintButton
              className="pointer-events-auto"
              onClick={onHintClick}
              onMouseDown={onHintPointerDown}
              onPointerDown={onHintPointerDown}
              onTouchStart={onHintPointerDown}
              showLabel={false}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

GameTopHud.displayName = "GameTopHud";
