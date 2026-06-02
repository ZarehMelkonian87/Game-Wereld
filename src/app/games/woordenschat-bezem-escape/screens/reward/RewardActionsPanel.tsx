import { Home, RotateCcw, Sparkles } from "lucide-react";
import { PanelCard, PrimaryActionButton } from "../../components/ui";

interface RewardActionsPanelProps {
  onBackToMenu?: () => void;
  onChooseWorld?: () => void;
  onPlayAgain?: () => void;
}

export const RewardActionsPanel = ({
  onBackToMenu,
  onChooseWorld,
  onPlayAgain,
}: RewardActionsPanelProps) => (
  <div className="contents" data-component="RewardActionsPanel">
    <PanelCard
      aria-label="Beloning acties"
      className="grid min-h-0 grid-cols-3 items-center gap-2 !p-2 landscape:col-start-2 landscape:row-start-1 landscape:grid-cols-1 landscape:content-center landscape:gap-3"
      data-testid="reward-action-area"
    >
      <PrimaryActionButton
        aria-label="Nog een keer"
        className="pointer-events-auto h-14 px-2 text-sm"
        data-testid="reward-play-again-button"
        iconLeft={<RotateCcw className="h-5 w-5" strokeWidth={3} />}
        onClick={onPlayAgain}
      >
        Opnieuw
      </PrimaryActionButton>
      <PrimaryActionButton
        aria-label="Kies wereld"
        className="pointer-events-auto h-14 px-2 text-sm"
        data-testid="reward-world-button"
        iconLeft={<Sparkles className="h-5 w-5" strokeWidth={3} />}
        onClick={onChooseWorld}
      >
        Wereld
      </PrimaryActionButton>
      <PrimaryActionButton
        aria-label="Terug naar menu"
        className="pointer-events-auto h-14 px-2 text-sm"
        data-testid="reward-menu-button"
        iconLeft={<Home className="h-5 w-5" strokeWidth={3} />}
        onClick={onBackToMenu}
      >
        Menu
      </PrimaryActionButton>
    </PanelCard>
  </div>
);

RewardActionsPanel.displayName = "RewardActionsPanel";
