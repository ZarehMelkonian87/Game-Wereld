import type { DevtoolsComponent } from "./devtools";
import { AdventureBottomNavigation } from "./AdventureBottomNavigation";
import { AdventureStartButton } from "./AdventureStartButton";

interface AdventureActionZoneProps {
  disableStart: boolean;
  onOpenRewards: () => void;
  onOpenSettings: () => void;
  onStart: () => void;
}

export const AdventureActionZone: DevtoolsComponent<AdventureActionZoneProps> = ({
  disableStart,
  onOpenRewards,
  onOpenSettings,
  onStart,
}: AdventureActionZoneProps) => (
  <div
    className="absolute bottom-[max(0.65rem,env(safe-area-inset-bottom))] left-3 right-3 z-30 grid gap-2"
    data-component="AdventureActionZone"
  >
    <AdventureStartButton disabled={disableStart} onStart={onStart} />
    <AdventureBottomNavigation onOpenRewards={onOpenRewards} onOpenSettings={onOpenSettings} />
  </div>
);

AdventureActionZone.displayName = "AdventureActionZone";
