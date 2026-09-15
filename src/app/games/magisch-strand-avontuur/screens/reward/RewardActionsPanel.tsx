import { BtnActionReplay, BtnActionWorld, PanelCard } from "../../components/ui";
import { classNames } from "../../components/ui/classNames";

interface RewardActionsPanelProps {
  onChooseWorld?: () => void;
  onPlayAgain?: () => void;
  /**
   * Toon de "Opnieuw"-knop. Uit wanneer het beloningsscherm als **overzicht**
   * vanuit het menu wordt geopend (het kind zat niet in een spel), zodat er
   * alleen een terug-naar-menu-knop is.
   */
  showPlayAgain?: boolean;
}

export const RewardActionsPanel = ({
  onChooseWorld,
  onPlayAgain,
  showPlayAgain = true,
}: RewardActionsPanelProps) => (
  <div className="contents" data-component="RewardActionsPanel">
    <PanelCard
      aria-label="Beloning acties"
      className={classNames(
        "mx-auto grid min-h-[5.5rem] w-full max-w-[42rem] items-center gap-2 !rounded-[1.5rem] !p-2",
        showPlayAgain ? "grid-cols-2" : "grid-cols-1",
      )}
      data-testid="reward-action-area"
    >
      {showPlayAgain ? (
        <BtnActionReplay
          data-testid="reward-play-again-button"
          onClick={onPlayAgain ?? (() => undefined)}
        />
      ) : null}
      <BtnActionWorld
        data-testid="reward-world-button"
        onClick={onChooseWorld ?? (() => undefined)}
      />
    </PanelCard>
  </div>
);

RewardActionsPanel.displayName = "RewardActionsPanel";
