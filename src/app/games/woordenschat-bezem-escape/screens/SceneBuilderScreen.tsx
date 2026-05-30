import { CheckCircle2, Sparkles } from "lucide-react";
import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { broomIconUrls, getBeachObjectStickerUrl, mascotIconUrls } from "../asset-urls";
import { TopHud } from "../components";
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
import {
  readUnlockedRewardIds,
  resolveNewRewardUnlocks,
  saveUnlockedRewardIds,
} from "../logic/rewards";
import { speakDutch } from "../logic/speech";
import type { SceneBuilderInstruction, SceneObject, SceneZone } from "../types";
import { useProfile } from "../../../contexts/ProfileContext";

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
  mascot?: "celebration" | "hint";
  repeatText?: string;
  rewardLabels?: string[];
  text: string;
}

interface DragState {
  hasMoved: boolean;
  imageUrl: string;
  objectId: string;
  startX: number;
  startY: number;
  x: number;
  y: number;
}

interface HintUsageEvent {
  hintLevel: number;
  instructionId: string;
  usedAt: string;
}

interface PracticeRatingStats {
  good: number;
  help: number;
  partial: number;
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

function uniquePush(values: string[], value: string) {
  return values.includes(value) ? values : [...values, value];
}

const conceptExplanation: Record<string, string> = {
  boven: "Boven betekent hoog, aan de bovenkant.",
  dichtbij: "Dichtbij betekent niet ver weg.",
  in: "In betekent binnenin, zoals in het water.",
  links: "Links is de kant van je linkerhand.",
  midden: "Midden is tussen links en rechts.",
  naast: "Naast betekent dichtbij aan de zijkant.",
  onder: "Onder betekent lager dan iets anders.",
  op: "Op betekent erop, aan de bovenkant.",
  rechts: "Rechts is de kant van je rechterhand.",
  tussen: "Tussen betekent in het midden van twee dingen.",
  "ver weg": "Ver weg betekent verder naar achteren in de scene.",
};

export function SceneBuilderScreen({
  instructions,
  instructionText,
  objects,
  zones,
  showTrayLabels = false,
}: SceneBuilderScreenProps) {
  const { currentProfile } = useProfile();
  const rewardProfileId = currentProfile?.id ?? "demo-profile";
  const trayObjects = useMemo(() => getTrayObjects(objects), [objects]);
  const sceneAreaRef = useRef<HTMLElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const suppressNextClickRef = useRef(false);
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(0);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [showTargetZoneHint, setShowTargetZoneHint] = useState(false);
  const [highlightedObjectId, setHighlightedObjectId] = useState<string | null>(null);
  const [audioRepeatsByInstruction, setAudioRepeatsByInstruction] = useState<Record<string, number>>({});
  const [hintsByInstruction, setHintsByInstruction] = useState<Record<string, number>>({});
  const [hintEvents, setHintEvents] = useState<HintUsageEvent[]>([]);
  const [activelyNamedWords, setActivelyNamedWords] = useState<string[]>([]);
  const [activeVocabularyStats, setActiveVocabularyStats] = useState<PracticeRatingStats>({
    good: 0,
    help: 0,
    partial: 0,
  });
  const [sentenceRepeatStats, setSentenceRepeatStats] = useState<PracticeRatingStats>({
    good: 0,
    help: 0,
    partial: 0,
  });
  const [speedValue, setSpeedValue] = useState(0);
  const [speedBoosting, setSpeedBoosting] = useState(false);
  const [wordStarValue, setWordStarValue] = useState(0);
  const [unlockedRewardIds, setUnlockedRewardIds] = useState<string[]>(() =>
    readUnlockedRewardIds(rewardProfileId),
  );
  const instruction = instructions[activeInstructionIndex] ?? instructions[0];
  const currentInstructionText = instructionText ?? instruction.prompt;
  const selectedZone = zones.find((zone) => zone.id === selectedZoneId);
  const targetZone = zones.find((zone) => zone.id === instruction.placement.zoneId);
  const targetObject = objects.find((object) => object.id === instruction.placement.objectId);
  const activeAudioRepeats = audioRepeatsByInstruction[instruction.id] ?? 0;
  const activeHintsUsed = hintsByInstruction[instruction.id] ?? 0;

  useEffect(() => {
    setUnlockedRewardIds(readUnlockedRewardIds(rewardProfileId));
  }, [rewardProfileId]);

  function updateDragState(nextDragState: DragState | null) {
    dragStateRef.current = nextDragState;
    setDragState(nextDragState);
  }

  function getZoneFromViewportPoint(clientX: number, clientY: number) {
    const sceneBounds = sceneAreaRef.current?.getBoundingClientRect();

    if (!sceneBounds) {
      return undefined;
    }

    const isInsideScene =
      clientX >= sceneBounds.left &&
      clientX <= sceneBounds.right &&
      clientY >= sceneBounds.top &&
      clientY <= sceneBounds.bottom;

    if (!isInsideScene) {
      return undefined;
    }

    return findSmallestZoneAtPoint(zones, {
      x: ((clientX - sceneBounds.left) / sceneBounds.width) * 100,
      y: ((clientY - sceneBounds.top) / sceneBounds.height) * 100,
    });
  }

  function resetSelection() {
    setSelectedObjectId(null);
    setSelectedZoneId(null);
    setShowTargetZoneHint(false);
    setHighlightedObjectId(null);
  }

  function handleObjectSelect(objectId: string) {
    setSelectedObjectId(objectId);
    setShowTargetZoneHint(false);
    setHighlightedObjectId(null);
    setFeedback({
      kind: "ready",
      text: "Tik nu op de plek in de scene.",
    });
  }

  function handleObjectActivate(objectId: string) {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }

    handleObjectSelect(objectId);
  }

