import { Globe2, Home, RotateCcw } from "lucide-react";
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
      className="mx-auto grid min-h-[5.5rem] w-full max-w-[42rem] grid-cols-3 items-center gap-2 !rounded-[1.5rem] !p-2"
      data-testid="reward-action-area"
    >
      <PrimaryActionButton
        aria-label="Opnieuw spelen"
        className="pointer-events-auto h-14 min-w-0 px-1.5 text-[0.78rem]"
        data-testid="reward-play-again-button"
        iconLeft={<RotateCcw className="h-5 w-5" strokeWidth={3} />}
        onClick={onPlayAgain}
        size="compact"
      >
        Opnieuw
      </PrimaryActionButton>
      <PrimaryActionButton
        aria-label="Terug naar wereldkeuze"
        className="pointer-events-auto h-14 min-w-0 px-1.5 text-[0.78rem]"
        data-testid="reward-world-button"
        iconLeft={<Globe2 className="h-5 w-5" strokeWidth={3} />}
        onClick={onChooseWorld}
        size="compact"
      >
        Wereld
      </PrimaryActionButton>
      <PrimaryActionButton
        aria-label="Terug naar menu"
        className="pointer-events-auto h-14 min-w-0 px-1.5 text-[0.78rem]"
        data-testid="reward-menu-button"
        iconLeft={<Home className="h-5 w-5" strokeWidth={3} />}
        onClick={onBackToMenu}
        size="compact"
      >
        Menu
      </PrimaryActionButton>
    </PanelCard>
  </div>
);

RewardActionsPanel.displayName = "RewardActionsPanel";
