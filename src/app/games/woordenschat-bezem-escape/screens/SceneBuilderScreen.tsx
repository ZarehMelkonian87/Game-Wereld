import { CheckCircle2, Sparkles } from "lucide-react";
import type { MouseEvent } from "react";
import { useMemo, useState } from "react";
import { broomIconUrls, getBeachObjectStickerUrl } from "../asset-urls";
import {
  GameplayStatusBar,
  InstructionBubble,
  ObjectTrayContainer,
  ObjectStickerButton,
  PanelCard,
  PrimaryActionButton,
} from "../components/ui";
import {
  findSmallestZoneAtPoint,
  getZoneCenter,
  supportedSceneBuilderConcepts,
  zoneSupportsConcept,
} from "../logic/scene-zones";
import type { SceneBuilderInstruction, SceneObject, SceneZone } from "../types";

interface SceneBuilderScreenProps {
  instructions: SceneBuilderInstruction[];
  instructionText?: string;
  objects: SceneObject[];
  zones: SceneZone[];
  showTrayLabels?: boolean;
}

interface TrayObject {
  id: string;
  imageUrl: string;
  label: string;
}

interface PlacedObject {
  instructionId: string;
  objectId: string;
  zoneId: string;
}

interface FeedbackState {
  kind: "almost" | "correct" | "ready";
  repeatText?: string;
  text: string;
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
  instructions,
  instructionText,
  objects,
  zones,
  showTrayLabels = false,
}: SceneBuilderScreenProps) {
  const trayObjects = useMemo(() => getTrayObjects(objects), [objects]);
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(0);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [showTargetZoneHint, setShowTargetZoneHint] = useState(false);
  const [speedValue, setSpeedValue] = useState(0);
  const [wordStarValue, setWordStarValue] = useState(0);
  const instruction = instructions[activeInstructionIndex] ?? instructions[0];
  const currentInstructionText = instructionText ?? instruction.prompt;
  const selectedZone = zones.find((zone) => zone.id === selectedZoneId);
  const targetZone = zones.find((zone) => zone.id === instruction.placement.zoneId);
  const targetObject = objects.find((object) => object.id === instruction.placement.objectId);

  function resetSelection() {
    setSelectedObjectId(null);
    setSelectedZoneId(null);
    setShowTargetZoneHint(false);
  }

  function handleObjectSelect(objectId: string) {
    setSelectedObjectId(objectId);
    setShowTargetZoneHint(false);
    setFeedback({
      kind: "ready",
      text: "Tik nu op de plek in de scene.",
    });
  }

  function handleSceneTap(event: MouseEvent<HTMLButtonElement>) {
    if (!selectedObjectId) {
      setFeedback({
        kind: "almost",
        text: "Kies eerst een plaatje onderaan.",
      });
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const tappedZone = findSmallestZoneAtPoint(zones, {
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });

    if (!tappedZone) {
      setSelectedZoneId(null);
      setShowTargetZoneHint(true);
      setFeedback({
        kind: "almost",
        text: "Bijna. Tik rustig op een plek in de scene.",
      });
      return;
    }

    setSelectedZoneId(tappedZone.id);
    setShowTargetZoneHint(false);
    setFeedback({
      kind: "ready",
      text: `Plek gekozen: ${tappedZone.label}. Druk op Klaar.`,
    });
  }

  function advanceInstruction() {
    setActiveInstructionIndex((currentIndex) =>
      Math.min(currentIndex + 1, instructions.length - 1),
    );
    resetSelection();
    setFeedback(null);
  }

  function placeCorrectObject() {
    setPlacedObjects((currentPlacedObjects) => [
      ...currentPlacedObjects.filter(
        (placedObject) => placedObject.instructionId !== instruction.id,
      ),
      {
        instructionId: instruction.id,
        objectId: instruction.placement.objectId,
        zoneId: instruction.placement.zoneId,
      },
    ]);
    setSpeedValue((currentSpeed) => currentSpeed + instruction.reward.speed);
    setWordStarValue((currentStars) => currentStars + instruction.reward.wordStars);
    setFeedback({
      kind: "correct",
      repeatText: instruction.feedbackCopy.repeatAfterSuccess,
      text: instruction.feedbackCopy.correct,
    });
  }

  function handleConfirm() {
    if (feedback?.kind === "correct") {
      advanceInstruction();
      return;
    }

    if (!selectedObjectId) {
      setFeedback({
        kind: "almost",
        text: "Kies eerst een plaatje onderaan.",
      });
      return;
    }

    if (!selectedZoneId) {
      setFeedback({
        kind: "almost",
        text: "Tik daarna op de plek in de scene.",
      });
      return;
    }

    const isCorrectObject = selectedObjectId === instruction.placement.objectId;
    const isCorrectZone = selectedZoneId === instruction.placement.zoneId;
    const isCorrectRelation = zoneSupportsConcept(selectedZone, instruction.placement.relation);

    if (isCorrectObject && isCorrectZone && isCorrectRelation) {
      placeCorrectObject();
      return;
    }

    if (!isCorrectObject) {
      setShowTargetZoneHint(true);
      setFeedback({
        kind: "almost",
        text: `Bijna! Zoek ${targetObject?.article ?? "het"} ${targetObject?.label ?? "plaatje"}.`,
      });
      return;
    }

    setShowTargetZoneHint(true);
    setFeedback({
      kind: "almost",
      text: instruction.feedbackCopy.almost ?? `${instruction.hint} Kijk naar de plek die oplicht.`,
    });
  }

  return (
    <div
      data-testid="scene-builder-screen"
      data-mode="listen-and-place"
      data-active-instruction-id={instruction.id}
      data-supported-concepts={supportedSceneBuilderConcepts.join(",")}
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <div className="grid h-full min-h-0 grid-rows-[4rem_minmax(0,1fr)_3.75rem_5rem] gap-2 landscape:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)] landscape:grid-rows-[4rem_minmax(0,1fr)_4.5rem]">
        <InstructionBubble
          aria-label="Opdrachtgebied"
          data-testid="scene-builder-instruction-area"
          text={currentInstructionText}
          className="landscape:col-start-1 landscape:row-start-1"
        />

        <section
          aria-label="Scenegebied"
          data-testid="scene-builder-scene-area"
          className="relative min-h-0 overflow-hidden rounded-[1.75rem] border-2 border-white/70 bg-white/5 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.18)] landscape:col-start-2 landscape:row-span-2 landscape:row-start-1"
        >
          <button
            aria-label="Kies plek in de scene"
            className="pointer-events-auto absolute inset-0 touch-manipulation"
            data-testid="scene-tap-target"
            onClick={handleSceneTap}
            type="button"
          />

          {selectedZone ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-emerald-400 bg-emerald-200/35 shadow-[0_0_0_5px_rgba(255,255,255,0.72)]"
              data-testid="selected-zone-marker"
              style={{
                left: `${getZoneCenter(selectedZone).x}%`,
                top: `${getZoneCenter(selectedZone).y}%`,
              }}
            >
              <CheckCircle2 className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-emerald-700" strokeWidth={3} />
            </span>
          ) : null}

          {showTargetZoneHint && targetZone ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute rounded-[1.5rem] border-4 border-dashed border-amber-400 bg-amber-200/20 shadow-[0_0_0_5px_rgba(255,255,255,0.72)]"
              data-testid="target-zone-hint"
              style={{
                height: `${targetZone.height}%`,
                left: `${targetZone.x}%`,
                top: `${targetZone.y}%`,
                width: `${targetZone.width}%`,
              }}
            />
          ) : null}

          {placedObjects.map((placedObject) => {
            const object = objects.find((sceneObject) => sceneObject.id === placedObject.objectId);
            const zone = zones.find((sceneZone) => sceneZone.id === placedObject.zoneId);

            if (!object) {
              return null;
            }

            const position = getZoneCenter(zone);

            return (
              <img
                alt=""
                className="pointer-events-none absolute h-[clamp(3rem,12vw,5.5rem)] w-[clamp(3rem,12vw,5.5rem)] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_4px_0_rgba(15,23,42,0.16)]"
                data-testid={`placed-object-${placedObject.objectId}`}
                draggable={false}
                key={placedObject.instructionId}
                src={getBeachObjectStickerUrl(object.assetId)}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
              />
            );
          })}

          {feedback ? (
            <PanelCard
              aria-live="polite"
              data-testid="scene-builder-feedback"
              className="pointer-events-none absolute bottom-3 left-3 right-3 !rounded-2xl !p-2"
            >
              <p className="text-xs font-black leading-tight text-slate-900">{feedback.text}</p>
              {feedback.repeatText ? (
                <p className="mt-1 text-[0.7rem] font-black leading-tight text-sky-900">
                  Zeg na: {feedback.repeatText}
                </p>
              ) : null}
            </PanelCard>
          ) : null}
        </section>

        <PanelCard
          aria-label="Statusgebied"
          data-testid="scene-builder-status-area"
          className="flex min-h-0 items-center !p-2 landscape:col-start-1 landscape:row-start-2 landscape:self-end landscape:!p-1.5"
        >
          <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <GameplayStatusBar
              energyIconUrl={broomIconUrls.basic}
              speedMax={10}
              speedValue={speedValue}
              starMax={30}
              starValue={wordStarValue}
            />
            <PrimaryActionButton
              className="pointer-events-auto min-h-10 px-3 py-2 text-sm"
              data-testid="scene-builder-confirm-button"
              iconLeft={
                feedback?.kind === "correct" ? (
                  <Sparkles className="h-5 w-5" strokeWidth={3} />
                ) : (
                  <CheckCircle2 className="h-5 w-5" strokeWidth={3} />
                )
              }
              onClick={handleConfirm}
            >
              {feedback?.kind === "correct" ? "Volgende" : "Klaar"}
            </PrimaryActionButton>
          </div>
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
              onClick={() => handleObjectSelect(object.id)}
              selected={selectedObjectId === object.id}
              showLabel={showTrayLabels}
              size="tray"
            />
          ))}
        </ObjectTrayContainer>
      </div>
    </div>
  );
}
