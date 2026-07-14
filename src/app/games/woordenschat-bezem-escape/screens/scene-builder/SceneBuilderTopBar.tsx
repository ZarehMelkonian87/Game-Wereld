import { ArrowLeft, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { GameButton, GameIconButton, GameStarCounter, HintButton } from "../../../../game-platform";

interface SceneBuilderTopBarProps {
  actionLabel: string;
  isCorrectFeedback: boolean;
  onAction: () => void;
  onHint: () => void;
  onHintPointerDown: () => void;
  starCount: number;
  showSubtitles: boolean;
  onToggleSubtitles: () => void;
}

export const SceneBuilderTopBar = ({
  actionLabel,
  isCorrectFeedback,
  onAction,
  onHint,
  onHintPointerDown,
  starCount,
  showSubtitles,
  onToggleSubtitles,
}: SceneBuilderTopBarProps) => (
  <header
    className="pointer-events-auto grid min-h-14 grid-cols-[auto_1fr_auto_auto_auto] items-center gap-2"
    data-component="SceneBuilderTopBar"
  >
    <GameIconButton
      className="bg-white/95"
      icon={
        <span className="relative flex h-6 w-6 items-center justify-center">
          <ArrowLeft className="h-5 w-5" strokeWidth={3} />
          <LockKeyhole
            className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-white text-slate-700"
            strokeWidth={3}
          />
        </span>
      }
      label="Ouder terug, houd vast"
      tone="white"
    />
    <div className="flex min-w-0 justify-start">
      <GameStarCounter value={starCount} />
    </div>
    <GameIconButton
      className={`min-h-11 min-w-11 rounded-2xl border-2 px-0 py-0 shadow-[0_3px_0_rgba(15,23,42,0.18)] active:shadow-none ${
        showSubtitles
          ? "border-emerald-500 bg-emerald-50 text-emerald-600"
          : "border-slate-300 bg-white text-slate-700 hover:bg-sky-50"
      }`}
      icon={<span className="font-black text-xs">CC</span>}
      label="Ondertiteling"
      onClick={onToggleSubtitles}
      tone="white"
    />
    <HintButton
      onClick={onHint}
      onMouseDown={onHintPointerDown}
      onPointerDown={onHintPointerDown}
      onTouchStart={onHintPointerDown}
      showLabel={false}
    />
    <GameButton
      aria-label={actionLabel}
      className="min-h-11 rounded-2xl px-3 text-sm shadow-[0_3px_0_rgba(4,120,87,0.75)]"
      data-testid="scene-builder-confirm-button"
      iconLeft={
        isCorrectFeedback ? (
          <Sparkles className="h-5 w-5" strokeWidth={3} />
        ) : (
          <CheckCircle2 className="h-5 w-5" strokeWidth={3} />
        )
      }
      onClick={onAction}
      size="compact"
      tone="green"
    >
      {actionLabel}
    </GameButton>
  </header>
);

SceneBuilderTopBar.displayName = "SceneBuilderTopBar";
