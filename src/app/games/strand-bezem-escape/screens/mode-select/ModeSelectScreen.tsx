import type { DevtoolsComponent } from "./devtools";
import { ModeGrid } from "./ModeGrid";
import { ModeSecondaryActions } from "./ModeSecondaryActions";
import { ModeSelectBackground } from "./ModeSelectBackground";
import { ModeSelectHeader } from "./ModeSelectHeader";

interface ModeSelectScreenProps {
  onChooseWorld: () => void;
  onOpenDashboard: () => void;
  onOpenRewards: () => void;
  onOpenSettings: () => void;
  onStartSceneBuilder: () => void;
  onStartWordChoice: () => void;
}

export const ModeSelectScreen: DevtoolsComponent<ModeSelectScreenProps> = ({
  onChooseWorld,
  onOpenDashboard,
  onOpenRewards,
  onOpenSettings,
  onStartSceneBuilder,
  onStartWordChoice,
}) => (
  <section
    aria-label="Spelkeuze"
    className="pointer-events-auto absolute inset-0 z-10 overflow-hidden text-slate-900"
    data-component="ModeSelectScreen"
    data-testid="mode-select-screen"
  >
    <ModeSelectBackground />
    <ModeSelectHeader onChooseWorld={onChooseWorld} />

    <div
      className="absolute bottom-[max(0.8rem,env(safe-area-inset-bottom))] left-3 right-3 top-[5.25rem] z-10 grid min-h-0 grid-rows-[minmax(0,1fr)_4rem] gap-2.5 landscape:bottom-4 landscape:left-4 landscape:right-4 landscape:top-[4.65rem] landscape:grid-cols-[minmax(0,1fr)_9.25rem] landscape:grid-rows-1 landscape:gap-3"
      data-slot="mode-select-layout"
    >
      <ModeGrid
        onStartSceneBuilder={onStartSceneBuilder}
        onStartWordChoice={onStartWordChoice}
      />
      <ModeSecondaryActions
        onOpenDashboard={onOpenDashboard}
        onOpenRewards={onOpenRewards}
        onOpenSettings={onOpenSettings}
      />
    </div>
  </section>
);

ModeSelectScreen.displayName = "ModeSelectScreen";
