import { BookOpen, LockKeyhole, MessageCircle } from "lucide-react";
import { broomIconUrls } from "../../asset-urls";
import type { DevtoolsComponent } from "./devtools";
import { ModeCard } from "./ModeCard";

interface ModeGridProps {
  onStartRace: () => void;
  onStartSceneBuilder: () => void;
  onStartWordChoice: () => void;
  raceUnlocked: boolean;
}

export const ModeGrid: DevtoolsComponent<ModeGridProps> = ({
  onStartRace,
  onStartSceneBuilder,
  onStartWordChoice,
  raceUnlocked,
}) => (
  <div
    className="grid min-h-0 grid-rows-3 gap-2.5 landscape:grid-cols-3 landscape:grid-rows-1"
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

    <ModeCard
      description="Vlieg met de bezem door korte taalopdrachten."
      disabled={!raceUnlocked}
      icon={
        raceUnlocked ? (
          <img alt="" className="h-10 w-10 object-contain" draggable={false} src={broomIconUrls.basic} />
        ) : (
          <LockKeyhole className="h-8 w-8" strokeWidth={3} />
        )
      }
      id="race"
      lockedLabel={raceUnlocked ? undefined : "Eerst scene klaar"}
      onSelect={onStartRace}
      title={raceUnlocked ? "Bezem Race" : "Race gesloten"}
      tone="amber"
    />
  </div>
);

ModeGrid.displayName = "ModeGrid";
