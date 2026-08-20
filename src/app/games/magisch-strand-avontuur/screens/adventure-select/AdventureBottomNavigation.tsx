import { BtnSecondaryOptions, BtnSecondaryReward, PanelCard } from "../../components/ui";
import type { DevtoolsComponent } from "./devtools";

interface AdventureBottomNavigationProps {
  onOpenRewards: () => void;
  onOpenSettings: () => void;
}

export const AdventureBottomNavigation: DevtoolsComponent<AdventureBottomNavigationProps> = ({
  onOpenRewards,
  onOpenSettings,
}: AdventureBottomNavigationProps) => (
  <PanelCard
    aria-label="Avontuur navigatie"
    className="grid min-h-[4.25rem] grid-cols-2 gap-2 !rounded-[1.35rem] !p-2"
    data-component="AdventureBottomNavigation"
    data-testid="adventure-bottom-navigation"
  >
    <BtnSecondaryReward data-testid="adventure-rewards-button" onClick={onOpenRewards} />
    <BtnSecondaryOptions data-testid="adventure-settings-button" onClick={onOpenSettings} />
  </PanelCard>
);

AdventureBottomNavigation.displayName = "AdventureBottomNavigation";
