import type { WorldDefinition } from "../../types";
import type { DevtoolsComponent } from "./devtools";
import { CompactWorldCard } from "./CompactWorldCard";

interface CompactWorldGridProps {
  onSelectWorld: (world: WorldDefinition) => void;
  selectedWorldId: string;
  worlds: readonly WorldDefinition[];
}

export const CompactWorldGrid: DevtoolsComponent<CompactWorldGridProps> = ({
  onSelectWorld,
  selectedWorldId,
  worlds,
}: CompactWorldGridProps) => (
  <div
    className="grid min-w-0 grid-cols-3 gap-2"
    data-component="CompactWorldGrid"
    data-selected-world-id={selectedWorldId}
  >
    {worlds.map((world) => (
      <CompactWorldCard
        key={world.id}
        onSelect={onSelectWorld}
        selected={world.id === selectedWorldId}
        world={world}
      />
    ))}
  </div>
);

CompactWorldGrid.displayName = "CompactWorldGrid";
