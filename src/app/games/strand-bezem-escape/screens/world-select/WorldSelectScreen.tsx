import { useMemo, useState } from "react";
import type { WorldDefinition } from "../../types";
import type { DevtoolsComponent } from "./devtools";
import { WorldSelectBackground } from "./WorldSelectBackground";
import { WorldSelectHeader } from "./WorldSelectHeader";
import { WorldSelectLayout } from "./WorldSelectLayout";
import { WorldSelectMessage } from "./WorldSelectMessage";
import { WorldStartButton } from "./WorldStartButton";

interface WorldSelectScreenProps {
  onBackToStart: () => void;
  onSelectWorld: (worldId: string) => void;
  onStartWorld: () => void;
  selectedWorldId: string;
  starCount?: number;
  worlds: readonly WorldDefinition[];
}

export const WorldSelectScreen: DevtoolsComponent<WorldSelectScreenProps> = ({
  onBackToStart,
  onSelectWorld,
  onStartWorld,
  selectedWorldId,
  starCount = 120,
  worlds,
}: WorldSelectScreenProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const selectedWorld = useMemo(
    () => worlds.find((world) => world.id === selectedWorldId) ?? worlds[0],
    [selectedWorldId, worlds],
  );

  const handleSelectWorld = (world: WorldDefinition) => {
    if (world.status !== "open") {
      setMessage(`${world.title} komt later.`);
      return;
    }

    setMessage(null);
    onSelectWorld(world.id);
  };

  if (!selectedWorld) {
    return null;
  }

  const canStartSelectedWorld = selectedWorld.status === "open";

  return (
    <section
      aria-label="Wereldkeuze"
      className="pointer-events-auto absolute inset-0 z-10 overflow-hidden text-slate-900"
      data-component="WorldSelectScreen"
      data-selected-world-id={selectedWorld.id}
      data-testid="world-select-screen"
    >
      <WorldSelectBackground />
      <WorldSelectHeader onBackToStart={onBackToStart} starCount={starCount} />
      <WorldSelectLayout
        onSelectWorld={handleSelectWorld}
        selectedWorld={selectedWorld}
        worlds={worlds}
      />
      {message ? <WorldSelectMessage message={message} /> : null}
      <WorldStartButton disabled={!canStartSelectedWorld} onStartWorld={onStartWorld} />
    </section>
  );
};

WorldSelectScreen.displayName = "WorldSelectScreen";