  function handleSceneTap(event: MouseEvent<HTMLButtonElement>) {
    if (!selectedObjectId) {
      setFeedback({
        kind: "almost",
        text: "Kies eerst een plaatje onderaan.",
      });
      return;
    }

    const tappedZone = getZoneFromViewportPoint(event.clientX, event.clientY);

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
    const bonusEarned = activeHintsUsed === 0;
    const earnedSpeed = instruction.reward.speed + (bonusEarned ? 1 : 0);
    const earnedWordStars = instruction.reward.wordStars + (bonusEarned ? 1 : 0);
    const nextSpeedValue = speedValue + earnedSpeed;
    const nextWordStarValue = wordStarValue + earnedWordStars;
    const newRewardUnlocks = resolveNewRewardUnlocks({
      totalSpeed: nextSpeedValue,
      totalWordStars: nextWordStarValue,
      unlockedRewardIds,
    });
    const nextUnlockedRewardIds = [
      ...unlockedRewardIds,
      ...newRewardUnlocks.map((reward) => reward.id),
    ];

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
    setSpeedValue(nextSpeedValue);
    setWordStarValue(nextWordStarValue);
    setSpeedBoosting(true);
    window.setTimeout(() => setSpeedBoosting(false), 450);

    if (newRewardUnlocks.length > 0) {
      setUnlockedRewardIds(nextUnlockedRewardIds);
      saveUnlockedRewardIds(rewardProfileId, nextUnlockedRewardIds);
    }

    setFeedback({
      kind: "correct",
      mascot: "celebration",
      rewardLabels: newRewardUnlocks.map((reward) => reward.label),
      repeatText: instruction.feedbackCopy.repeatAfterSuccess,
      text: bonusEarned
        ? `${instruction.feedbackCopy.correct} Bonus zonder hint!`
        : instruction.feedbackCopy.correct,
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

  function playInstructionAudio(text = instruction.audioText) {
    if (!speakDutch(text)) {
      setFeedback({
        kind: "almost",
        mascot: "hint",
        text: "Audio is niet beschikbaar in deze browser. Lees de opdracht samen hardop.",
      });
      return;
    }

    setAudioRepeatsByInstruction((currentRepeats) => ({
      ...currentRepeats,
      [instruction.id]: (currentRepeats[instruction.id] ?? 0) + 1,
    }));
  }

  function handleHint() {
    const nextHintCount = activeHintsUsed + 1;
    const nextHintLevel = ((nextHintCount - 1) % 4) + 1;

    setHintsByInstruction((currentHints) => ({
      ...currentHints,
      [instruction.id]: nextHintCount,
    }));
    setHintEvents((currentEvents) => [
      ...currentEvents,
      {
        hintLevel: nextHintLevel,
        instructionId: instruction.id,
        usedAt: new Date().toISOString(),
      },
    ]);

    if (nextHintLevel >= 2) {
      setHighlightedObjectId(instruction.placement.objectId);
    }

    if (nextHintLevel >= 3) {
      setShowTargetZoneHint(true);
    }

    const targetWord = `${targetObject?.article ?? "het"} ${targetObject?.label ?? "plaatje"}`;
    const hintText =
      nextHintLevel === 1
        ? `Zoek ${targetWord}.`
        : nextHintLevel === 2
          ? `Kijk naar het plaatje dat oplicht: ${targetObject?.label ?? "plaatje"}.`
          : nextHintLevel === 3
            ? `Kijk naar de plek die oplicht.`
            : conceptExplanation[instruction.placement.relation] ?? instruction.hint;

    setFeedback({
      kind: "ready",
      mascot: "hint",
      text: hintText,
    });

    if (nextHintLevel === 1) {
      playInstructionAudio(instruction.audioText);
    }
  }

  function recordActiveVocabulary(rating: keyof PracticeRatingStats) {
    const word = targetObject?.label ?? instruction.placement.objectId;

    setActivelyNamedWords((currentWords) => uniquePush(currentWords, word));
    setActiveVocabularyStats((currentStats) => ({
      ...currentStats,
      [rating]: currentStats[rating] + 1,
    }));
  }

  function recordSentenceRepeat(rating: keyof PracticeRatingStats) {
    setSentenceRepeatStats((currentStats) => ({
      ...currentStats,
      [rating]: currentStats[rating] + 1,
    }));
  }

  function handleObjectDrop(objectId: string, clientX: number, clientY: number) {
    const droppedZone = getZoneFromViewportPoint(clientX, clientY);
    setSelectedObjectId(objectId);
    setShowTargetZoneHint(false);

    if (!droppedZone) {
      setSelectedZoneId(null);
      setFeedback({
        kind: "almost",
        text: "Laat het plaatje los op de scene.",
      });
      return;
    }

    setSelectedZoneId(droppedZone.id);
    setFeedback({
      kind: "ready",
      text: `Plek gekozen: ${droppedZone.label}. Druk op Klaar.`,
    });
  }

  function handleObjectPointerDown(event: ReactPointerEvent<HTMLButtonElement>, object: TrayObject) {
    if (event.button !== 0) {
      return;
    }

    updateDragState({
      hasMoved: false,
      imageUrl: object.imageUrl,
      objectId: object.id,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
    });
  }

  useEffect(() => {
    if (!dragState) {
      return undefined;
    }

    function handleWindowPointerMove(event: globalThis.PointerEvent) {
      const currentDragState = dragStateRef.current;

      if (!currentDragState) {
        return;
      }

      event.preventDefault();

      const distanceFromStart = Math.hypot(
        event.clientX - currentDragState.startX,
        event.clientY - currentDragState.startY,
      );

      updateDragState({
        ...currentDragState,
        hasMoved: currentDragState.hasMoved || distanceFromStart > 8,
        x: event.clientX,
        y: event.clientY,
      });
    }

    function handleWindowPointerUp(event: globalThis.PointerEvent) {
      const currentDragState = dragStateRef.current;

      if (!currentDragState) {
        return;
      }

      updateDragState(null);

      if (currentDragState.hasMoved) {
        suppressNextClickRef.current = true;
        handleObjectDrop(currentDragState.objectId, event.clientX, event.clientY);
      }
    }

    function handleWindowPointerCancel() {
      updateDragState(null);
    }

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: false });
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerCancel);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerCancel);
    };
  }, [dragState]);

  function handleObjectPointerMove(event: ReactPointerEvent<HTMLButtonElement>, objectId: string) {
    const currentDragState = dragStateRef.current;

    if (!currentDragState || currentDragState.objectId !== objectId) {
      return;
    }

    const distanceFromStart = Math.hypot(
      event.clientX - currentDragState.startX,
      event.clientY - currentDragState.startY,
    );

    updateDragState({
      ...currentDragState,
      hasMoved: currentDragState.hasMoved || distanceFromStart > 8,
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleObjectPointerUp(event: ReactPointerEvent<HTMLButtonElement>, objectId: string) {
    const currentDragState = dragStateRef.current;

    if (!currentDragState || currentDragState.objectId !== objectId) {
      return;
    }

    updateDragState(null);

    if (currentDragState.hasMoved) {
      suppressNextClickRef.current = true;
      handleObjectDrop(objectId, event.clientX, event.clientY);
    }
  }

  function handleObjectPointerCancel(event: ReactPointerEvent<HTMLButtonElement>, objectId: string) {
    const currentDragState = dragStateRef.current;

    if (!currentDragState || currentDragState.objectId !== objectId) {
      return;
    }

    updateDragState(null);
  }

  return (
    <div
      data-testid="scene-builder-screen"
      data-mode="listen-and-place"
      data-active-instruction-id={instruction.id}
      data-active-audio-repeats={activeAudioRepeats}
      data-active-hints-used={activeHintsUsed}
      data-active-vocabulary-good={activeVocabularyStats.good}
      data-active-vocabulary-help={activeVocabularyStats.help}
      data-active-vocabulary-partial={activeVocabularyStats.partial}
      data-audio-supported={
        typeof window !== "undefined" && "speechSynthesis" in window ? "true" : "false"
      }
      data-named-words={activelyNamedWords.join(",")}
      data-unlocked-rewards={unlockedRewardIds.join(",")}
      data-sentence-repeat-good={sentenceRepeatStats.good}
      data-sentence-repeat-help={sentenceRepeatStats.help}
      data-sentence-repeat-partial={sentenceRepeatStats.partial}
      data-hint-event-count={hintEvents.length}
      data-supported-concepts={supportedSceneBuilderConcepts.join(",")}
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <TopHud
        onAudioClick={() => playInstructionAudio()}
        onHintClick={handleHint}
        showParentBack
        starCount={wordStarValue}
      />

      <div className="grid h-full min-h-0 grid-rows-[4rem_minmax(0,1fr)_3.75rem_5rem] gap-2 landscape:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)] landscape:grid-rows-[4rem_minmax(0,1fr)_4.5rem]">
        <InstructionBubble
          aria-label="Opdrachtgebied"
          data-testid="scene-builder-instruction-area"
          onAudioClick={() => playInstructionAudio()}
          text={currentInstructionText}
          className="landscape:col-start-1 landscape:row-start-1"
        />

        <section
          aria-label="Scenegebied"
          data-testid="scene-builder-scene-area"
          ref={sceneAreaRef}
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
              className="pointer-events-auto absolute bottom-3 left-3 right-3 !rounded-2xl !p-2"
            >
              <div className="flex items-center gap-2">
                {feedback.mascot ? (
                  <img
                    alt=""
                    className="h-10 w-10 shrink-0 object-contain"
                    draggable={false}
                    src={
                      feedback.mascot === "hint"
                        ? mascotIconUrls.hint
                        : mascotIconUrls.celebration
                    }
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black leading-tight text-slate-900">{feedback.text}</p>
                  {feedback.repeatText ? (
                    <p className="mt-1 text-[0.7rem] font-black leading-tight text-sky-900">
                      Bezemspreuk: {feedback.repeatText}
                    </p>
                  ) : null}
                  {feedback.rewardLabels && feedback.rewardLabels.length > 0 ? (
                    <p
                      className="mt-1 text-[0.7rem] font-black leading-tight text-amber-900"
                      data-testid="reward-unlock-message"
                    >
                      Nieuwe beloning: {feedback.rewardLabels.join(", ")}
                    </p>
                  ) : null}
                </div>
              </div>
              {feedback.kind === "correct" ? (
                <div
                  data-testid="active-language-panel"
                  className="mt-2 grid grid-cols-2 gap-2 text-[0.65rem] font-black leading-none text-slate-800"
                >
                  <div className="min-w-0">
                    <p className="mb-1 truncate">Wat zie je?</p>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        className="min-h-11 rounded-xl border-2 border-emerald-300 bg-emerald-100 px-1"
                        data-testid="active-vocabulary-good"
                        onClick={() => recordActiveVocabulary("good")}
                        type="button"
                      >
                        Goed
                      </button>
                      <button
                        className="min-h-11 rounded-xl border-2 border-amber-300 bg-amber-100 px-1"
                        data-testid="active-vocabulary-partial"
                        onClick={() => recordActiveVocabulary("partial")}
                        type="button"
                      >
                        Bijna
                      </button>
                      <button
                        className="min-h-11 rounded-xl border-2 border-sky-300 bg-sky-100 px-1"
                        data-testid="active-vocabulary-help"
                        onClick={() => recordActiveVocabulary("help")}
                        type="button"
                      >
                        Hulp
                      </button>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 truncate">Zin nazeggen</p>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        className="min-h-11 rounded-xl border-2 border-emerald-300 bg-emerald-100 px-1"
                        data-testid="sentence-repeat-good"
                        onClick={() => recordSentenceRepeat("good")}
                        type="button"
                      >
                        Goed
                      </button>
                      <button
                        className="min-h-11 rounded-xl border-2 border-amber-300 bg-amber-100 px-1"
                        data-testid="sentence-repeat-partial"
                        onClick={() => recordSentenceRepeat("partial")}
                        type="button"
                      >
                        Deels
                      </button>
                      <button
                        className="min-h-11 rounded-xl border-2 border-sky-300 bg-sky-100 px-1"
                        data-testid="sentence-repeat-help"
                        onClick={() => recordSentenceRepeat("help")}
                        type="button"
                      >
                        Hulp
                      </button>
                    </div>
                  </div>
                </div>
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
              boosting={speedBoosting}
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
              onClick={() => handleObjectActivate(object.id)}
              onPointerCancel={(event) => handleObjectPointerCancel(event, object.id)}
              onPointerDown={(event) => handleObjectPointerDown(event, object)}
              onPointerMove={(event) => handleObjectPointerMove(event, object.id)}
              onPointerUp={(event) => handleObjectPointerUp(event, object.id)}
              selected={
                selectedObjectId === object.id ||
                dragState?.objectId === object.id ||
                highlightedObjectId === object.id
              }
              showLabel={showTrayLabels}
              size="tray"
            />
          ))}
        </ObjectTrayContainer>
      </div>

      {dragState ? (
        <img
          alt=""
          className="pointer-events-none fixed z-30 h-16 w-16 -translate-x-1/2 -translate-y-1/2 scale-110 object-contain drop-shadow-[0_8px_0_rgba(15,23,42,0.18)]"
          data-testid="drag-preview"
          draggable={false}
          src={dragState.imageUrl}
          style={{
            left: dragState.x,
            top: dragState.y,
          }}
        />
      ) : null}
    </div>
  );
}
