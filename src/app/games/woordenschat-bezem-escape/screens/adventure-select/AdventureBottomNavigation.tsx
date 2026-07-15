import { Gift, Settings } from "lucide-react";
import { PanelCard } from "../../components/ui";
import { SecondaryActionButton } from "../mode-select/SecondaryActionButton";
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
    <SecondaryActionButton
      icon={<Gift className="h-5 w-5" strokeWidth={3} />}
      onClick={onOpenRewards}
      testId="adventure-rewards-button"
      tone="amber"
    >
      Beloning
    </SecondaryActionButton>
    <SecondaryActionButton
      icon={<Settings className="h-5 w-5" strokeWidth={3} />}
      onClick={onOpenSettings}
      testId="adventure-settings-button"
      tone="white"
    >
      Opties
    </SecondaryActionButton>
  </PanelCard>
);

AdventureBottomNavigation.displayName = "AdventureBottomNavigation";
