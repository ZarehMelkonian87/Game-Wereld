import type { BezemEscapeMode } from "../../types";
import { getAdventureModeOptions } from "./adventureModeOptions";
import { CompactGameModeCard } from "./CompactGameModeCard";
import type { DevtoolsComponent } from "./devtools";

interface CompactGameModeListProps {
  onSelectMode: (modeId: BezemEscapeMode) => void;
  raceUnlocked: boolean;
  selectedModeId: BezemEscapeMode;
}

export const CompactGameModeList: DevtoolsComponent<CompactGameModeListProps> = ({
  onSelectMode,
  raceUnlocked,
  selectedModeId,
}: CompactGameModeListProps) => (
  <div className="grid gap-2" data-component="CompactGameModeList">
    {getAdventureModeOptions(raceUnlocked).map((mode) => (
      <CompactGameModeCard
        key={mode.id}
        mode={mode}
        onSelectMode={onSelectMode}
        selected={mode.id === selectedModeId}
      />
    ))}
  </div>
);

CompactGameModeList.displayName = "CompactGameModeList";
