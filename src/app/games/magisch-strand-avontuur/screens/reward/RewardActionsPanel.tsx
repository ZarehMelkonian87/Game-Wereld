import { BtnActionMenu, BtnActionReplay, BtnActionWorld, PanelCard } from "../../components/ui";

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
      <BtnActionReplay
        data-testid="reward-play-again-button"
        onClick={onPlayAgain ?? (() => undefined)}
      />
      <BtnActionWorld
        data-testid="reward-world-button"
        onClick={onChooseWorld ?? (() => undefined)}
      />
      <BtnActionMenu
        data-testid="reward-menu-button"
        onClick={onBackToMenu ?? (() => undefined)}
      />
    </PanelCard>
  </div>
);

RewardActionsPanel.displayName = "RewardActionsPanel";
