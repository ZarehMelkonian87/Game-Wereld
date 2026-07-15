import type { BezemEscapeMode, WorldDefinition } from "../../types";
import { AdventureSectionTitle } from "./AdventureSectionTitle";
import { CompactGameModeList } from "./CompactGameModeList";
import { CompactWorldGrid } from "./CompactWorldGrid";
import type { DevtoolsComponent } from "./devtools";
import { FeaturedAdventureWorldCard } from "./FeaturedAdventureWorldCard";

interface AdventureSelectContentProps {
  onSelectMode: (modeId: BezemEscapeMode) => void;
  onSelectWorld: (world: WorldDefinition) => void;
  selectedModeId: BezemEscapeMode;
  selectedWorld: WorldDefinition;
  worlds: readonly WorldDefinition[];
}

export const AdventureSelectContent: DevtoolsComponent<AdventureSelectContentProps> = ({
  onSelectMode,
  onSelectWorld,
  selectedModeId,
  selectedWorld,
  worlds,
}: AdventureSelectContentProps) => (
  <div
    className="absolute bottom-[calc(env(safe-area-inset-bottom)+9.5rem)] left-3 right-3 top-[5.1rem] z-10 overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5"
    data-component="AdventureSelectContent"
  >
    <div className="grid gap-2.5 pb-2" data-slot="content-stack">
      <AdventureSectionTitle>Kies wereld</AdventureSectionTitle>
      <FeaturedAdventureWorldCard world={selectedWorld} />
      <CompactWorldGrid
        onSelectWorld={onSelectWorld}
        selectedWorldId={selectedWorld.id}
        worlds={worlds}
      />

      <AdventureSectionTitle>Kies spel</AdventureSectionTitle>
      <CompactGameModeList
        onSelectMode={onSelectMode}
        selectedModeId={selectedModeId}
      />
    </div>
  </div>
);

AdventureSelectContent.displayName = "AdventureSelectContent";
