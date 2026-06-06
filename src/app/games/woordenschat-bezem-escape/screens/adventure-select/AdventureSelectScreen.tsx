import { useMemo, useState } from "react";
import type { BezemEscapeMode, WorldDefinition } from "../../types";
import { WorldSelectBackground } from "../world-select/WorldSelectBackground";
import { WorldSelectMessage } from "../world-select/WorldSelectMessage";
import { AdventureActionZone } from "./AdventureActionZone";
import { AdventureSelectContent } from "./AdventureSelectContent";
import { AdventureSelectHeader } from "./AdventureSelectHeader";
import type { DevtoolsComponent } from "./devtools";

interface AdventureSelectScreenProps {
  onBackToStart: () => void;
  onOpenDashboard: () => void;
  onOpenRewards: () => void;
  onOpenSettings: () => void;
  onSelectWorld: (worldId: string) => void;
  onStartMode: (modeId: BezemEscapeMode) => void;
  selectedWorldId: string;
  starCount?: number;
  worlds: readonly WorldDefinition[];
}

export const AdventureSelectScreen: DevtoolsComponent<AdventureSelectScreenProps> = ({
  onBackToStart,
  onOpenDashboard,
  onOpenRewards,
  onOpenSettings,
  onSelectWorld,
  onStartMode,
  selectedWorldId,
  starCount = 120,
  worlds,
}: AdventureSelectScreenProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [selectedModeId, setSelectedModeId] = useState<BezemEscapeMode>("listen-and-place");
  const selectedWorld = useMemo(
    () => worlds.find((world) => world.id === selectedWorldId) ?? worlds[0],
    [selectedWorldId, worlds],
  );
  const disableStart = !selectedWorld || selectedWorld.status !== "open";

  const handleSelectWorld = (world: WorldDefinition) => {
    if (world.status !== "open") {
      setMessage(`${world.title} komt later.`);
      return;
    }

    setMessage(null);
    onSelectWorld(world.id);
  };

  const handleSelectMode = (modeId: BezemEscapeMode) => {
    setMessage(null);
    setSelectedModeId(modeId);
  };

  const handleStart = () => {
    if (disableStart) {
      return;
    }

    onStartMode(selectedModeId);
  };

  if (!selectedWorld) {
    return null;
  }

  return (
    <section
      aria-label="Avontuur kiezen"
      className="pointer-events-auto absolute inset-0 z-10 overflow-hidden text-slate-900"
      data-component="AdventureSelectScreen"
      data-selected-mode-id={selectedModeId}
      data-selected-world-id={selectedWorld.id}
      data-testid="adventure-select-screen"
    >
      <WorldSelectBackground />
      <AdventureSelectHeader onBackToStart={onBackToStart} starCount={starCount} />
      <AdventureSelectContent
        onSelectMode={handleSelectMode}
        onSelectWorld={handleSelectWorld}
        selectedModeId={selectedModeId}
        selectedWorld={selectedWorld}
        worlds={worlds}
      />
      {message ? <WorldSelectMessage message={message} /> : null}
      <AdventureActionZone
        disableStart={disableStart}
        onOpenDashboard={onOpenDashboard}
        onOpenRewards={onOpenRewards}
        onOpenSettings={onOpenSettings}
        onStart={handleStart}
      />
    </section>
  );
};

AdventureSelectScreen.displayName = "AdventureSelectScreen";
