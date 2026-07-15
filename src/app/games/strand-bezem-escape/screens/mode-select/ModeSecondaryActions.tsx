import { BarChart3, Gift, Settings } from "lucide-react";
import type { DevtoolsComponent } from "./devtools";
import { SecondaryActionButton } from "./SecondaryActionButton";

interface ModeSecondaryActionsProps {
  onOpenDashboard: () => void;
  onOpenRewards: () => void;
  onOpenSettings: () => void;
}

export const ModeSecondaryActions: DevtoolsComponent<ModeSecondaryActionsProps> = ({
  onOpenDashboard,
  onOpenRewards,
  onOpenSettings,
}) => (
  <div
    className="grid min-h-0 grid-cols-3 gap-2 landscape:grid-cols-1 landscape:content-center landscape:gap-3"
    data-component="ModeSecondaryActions"
  >
    <SecondaryActionButton
      icon={<Gift className="h-5 w-5" strokeWidth={3} />}
      onClick={onOpenRewards}
      testId="mode-rewards-button"
      tone="amber"
    >
      Beloning
    </SecondaryActionButton>
    <SecondaryActionButton
      icon={<BarChart3 className="h-5 w-5" strokeWidth={3} />}
      onClick={onOpenDashboard}
      testId="mode-dashboard-button"
      tone="sky"
    >
      Groei
    </SecondaryActionButton>
    <SecondaryActionButton
      icon={<Settings className="h-5 w-5" strokeWidth={3} />}
      onClick={onOpenSettings}
      testId="mode-settings-button"
      tone="white"
    >
      Opties
    </SecondaryActionButton>
  </div>
);

ModeSecondaryActions.displayName = "ModeSecondaryActions";
