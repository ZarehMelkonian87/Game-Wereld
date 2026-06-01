import type { WorldDefinition } from "../../types";
import type { DevtoolsComponent } from "./devtools";
import { FeaturedWorldCard } from "./FeaturedWorldCard";
import { WorldCard } from "./WorldCard";

interface WorldSelectLayoutProps {
  onSelectWorld: (world: WorldDefinition) => void;
  selectedWorld: WorldDefinition;
  worlds: readonly WorldDefinition[];
}

export const WorldSelectLayout: DevtoolsComponent<WorldSelectLayoutProps> = ({
  onSelectWorld,
  selectedWorld,
  worlds,
}: WorldSelectLayoutProps) => (
  <div
    className="absolute bottom-[max(5.3rem,calc(env(safe-area-inset-bottom)+5rem))] left-3 right-auto top-[5.25rem] z-10 grid min-h-0 w-[calc(100vw-1.5rem)] grid-rows-[8.6rem_minmax(0,1fr)] gap-2.5 landscape:bottom-4 landscape:left-[1.1rem] landscape:right-[1.1rem] landscape:top-[4.65rem] landscape:w-auto landscape:grid-cols-[minmax(250px,36%)_minmax(0,1fr)] landscape:grid-rows-1 landscape:gap-3.5"
    data-component="WorldSelectLayout"
    data-selected-world-id={selectedWorld.id}
  >
    <FeaturedWorldCard world={selectedWorld} />

    <div
      className="grid min-h-0 min-w-0 grid-cols-2 gap-2 landscape:grid-cols-3"
      data-slot="world-grid"
    >
      {worlds.map((world) => (
        <WorldCard
          key={world.id}
          onSelect={onSelectWorld}
          selected={world.id === selectedWorld.id}
          world={world}
        />
      ))}
    </div>
  </div>
);

WorldSelectLayout.displayName = "WorldSelectLayout";
