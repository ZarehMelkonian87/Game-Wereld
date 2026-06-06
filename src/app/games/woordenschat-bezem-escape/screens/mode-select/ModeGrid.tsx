import { BookOpen, MessageCircle } from "lucide-react";
import type { DevtoolsComponent } from "./devtools";
import { ModeCard } from "./ModeCard";

interface ModeGridProps {
  onStartSceneBuilder: () => void;
  onStartWordChoice: () => void;
}

export const ModeGrid: DevtoolsComponent<ModeGridProps> = ({
  onStartSceneBuilder,
  onStartWordChoice,
}) => (
  <div
    className="grid min-h-0 grid-rows-2 gap-2.5 landscape:grid-cols-2 landscape:grid-rows-1"
    data-component="ModeGrid"
  >
    <ModeCard
      description="Luister, spreek of typ en zet het plaatje op de goede plek."
      icon={<MessageCircle className="h-8 w-8" strokeWidth={3} />}
      id="listen-place"
      onSelect={onStartSceneBuilder}
      title="Zeg & Zet"
      tone="emerald"
    />

    <ModeCard
      description="Hoor een woord en kies het juiste plaatje."
      icon={<BookOpen className="h-8 w-8" strokeWidth={3} />}
      id="choose-word"
      onSelect={onStartWordChoice}
      title="Kies het Woord"
      tone="sky"
    />
  </div>
);

ModeGrid.displayName = "ModeGrid";
