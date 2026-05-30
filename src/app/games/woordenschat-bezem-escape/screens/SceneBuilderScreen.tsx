import { broomIconUrls, getBeachObjectStickerUrl } from "../asset-urls";
import {
  GameplayStatusBar,
  InstructionBubble,
  ObjectTrayContainer,
  ObjectStickerButton,
  PanelCard,
} from "../components/ui";
import type { SceneBuilderInstruction, SceneObject } from "../types";

interface SceneBuilderScreenProps {
  instruction: SceneBuilderInstruction;
  instructionText?: string;
  objects: SceneObject[];
  showTrayLabels?: boolean;
}

interface TrayObject {
  id: string;
  imageUrl: string;
  label: string;
}

function toDisplayLabel(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getTrayObjects(objects: SceneObject[]) {
  return objects
    .map((object) => ({
      id: object.id,
      imageUrl: getBeachObjectStickerUrl(object.assetId),
      label: toDisplayLabel(object.label),
    }))
    .filter((object): object is TrayObject => Boolean(object.imageUrl));
}

export function SceneBuilderScreen({
  instruction,
  instructionText,
  objects,
  showTrayLabels = false,
}: SceneBuilderScreenProps) {
  const trayObjects = getTrayObjects(objects);
  const currentInstructionText = instructionText ?? instruction.prompt;

  return (
    <div
      data-testid="scene-builder-screen"
      data-mode="listen-and-place"
      data-active-instruction-id={instruction.id}
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <div className="grid h-full min-h-0 grid-rows-[4rem_minmax(0,1fr)_3rem_5rem] gap-2 landscape:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)] landscape:grid-rows-[4rem_minmax(0,1fr)_4.5rem]">
        <InstructionBubble
          aria-label="Opdrachtgebied"
          data-testid="scene-builder-instruction-area"
          text={currentInstructionText}
          className="landscape:col-start-1 landscape:row-start-1"
        />

        <section
          aria-label="Scenegebied"
          data-testid="scene-builder-scene-area"
          className="pointer-events-auto min-h-0 touch-none rounded-[1.75rem] border-2 border-white/70 bg-white/5 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.18)] landscape:col-start-2 landscape:row-span-2 landscape:row-start-1"
        />

        <PanelCard
          aria-label="Statusgebied"
          data-testid="scene-builder-status-area"
          className="flex min-h-0 items-center !p-2 landscape:col-start-1 landscape:row-start-2 landscape:self-end landscape:!p-1.5"
        >
          <GameplayStatusBar
            energyIconUrl={broomIconUrls.basic}
            speedMax={10}
            speedValue={6}
            starMax={30}
            starValue={18}
          />
        </PanelCard>

        <ObjectTrayContainer
          aria-label="Traygebied"
          data-testid="scene-builder-tray-area"
          className="landscape:col-span-2 landscape:row-start-3"
        >
          {trayObjects.map((object) => (
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
