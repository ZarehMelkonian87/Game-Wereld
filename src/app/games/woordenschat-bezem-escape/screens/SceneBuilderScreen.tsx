import { beachObjectStickerUrls } from "../asset-urls";
import {
  GameplayStatusBar,
  InstructionBubble,
  ObjectTrayContainer,
  ObjectStickerButton,
  PanelCard,
} from "../components/ui";

interface SceneBuilderScreenProps {
  instructionText?: string;
  showTrayLabels?: boolean;
}

const testTrayObjects = [
  { id: "dolfijn", label: "Dolfijn", imageUrl: beachObjectStickerUrls.dolfijn },
  { id: "boot", label: "Boot", imageUrl: beachObjectStickerUrls.boot },
  { id: "vuurtoren", label: "Vuurtoren", imageUrl: beachObjectStickerUrls.vuurtoren },
];

export function SceneBuilderScreen({
  instructionText = "Zet de boot in het water.",
  showTrayLabels = true,
}: SceneBuilderScreenProps) {
  return (
    <div
      data-testid="scene-builder-screen"
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <div className="grid h-full min-h-0 grid-rows-[4rem_minmax(0,1fr)_3rem_5rem] gap-2 landscape:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)] landscape:grid-rows-[4rem_minmax(0,1fr)_4.5rem]">
        <InstructionBubble
          aria-label="Opdrachtgebied"
          data-testid="scene-builder-instruction-area"
          text={instructionText}
          className="landscape:col-start-1 landscape:row-start-1"
        />

        <section
          aria-label="Scenegebied"
          data-testid="scene-builder-scene-area"
          className="min-h-0 rounded-[1.75rem] border-2 border-white/75 bg-white/5 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.18)] landscape:col-start-2 landscape:row-span-2 landscape:row-start-1"
        />

        <PanelCard
          aria-label="Statusgebied"
          data-testid="scene-builder-status-area"
          className="flex min-h-0 items-center !p-2 landscape:col-start-1 landscape:row-start-2 landscape:self-end landscape:!p-1.5"
        >
          <GameplayStatusBar speedMax={10} speedValue={6} starMax={30} starValue={18} />
        </PanelCard>

        <ObjectTrayContainer
          aria-label="Traygebied"
          data-testid="scene-builder-tray-area"
          className="landscape:col-span-2 landscape:row-start-3"
        >
          {testTrayObjects.map((object) => (
            <ObjectStickerButton
              imageUrl={object.imageUrl}
              key={object.id}
              label={object.label}
              showLabel={showTrayLabels}
              size="tray"
            />
          ))}
        </ObjectTrayContainer>
      </div>
    </div>
  );
}
