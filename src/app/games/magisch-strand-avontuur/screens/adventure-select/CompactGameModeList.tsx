import type { BezemEscapeMode } from "../../types";
import { getAdventureModeOptions } from "./adventureModeOptions";
import { CompactGameModeCard } from "./CompactGameModeCard";
import type { DevtoolsComponent } from "./devtools";

interface CompactGameModeListProps {
  onSelectMode: (modeId: BezemEscapeMode) => void;
  selectedModeId: BezemEscapeMode;
  totalWordStars: number;
}

export const CompactGameModeList: DevtoolsComponent<CompactGameModeListProps> = ({
  onSelectMode,
  selectedModeId,
  totalWordStars,
}: CompactGameModeListProps) => (
  <div className="grid gap-2" data-component="CompactGameModeList">
    {getAdventureModeOptions(totalWordStars).map((mode) => (
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
