import { ArrowLeft } from "lucide-react";
import type { KeyboardEvent } from "react";
import { GameIconButton, GameStarCounter } from "../../../../game-platform";
import { BtnActionKlaar, BtnHintAssist } from "../../components/ui";

interface SceneBuilderTopBarProps {
  actionLabel: string;
  isCorrectFeedback: boolean;
  onAction: () => void;
  onBackToMenu?: () => void;
  onHint: () => void;
  onHintPointerDown: () => void;
  starCount: number;
}

export const SceneBuilderTopBar = ({
  actionLabel,
  isCorrectFeedback: _isCorrectFeedback,
  onAction,
  onBackToMenu,
  onHint,
  onHintPointerDown,
  starCount,
}: SceneBuilderTopBarProps) => {
  const handleActionKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    onAction();
  };

  return (
    <header
      className="pointer-events-auto grid min-h-14 grid-cols-[auto_1fr_auto_auto] items-center gap-2 rounded-[1.35rem] bg-white/45 p-1.5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.35)] backdrop-blur-md"
      data-component="SceneBuilderTopBar"
    >
      <GameIconButton
        className="bg-white/95"
        icon={<ArrowLeft className="h-5 w-5" strokeWidth={3} />}
        label="Terug"
        onClick={onBackToMenu}
        tone="white"
      />
      <div className="flex min-w-0 justify-start">
        <GameStarCounter value={starCount} />
      </div>
      <BtnHintAssist
        onClick={onHint}
        onMouseDown={onHintPointerDown}
        onPointerDown={onHintPointerDown}
        onTouchStart={onHintPointerDown}
        showLabel={false}
      />
      <BtnActionKlaar
        aria-label={actionLabel}
        className="min-h-12 rounded-2xl px-3 text-sm shadow-[0_3px_0_rgba(4,120,87,0.75)]"
        data-testid="scene-builder-confirm-button"
        label={actionLabel}
        onClick={onAction}
        onKeyDown={handleActionKeyDown}
      />
    </header>
  );
};

SceneBuilderTopBar.displayName = "SceneBuilderTopBar";
