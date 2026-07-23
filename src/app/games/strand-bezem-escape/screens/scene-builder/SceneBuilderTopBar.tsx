import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import type { KeyboardEvent } from "react";
import { GameButton, GameIconButton, GameStarCounter, HintButton } from "../../../../game-platform";

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
  isCorrectFeedback,
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
      className="pointer-events-auto grid min-h-14 grid-cols-[auto_1fr_auto_auto] items-center gap-2"
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
      <HintButton
        onClick={onHint}
        onMouseDown={onHintPointerDown}
        onPointerDown={onHintPointerDown}
        onTouchStart={onHintPointerDown}
        showLabel={false}
      />
      <GameButton
        aria-label={actionLabel}
        className="min-h-12 rounded-2xl px-3 text-sm shadow-[0_3px_0_rgba(4,120,87,0.75)]"
        data-testid="scene-builder-confirm-button"
        iconLeft={
          isCorrectFeedback ? (
            <Sparkles className="h-5 w-5" strokeWidth={3} />
          ) : (
            <CheckCircle2 className="h-5 w-5" strokeWidth={3} />
          )
        }
        onClick={onAction}
        onKeyDown={handleActionKeyDown}
        size="compact"
        tone="green"
      >
        {actionLabel}
      </GameButton>
    </header>
  );
};

SceneBuilderTopBar.displayName = "SceneBuilderTopBar";
