import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  getBeachObjectStickerUrl,
  getConceptHintVideoUrl,
  getHighlightedObjectHintVideoUrl,
  getInstructionVideoUrl,
  getSeekObjectHintVideoUrl,
  sharedPlaceHintVideoUrl,
} from "../asset-urls";
import { ObjectStickerButton } from "../components/ui";
import {
  findSmallestZoneAtPoint,
  selectedZoneMatchesTarget,
  supportedSceneBuilderConcepts,
  zoneSupportsConcept,
} from "../logic/scene-zones";
import {
  applySceneZoneVisualHintOverrides,
  zoneVisualHintOverridesChangedEvent,
} from "../logic/scene-zone-visual-overrides";
import {
  evaluateDynamicRelationPlacement,
  getDynamicRelationHintZone,
  usesDynamicRelationZone,
  type SceneObjectPlacementPoint,
} from "../logic/dynamic-scene-relations";
import { GAME_FOREGROUND_AUDIO_VOLUME } from "../logic/game-audio-events";
import {
  executeSpokenSceneCommand,
  type SceneCommandChoice,
  type SceneCommandExecutionResult,
} from "../logic/scene-command-executor";
import {
  readUnlockedRewardIds,
  resolveNewRewardUnlocks,
  saveUnlockedRewardIds,
} from "../logic/rewards";
import {
  appendPracticeEvent,
  recordActiveVocabularyObservation,
  recordSpeakAndPlaceObservation,
  recordSentenceRepeatObservation,
  type AdultRating,
} from "../logic/progress";
import { readBezemEscapeSettings } from "../logic/settings";
import { speakDutch } from "../logic/speech";
import type {
  AssistanceLevel,
  PracticeResult,
  SceneBuilderInstruction,
  SceneObject,
  SceneZone,
  SpatialConcept,
} from "../types";
import { SpokenCommandControls } from "./scene-builder/SpokenCommandControls";
import { InstructionVideoButton } from "./scene-builder/InstructionVideoButton";
import { useProfile } from "../../../contexts/ProfileContext";
import { CompactInstructionCard } from "./scene-builder/CompactInstructionCard";
import { CompactProgressBar } from "./scene-builder/CompactProgressBar";
import { FloatingSuccessToast } from "./scene-builder/FloatingSuccessToast";
import { ObjectCarousel } from "./scene-builder/ObjectCarousel";
import { ParentObservationSheet } from "./scene-builder/ParentObservationSheet";
import { SceneBuilderTopBar } from "./scene-builder/SceneBuilderTopBar";
import { SceneZoneDevTools } from "./scene-builder/SceneZoneDevTools";
import { TargetZoneHint } from "./scene-builder/TargetZoneHint";

interface SceneBuilderScreenProps {
  instructions: SceneBuilderInstruction[];
  instructionText?: string;
  objects: SceneObject[];
  spokenCommandPreviewText?: string;
  zones: SceneZone[];
  showTrayLabels?: boolean;
  showZoneDevTools?: boolean;
}

interface TrayObject {
  id: string;
  imageUrl: string;
  label: string;
}

interface PlacedObject {
  instructionId: string;
  objectId: string;
  x: number;
  y: number;
  zoneId: string;
}

interface SceneCompletionSummary {
  placedObjects: PlacedObject[];
  practicedConcepts: SpatialConcept[];
  practicedWords: string[];
}

interface FeedbackState {
  hintVideoUrl?: string;
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
  source: "scene" | "tray";
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

interface SpeakAndPlaceStats {
  autoExecuted: number;
  retry: number;
  selfMade: number;
  withHelp: number;
}

interface PendingPlacement {
  objectId: string;
  source?: "manual" | "spoken";
  transcript?: string;
  x: number;
  y: number;
  zoneId: string;
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

const getObjectLabelById = (objects: readonly SceneObject[], objectId: string | undefined) => {
  if (!objectId) {
    return undefined;
  }

  return objects.find((object) => object.id === objectId)?.label ?? objectId;
};

const getHintVideoUrlForLevel = (instructionId: string, hintLevel: number, relation: string) => {
  if (hintLevel === 1) {
    return getSeekObjectHintVideoUrl(instructionId);
  }

  if (hintLevel === 2) {
    return getHighlightedObjectHintVideoUrl(instructionId);
  }

  if (hintLevel === 3) {
    return sharedPlaceHintVideoUrl;
  }

  if (hintLevel === 4) {
    return getConceptHintVideoUrl(relation);
  }

  return undefined;
};

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

function isHorizontalTrayScrollGesture(dragState: DragState, clientX: number, clientY: number) {
  const deltaX = clientX - dragState.startX;
  const deltaY = clientY - dragState.startY;

  return Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
}

const getSpeakAndPlaceReward = ({
  activeAudioRepeats,
  activeHintsUsed,
  instruction,
  objects,
  spokenCommandResult,
  spokenHelpCount,
}: {
  activeAudioRepeats: number;
  activeHintsUsed: number;
  instruction: SceneBuilderInstruction;
  objects: readonly SceneObject[];
  spokenCommandResult: SceneCommandExecutionResult | null;
  spokenHelpCount: number;
}) => {
  const activeSpatialConcept = spokenCommandResult?.parseResult.relation;
  const targetWord = getObjectLabelById(objects, spokenCommandResult?.parseResult.objectId);
  const autoExecuted = spokenCommandResult?.status === "ready" && Boolean(spokenCommandResult.placement);
  const objectRecognized = spokenCommandResult?.parseResult.objectId === instruction.placement.objectId;
  const spatialConceptRecognized = Boolean(activeSpatialConcept);
  const helpWasUsed =
    activeAudioRepeats > 0 ||
    activeHintsUsed > 0 ||
    spokenHelpCount > 0 ||
    !autoExecuted;
  const selfMadeSentence =
    autoExecuted && objectRecognized && spatialConceptRecognized;
  const independentSentence = selfMadeSentence && !helpWasUsed;
  const earnedSpeed =
    (objectRecognized ? 1 : 0) +
    (spatialConceptRecognized ? 1 : 0) +
    1 +
    (independentSentence ? 2 : 0);
  const earnedWordStars = 1 + (independentSentence ? 1 : 0);
  const assistance: AssistanceLevel = helpWasUsed ? "hint" : "none";
  const result: PracticeResult = helpWasUsed ? "correct-with-help" : "correct-without-help";

  return {
    activeSpatialConcept,
    assistance,
    autoExecuted,
    earnedSpeed,
    earnedWordStars,
    independentSentence,
    result,
    selfMadeSentence,
    targetWord,
    transcript: spokenCommandResult?.transcript,
  };
};

export function SceneBuilderScreen({
  instructions,
  instructionText,
  objects,
  spokenCommandPreviewText,
  zones,
  showTrayLabels = false,
  showZoneDevTools = false,
}: SceneBuilderScreenProps) {
  const { currentProfile } = useProfile();
  const rewardProfileId = currentProfile?.id ?? "demo-profile";
  const trayObjects = useMemo(() => getTrayObjects(objects), [objects]);
  const sceneAreaRef = useRef<HTMLElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const hintVideoPressStartedRef = useRef(false);
  const suppressNextClickRef = useRef(false);
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(0);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [pendingPlacement, setPendingPlacement] = useState<PendingPlacement | null>(null);
  const [spokenCommandResult, setSpokenCommandResult] =
    useState<SceneCommandExecutionResult | null>(null);
  const [appliedSpokenCommandPreviewText, setAppliedSpokenCommandPreviewText] =
    useState<string | null>(null);
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);
  const [sceneComplete, setSceneComplete] = useState(false);
  const [sceneCompletionSummary, setSceneCompletionSummary] =
    useState<SceneCompletionSummary | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [showTargetZoneHint, setShowTargetZoneHint] = useState(false);
  const [zoneOverrideVersion, setZoneOverrideVersion] = useState(0);
  const [spokenHintZoneId, setSpokenHintZoneId] = useState<string | null>(null);
  const [highlightedObjectId, setHighlightedObjectId] = useState<string | null>(null);
  const [audioRepeatsByInstruction, setAudioRepeatsByInstruction] = useState<Record<string, number>>({});
  const [hintsByInstruction, setHintsByInstruction] = useState<Record<string, number>>({});
  const [hintEvents, setHintEvents] = useState<HintUsageEvent[]>([]);
  const [spokenHelpByInstruction, setSpokenHelpByInstruction] = useState<Record<string, number>>({});
  const [activelyNamedWords, setActivelyNamedWords] = useState<string[]>([]);
  const [showObservationPanel, setShowObservationPanel] = useState(false);
  const [observationNotice, setObservationNotice] = useState<string | null>(null);
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
  const [speakAndPlaceStats, setSpeakAndPlaceStats] = useState<SpeakAndPlaceStats>({
    autoExecuted: 0,
    retry: 0,
    selfMade: 0,
    withHelp: 0,
  });
  const [speedValue, setSpeedValue] = useState(0);
  const [speedBoosting, setSpeedBoosting] = useState(false);
  const [wordStarValue, setWordStarValue] = useState(0);
  const [unlockedRewardIds, setUnlockedRewardIds] = useState<string[]>(() =>
    readUnlockedRewardIds(rewardProfileId),
  );
  const effectiveZones = useMemo(
    () => applySceneZoneVisualHintOverrides(zones),
    [zones, zoneOverrideVersion],
  );
  const placedObjectPoints = useMemo<SceneObjectPlacementPoint[]>(
    () =>
      placedObjects.map((placedObject) => ({
        objectId: placedObject.objectId,
        x: placedObject.x,
        y: placedObject.y,
      })),
    [placedObjects],
  );
  const instruction = instructions[activeInstructionIndex] ?? instructions[0];
  const sceneCompletionTarget = instructions.length;
  const currentInstructionText = instructionText ?? instruction.prompt;
  const currentInstructionVideoUrl = getInstructionVideoUrl(instruction.id);
  const selectedZone = effectiveZones.find((zone) => zone.id === selectedZoneId);
  const targetZone = effectiveZones.find((zone) => zone.id === instruction.placement.zoneId);
  const dynamicTargetZone = getDynamicRelationHintZone({
    anchorObjectIds: instruction.placement.anchorObjectIds,
    placements: placedObjectPoints,
    relation: instruction.placement.relation,
    zoneId: instruction.placement.zoneId,
  });
  const spokenVisualHintZone =
    effectiveZones.find((zone) => zone.id === spokenHintZoneId) ??
    (spokenHintZoneId === instruction.placement.zoneId ? dynamicTargetZone : undefined);
  const visualHintZone = spokenVisualHintZone ?? dynamicTargetZone ?? targetZone;
  const targetObject = objects.find((object) => object.id === instruction.placement.objectId);
  const activeAudioRepeats = audioRepeatsByInstruction[instruction.id] ?? 0;
  const activeHintsUsed = hintsByInstruction[instruction.id] ?? 0;
  const activeSpokenHelpCount = spokenHelpByInstruction[instruction.id] ?? 0;

  useEffect(() => {
    setUnlockedRewardIds(readUnlockedRewardIds(rewardProfileId));
  }, [rewardProfileId]);

  useEffect(() => {
    resetSceneBuilderRound();
  }, [instructions]);

  useEffect(() => {
    const handleZoneOverridesChanged = () => {
      setZoneOverrideVersion((currentVersion) => currentVersion + 1);
    };

    window.addEventListener(
      zoneVisualHintOverridesChangedEvent,
      handleZoneOverridesChanged,
    );

    return () => {
      window.removeEventListener(
        zoneVisualHintOverridesChangedEvent,
        handleZoneOverridesChanged,
      );
    };
  }, []);

  function updateDragState(nextDragState: DragState | null) {
    dragStateRef.current = nextDragState;
    setDragState(nextDragState);
  }

  function getScenePointFromViewportPoint(clientX: number, clientY: number) {
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

    return {
      x: Math.min(96, Math.max(4, ((clientX - sceneBounds.left) / sceneBounds.width) * 100)),
      y: Math.min(94, Math.max(6, ((clientY - sceneBounds.top) / sceneBounds.height) * 100)),
    };
  }

  function getZoneFromViewportPoint(clientX: number, clientY: number) {
    const scenePoint = getScenePointFromViewportPoint(clientX, clientY);

    if (!scenePoint) {
      return undefined;
    }

    return findSmallestZoneAtPoint(effectiveZones, scenePoint);
  }

  function resetSelection() {
    setSelectedObjectId(null);
    setSelectedZoneId(null);
    setPendingPlacement(null);
    setSpokenCommandResult(null);
    setShowTargetZoneHint(false);
    setSpokenHintZoneId(null);
    setHighlightedObjectId(null);
    setShowObservationPanel(false);
    setObservationNotice(null);
  }

  function handleObjectSelect(objectId: string) {
    setSelectedObjectId(objectId);
    setSelectedZoneId(null);
    setPendingPlacement(null);
    setSpokenCommandResult(null);
    setShowTargetZoneHint(false);
    setSpokenHintZoneId(null);
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

    const scenePoint = getScenePointFromViewportPoint(event.clientX, event.clientY);
    const tappedZone = getZoneFromViewportPoint(event.clientX, event.clientY);

    if (!scenePoint || !tappedZone) {
      setSelectedZoneId(null);
      setShowTargetZoneHint(true);
      setFeedback({
        kind: "almost",
        text: "Bijna. Tik rustig op een plek in de scene.",
      });
      return;
    }

    setSelectedZoneId(tappedZone.id);
    setSpokenHintZoneId(null);
    setPendingPlacement({
      objectId: selectedObjectId,
      source: "manual",
      x: scenePoint.x,
      y: scenePoint.y,
      zoneId: tappedZone.id,
    });
    setShowTargetZoneHint(false);
    setFeedback({
      kind: "ready",
      text: `Plek gekozen: ${tappedZone.label}. Je kunt nog verplaatsen. Druk daarna op Klaar.`,
    });
  }

  const applySpokenCommandTranscript = useCallback(
    (transcript: string) => {
      const executionResult = executeSpokenSceneCommand({
        objects,
        placements: placedObjectPoints,
        transcript,
        zones: effectiveZones,
      });
      setSpokenCommandResult(executionResult);

      if (executionResult.status !== "ready" || !executionResult.placement) {
        const nextSpokenHelpCount = activeSpokenHelpCount + 1;
        const targetWord = getObjectLabelById(objects, executionResult.parseResult.objectId);

        setSpokenHelpByInstruction((currentHelp) => ({
          ...currentHelp,
          [instruction.id]: (currentHelp[instruction.id] ?? 0) + 1,
        }));
        setSpeakAndPlaceStats((currentStats) => ({
          ...currentStats,
          retry: currentStats.retry + 1,
        }));
        recordSpeakAndPlaceObservation(rewardProfileId, {
          assistance: "hint",
          audioRepeats: activeAudioRepeats,
          autoExecuted: false,
          hintsUsed: activeHintsUsed + nextSpokenHelpCount,
          id: `${instruction.id}:zeg-en-bouw:retry:${Date.now()}`,
          instructionId: instruction.id,
          isCorrect: false,
          languageDomains: instruction.languageDomains,
          result: "needs-more-practice",
          selfMadeSentence: false,
          spatialConcept: executionResult.parseResult.relation,
          speedEarned: 0,
          targetWord,
          transcript: transcript.trim() || undefined,
          wordStarsEarned: 0,
        });
        setPendingPlacement(null);
        setSelectedObjectId(executionResult.visualHint.objectId ?? null);
        setSelectedZoneId(executionResult.visualHint.zoneId ?? null);
        setHighlightedObjectId(executionResult.visualHint.objectId ?? null);
        setSpokenHintZoneId(executionResult.visualHint.zoneId ?? null);
        setShowTargetZoneHint(Boolean(executionResult.visualHint.zoneId));
        setFeedback({
          kind: "almost",
          mascot: "hint",
          text: executionResult.message,
        });
        return executionResult;
      }

      const { placement } = executionResult;

      setSelectedObjectId(placement.objectId);
      setSelectedZoneId(placement.zoneId);
      setPendingPlacement({
        objectId: placement.objectId,
        source: "spoken",
        transcript: placement.transcript,
        x: placement.point.x,
        y: placement.point.y,
        zoneId: placement.zoneId,
      });
      setShowTargetZoneHint(false);
      setSpokenHintZoneId(null);
      setHighlightedObjectId(null);
      setFeedback({
        kind: "ready",
        mascot: "hint",
        text: `${executionResult.message} Wil je dit zo plaatsen? Druk daarna op Klaar.`,
      });

      return executionResult;
    },
    [
      activeAudioRepeats,
      activeHintsUsed,
      activeSpokenHelpCount,
      instruction,
      objects,
      placedObjectPoints,
      rewardProfileId,
      effectiveZones,
    ],
  );

  const handleSpokenCommandChoice = (choice: SceneCommandChoice) => {
    if (choice.type === "object") {
      setSelectedObjectId(choice.id);
      setPendingPlacement(null);
      setHighlightedObjectId(choice.id);
      setFeedback({
        kind: "ready",
        text: `Goed, ${choice.label}. Kies nu de plek in de scene.`,
      });
      return;
    }

    const chosenZone = effectiveZones.find((zone) => zone.id === choice.id);
    const objectId = spokenCommandResult?.parseResult.objectId ?? selectedObjectId;

    if (!chosenZone || !objectId) {
      setSelectedZoneId(choice.id);
      setSpokenHintZoneId(choice.id);
      setShowTargetZoneHint(true);
      setFeedback({
        kind: "ready",
        text: `Plek gekozen: ${choice.label}. Kies nu welk plaatje daar moet komen.`,
      });
      return;
    }

    const point = {
      x: chosenZone.x + chosenZone.width / 2,
      y: chosenZone.y + chosenZone.height / 2,
    };

    setSelectedObjectId(objectId);
    setSelectedZoneId(chosenZone.id);
    setSpokenHintZoneId(null);
    setShowTargetZoneHint(false);
    setPendingPlacement({
      objectId,
      source: "spoken",
      transcript: spokenCommandResult?.transcript,
      x: point.x,
      y: point.y,
      zoneId: chosenZone.id,
    });
    setFeedback({
      kind: "ready",
      text: `Ik zet het plaatje op ${choice.label}. Je kunt de plek nog aanpassen. Druk daarna op Klaar.`,
    });
  };

  const handleRepeatSpokenCommand = () => {
    setSpokenCommandResult(null);
    setPendingPlacement(null);
    setSelectedObjectId(null);
    setSelectedZoneId(null);
    setShowTargetZoneHint(false);
    setSpokenHintZoneId(null);
    setHighlightedObjectId(null);
    setFeedback({
      kind: "ready",
      mascot: "hint",
      text: "Zeg de zin nog een keer rustig.",
    });
  };

  useEffect(() => {
    if (
      !spokenCommandPreviewText ||
      appliedSpokenCommandPreviewText === spokenCommandPreviewText
    ) {
      return;
    }

    applySpokenCommandTranscript(spokenCommandPreviewText);
    setAppliedSpokenCommandPreviewText(spokenCommandPreviewText);
  }, [appliedSpokenCommandPreviewText, applySpokenCommandTranscript, spokenCommandPreviewText]);

  function advanceInstruction() {
    setActiveInstructionIndex((currentIndex) =>
      Math.min(currentIndex + 1, instructions.length - 1),
    );
    resetSelection();
    setFeedback(null);
  }

  function resetSceneBuilderRound() {
    setActiveInstructionIndex(0);
    resetSelection();
    setPlacedObjects([]);
    setSceneComplete(false);
    setSceneCompletionSummary(null);
    setFeedback(null);
  }

  function placeCorrectObject() {
    if (!pendingPlacement) {
      return;
    }

    const nextPlacedObjects = [
      ...placedObjects.filter(
        (placedObject) => placedObject.instructionId !== instruction.id,
      ),
      {
        instructionId: instruction.id,
        objectId: instruction.placement.objectId,
        x: pendingPlacement.x,
        y: pendingPlacement.y,
        zoneId: pendingPlacement.zoneId,
      },
    ];
    const nextSceneComplete = nextPlacedObjects.length >= sceneCompletionTarget;
    const nextCompletionSummary: SceneCompletionSummary = {
      placedObjects: nextPlacedObjects,
      practicedConcepts: nextPlacedObjects
        .map((placedObject) =>
          instructions.find((item) => item.id === placedObject.instructionId)?.placement.relation,
        )
        .filter((concept): concept is SpatialConcept => concept !== undefined),
      practicedWords: nextPlacedObjects.map((placedObject) => placedObject.objectId),
    };
    const isSpokenPlacement = pendingPlacement.source === "spoken";
    const speakAndPlaceReward = isSpokenPlacement
      ? getSpeakAndPlaceReward({
          activeAudioRepeats,
          activeHintsUsed,
          instruction,
          objects,
          spokenCommandResult,
          spokenHelpCount: activeSpokenHelpCount,
        })
      : null;
    const bonusEarned = !isSpokenPlacement && activeHintsUsed === 0;
    const earnedSpeed =
      speakAndPlaceReward?.earnedSpeed ?? instruction.reward.speed + (bonusEarned ? 1 : 0);
    const earnedWordStars =
      speakAndPlaceReward?.earnedWordStars ?? instruction.reward.wordStars + (bonusEarned ? 1 : 0);
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

    setPlacedObjects(nextPlacedObjects);
    setPendingPlacement(null);
    setSceneComplete(nextSceneComplete);
    setSceneCompletionSummary(nextSceneComplete ? nextCompletionSummary : null);
    setShowObservationPanel(false);
    setObservationNotice(null);
    setSpeedValue(nextSpeedValue);
    setWordStarValue(nextWordStarValue);
    setSpeedBoosting(true);
    window.setTimeout(() => setSpeedBoosting(false), 450);

    if (speakAndPlaceReward) {
      setSpeakAndPlaceStats((currentStats) => ({
        ...currentStats,
        autoExecuted: currentStats.autoExecuted + (speakAndPlaceReward.autoExecuted ? 1 : 0),
        selfMade: currentStats.selfMade + (speakAndPlaceReward.selfMadeSentence ? 1 : 0),
        withHelp: currentStats.withHelp + (speakAndPlaceReward.assistance === "none" ? 0 : 1),
      }));
      recordSpeakAndPlaceObservation(rewardProfileId, {
        assistance: speakAndPlaceReward.assistance,
        audioRepeats: activeAudioRepeats,
        autoExecuted: speakAndPlaceReward.autoExecuted,
        hintsUsed: activeHintsUsed + activeSpokenHelpCount,
        id: `${instruction.id}:zeg-en-bouw:success:${Date.now()}`,
        instructionId: instruction.id,
        isCorrect: true,
        languageDomains: instruction.languageDomains,
        result: speakAndPlaceReward.result,
        selfMadeSentence: speakAndPlaceReward.selfMadeSentence,
        spatialConcept: speakAndPlaceReward.activeSpatialConcept,
        speedEarned: earnedSpeed,
        targetWord: speakAndPlaceReward.targetWord,
        transcript: speakAndPlaceReward.transcript ?? pendingPlacement.transcript,
        wordStarsEarned: earnedWordStars,
      });
    } else {
      appendPracticeEvent(rewardProfileId, {
        assistance: activeHintsUsed > 0 ? "hint" : "none",
        attempts: 1,
        audioRepeats: activeAudioRepeats,
        hintsUsed: activeHintsUsed,
        instructionId: instruction.id,
        isCorrect: true,
        languageDomains: instruction.languageDomains,
        mode: "listen-and-place",
        result: activeHintsUsed > 0 ? "correct-with-help" : "correct-without-help",
        spatialConcepts: instruction.spatialConcepts,
        speedEarned: earnedSpeed,
        targetWords: [targetObject?.label ?? instruction.placement.objectId],
        wordStarsEarned: earnedWordStars,
      });
    }

    if (newRewardUnlocks.length > 0) {
      setUnlockedRewardIds(nextUnlockedRewardIds);
      saveUnlockedRewardIds(rewardProfileId, nextUnlockedRewardIds);
    }

    setFeedback({
      kind: "correct",
      mascot: "celebration",
      rewardLabels: newRewardUnlocks.map((reward) => reward.label),
      repeatText: instruction.feedbackCopy.repeatAfterSuccess,
      text: [
        speakAndPlaceReward
          ? `Mooi! Je zin heeft de game zelf laten bouwen. +${earnedSpeed} Speed!`
          : instruction.feedbackCopy.correct,
        speakAndPlaceReward?.independentSentence ? "Extra bonus voor zelf zeggen!" : "",
        bonusEarned ? "Bonus zonder hint!" : "",
        nextSceneComplete ? "De scene is klaar." : "",
        nextSceneComplete ? "Druk op Opnieuw voor een nieuwe ronde." : "Druk op Volgende.",
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  function handleConfirm() {
    if (sceneComplete && feedback?.kind === "correct") {
      resetSceneBuilderRound();
      return;
    }

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

    if (!pendingPlacement) {
      setFeedback({
        kind: "almost",
        text: "Zet het plaatje eerst op de plek in de scene.",
      });
      return;
    }

    const isCorrectObject = selectedObjectId === instruction.placement.objectId;
    const usesDynamicRelation = usesDynamicRelationZone(instruction.placement);
    const dynamicRelationEvaluation = evaluateDynamicRelationPlacement({
      anchorObjectIds: instruction.placement.anchorObjectIds,
      placementPoint: {
        x: pendingPlacement.x,
        y: pendingPlacement.y,
      },
      placements: placedObjectPoints,
      relation: instruction.placement.relation,
    });
    const isCorrectZone = usesDynamicRelation
      ? dynamicRelationEvaluation.matches
      : selectedZoneMatchesTarget(selectedZone, targetZone);
    const isCorrectRelation = usesDynamicRelation
      ? dynamicRelationEvaluation.matches
      : zoneSupportsConcept(selectedZone, instruction.placement.relation);

    if (isCorrectObject && isCorrectZone && isCorrectRelation) {
      placeCorrectObject();
      return;
    }

    if (usesDynamicRelation && dynamicRelationEvaluation.missingAnchorObjectIds.length > 0) {
      setShowTargetZoneHint(false);
      setFeedback({
        kind: "almost",
        text: `Plaats eerst: ${dynamicRelationEvaluation.missingAnchorObjectIds.join(", ")}.`,
      });
      return;
    }

    const isSpokenPendingPlacement = pendingPlacement.source === "spoken";
    const recordSpokenPlacementMiss = (reason: string) => {
      recordSpeakAndPlaceObservation(rewardProfileId, {
        assistance: "hint",
        audioRepeats: activeAudioRepeats,
        autoExecuted: spokenCommandResult?.status === "ready",
        hintsUsed: activeHintsUsed + activeSpokenHelpCount + 1,
        id: `${instruction.id}:zeg-en-bouw:${reason}:${Date.now()}`,
        instructionId: instruction.id,
        isCorrect: false,
        languageDomains: instruction.languageDomains,
        result: "needs-more-practice",
        selfMadeSentence: false,
        spatialConcept: spokenCommandResult?.parseResult.relation,
        speedEarned: 0,
        targetWord: getObjectLabelById(objects, spokenCommandResult?.parseResult.objectId),
        transcript: spokenCommandResult?.transcript ?? pendingPlacement.transcript,
        wordStarsEarned: 0,
      });
    };

    if (!isCorrectObject) {
      if (isSpokenPendingPlacement) {
        recordSpokenPlacementMiss("wrong-object");
      } else {
        appendPracticeEvent(rewardProfileId, {
          assistance: activeHintsUsed > 0 ? "hint" : activeAudioRepeats > 0 ? "audio-repeat" : "none",
          attempts: 1,
          audioRepeats: activeAudioRepeats,
          hintsUsed: activeHintsUsed,
          instructionId: `${instruction.id}:wrong-object:${Date.now()}`,
          isCorrect: false,
          languageDomains: instruction.languageDomains,
          mode: "listen-and-place",
          result: "needs-more-practice",
          spatialConcepts: instruction.spatialConcepts,
          speedEarned: 0,
          targetWords: [targetObject?.label ?? instruction.placement.objectId],
          wordStarsEarned: 0,
        });
      }
      setShowTargetZoneHint(true);
      setFeedback({
        kind: "almost",
        text: `Bijna! Zoek ${targetObject?.article ?? "het"} ${targetObject?.label ?? "plaatje"}.`,
      });
      return;
    }

    if (isSpokenPendingPlacement) {
      recordSpokenPlacementMiss("wrong-zone");
    } else {
      appendPracticeEvent(rewardProfileId, {
        assistance: activeHintsUsed > 0 ? "hint" : activeAudioRepeats > 0 ? "audio-repeat" : "none",
        attempts: 1,
        audioRepeats: activeAudioRepeats,
        hintsUsed: activeHintsUsed,
        instructionId: `${instruction.id}:wrong-zone:${Date.now()}`,
        isCorrect: false,
        languageDomains: instruction.languageDomains,
        mode: "listen-and-place",
        result: "needs-more-practice",
        spatialConcepts: instruction.spatialConcepts,
        speedEarned: 0,
        targetWords: [targetObject?.label ?? instruction.placement.objectId],
        wordStarsEarned: 0,
      });
    }
    setShowTargetZoneHint(true);
    setFeedback({
      kind: "almost",
      text: instruction.feedbackCopy.almost ?? `${instruction.hint} Kijk naar de plek die oplicht.`,
    });
  }

  function playInstructionAudio(text = instruction.audioText) {
    if (!readBezemEscapeSettings(rewardProfileId).audioEnabled) {
      setFeedback({
        kind: "almost",
        mascot: "hint",
        text: "Audio staat uit bij instellingen. Lees de opdracht samen hardop.",
      });
      return;
    }

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

  const handleInstructionVideoRequest = () => {
    if (!readBezemEscapeSettings(rewardProfileId).audioEnabled) {
      setFeedback({
        kind: "almost",
        mascot: "hint",
        text: "Audio staat uit bij instellingen. Zet audio aan om de video-opdracht te horen.",
      });
      return false;
    }

    return true;
  };

  const handleInstructionVideoPlaybackStart = () => {
    setAudioRepeatsByInstruction((currentRepeats) => ({
      ...currentRepeats,
      [instruction.id]: (currentRepeats[instruction.id] ?? 0) + 1,
    }));
  };

  const handleInstructionVideoPlaybackError = () => {
    setFeedback({
      kind: "almost",
      mascot: "hint",
      text: "De video-opdracht kan niet worden afgespeeld. Probeer de audio opnieuw of lees de opdracht samen.",
    });
  };

  const applyHint = ({ playAudioForFirstHint }: { playAudioForFirstHint: boolean }) => {
    if (!readBezemEscapeSettings(rewardProfileId).hintsEnabled) {
      setFeedback({
        kind: "ready",
        mascot: "hint",
        text: "Hints staan uit bij instellingen.",
      });
      return false;
    }

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

    if (spokenCommandResult && spokenCommandResult.status !== "ready") {
      setHighlightedObjectId(spokenCommandResult.visualHint.objectId ?? null);
      setSpokenHintZoneId(spokenCommandResult.visualHint.zoneId ?? null);
      setShowTargetZoneHint(Boolean(spokenCommandResult.visualHint.zoneId));
    } else if (nextHintLevel >= 2) {
      setHighlightedObjectId(instruction.placement.objectId);
    }

    if (!(spokenCommandResult && spokenCommandResult.status !== "ready") && nextHintLevel >= 3) {
      setShowTargetZoneHint(true);
    }

    const targetWord = `${targetObject?.article ?? "het"} ${targetObject?.label ?? "plaatje"}`;
    const voiceExampleHint = `Zeg bijvoorbeeld: ${instruction.prompt}`;
    const hintText =
      spokenCommandResult && spokenCommandResult.status !== "ready"
        ? voiceExampleHint
        : nextHintLevel === 1
        ? `Zoek ${targetWord}.`
        : nextHintLevel === 2
          ? `Kijk naar het plaatje dat oplicht: ${targetObject?.label ?? "plaatje"}.`
          : nextHintLevel === 3
            ? `Kijk naar de plek die oplicht.`
            : conceptExplanation[instruction.placement.relation] ?? instruction.hint;

    setFeedback({
      hintVideoUrl:
        spokenCommandResult && spokenCommandResult.status !== "ready"
          ? undefined
          : getHintVideoUrlForLevel(
              instruction.id,
              nextHintLevel,
              instruction.placement.relation,
            ),
      kind: "ready",
      mascot: "hint",
      text: hintText,
    });

    if (nextHintLevel === 1 && playAudioForFirstHint) {
      playInstructionAudio(instruction.audioText);
    }

    return true;
  };

  const playHintVideoElement = async (video: HTMLVideoElement) => {
    if (!readBezemEscapeSettings(rewardProfileId).audioEnabled) {
      return;
    }

    try {
      video.pause();
      if (video.readyState === 0) {
        video.load();
      }
      video.currentTime = 0;
      video.muted = false;
      video.volume = GAME_FOREGROUND_AUDIO_VOLUME;
      await video.play();
      handleHintVideoPlaybackStart();
    } catch {
      handleHintVideoPlaybackError();
    }
  };

  const playVisibleHintVideo = async () => {
    const feedbackElement = sceneAreaRef.current?.querySelector(
      '[data-testid="scene-builder-feedback"]',
    );
    const video = feedbackElement?.querySelector<HTMLVideoElement>(
      '[data-component="HintFeedbackVideo"]',
    );

    if (!video) {
      return;
    }

    await playHintVideoElement(video);
  };

  const playPreparedHintVideo = () => {
    if (hintVideoPressStartedRef.current) {
      return;
    }

    if (!readBezemEscapeSettings(rewardProfileId).hintsEnabled) {
      return;
    }

    const preparedVideo = sceneAreaRef.current?.querySelector<HTMLVideoElement>(
      '[data-component="HintFeedbackVideo"]',
    );

    if (!preparedVideo) {
      return;
    }

    hintVideoPressStartedRef.current = true;
    void playHintVideoElement(preparedVideo);
  };

  function handleHint() {
    let hintWasApplied = false;

    flushSync(() => {
      hintWasApplied = applyHint({ playAudioForFirstHint: false });
    });

    if (hintWasApplied && !hintVideoPressStartedRef.current) {
      void playVisibleHintVideo();
    }

    hintVideoPressStartedRef.current = false;
  }

  const handleHintVideoRequest = () => {
    if (!readBezemEscapeSettings(rewardProfileId).audioEnabled) {
      setFeedback((currentFeedback) =>
        currentFeedback
          ? {
              ...currentFeedback,
              text: `${currentFeedback.text} Audio staat uit bij instellingen.`,
            }
          : currentFeedback,
      );
      return false;
    }

    return true;
  };

  const handleHintVideoPlaybackStart = () => {
    setAudioRepeatsByInstruction((currentRepeats) => ({
      ...currentRepeats,
      [instruction.id]: (currentRepeats[instruction.id] ?? 0) + 1,
    }));
  };

  const handleHintVideoPlaybackError = () => undefined;

  const handleHintFeedbackVideoClick = (event: MouseEvent<HTMLVideoElement>) => {
    if (!handleHintVideoRequest()) {
      return;
    }

    void playHintVideoElement(event.currentTarget);
  };

  function recordActiveVocabulary(rating: keyof PracticeRatingStats) {
    const word = targetObject?.label ?? instruction.placement.objectId;

    setActivelyNamedWords((currentWords) => uniquePush(currentWords, word));
    setActiveVocabularyStats((currentStats) => ({
      ...currentStats,
      [rating]: currentStats[rating] + 1,
    }));
    setObservationNotice("Woordobservatie opgeslagen.");
    recordActiveVocabularyObservation(rewardProfileId, {
      instructionId: instruction.id,
      rating: rating as AdultRating,
      word,
    });
  }

  function recordSentenceRepeat(rating: keyof PracticeRatingStats) {
    setSentenceRepeatStats((currentStats) => ({
      ...currentStats,
      [rating]: currentStats[rating] + 1,
    }));
    setObservationNotice("Zinobservatie opgeslagen.");
    recordSentenceRepeatObservation(rewardProfileId, {
      instructionId: instruction.id,
      rating: rating as AdultRating,
      sentence: instruction.feedbackCopy.repeatAfterSuccess ?? instruction.prompt,
    });
  }

  function handleObjectDrop(objectId: string, clientX: number, clientY: number) {
    const scenePoint = getScenePointFromViewportPoint(clientX, clientY);
    const droppedZone = getZoneFromViewportPoint(clientX, clientY);
    setSelectedObjectId(objectId);
    setSpokenCommandResult(null);
    setSpokenHintZoneId(null);
    setShowTargetZoneHint(false);

    if (!scenePoint || !droppedZone) {
      setSelectedZoneId(null);
      setFeedback({
        kind: "almost",
        text: "Laat het plaatje los op de scene.",
      });
      return;
    }

    setSelectedZoneId(droppedZone.id);
    setPendingPlacement({
      objectId,
      source: "manual",
      x: scenePoint.x,
      y: scenePoint.y,
      zoneId: droppedZone.id,
    });
    setFeedback({
      kind: "ready",
      text: `Plek gekozen: ${droppedZone.label}. Je kunt nog verplaatsen. Druk daarna op Klaar.`,
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
      source: "tray",
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

      const distanceFromStart = Math.hypot(
        event.clientX - currentDragState.startX,
        event.clientY - currentDragState.startY,
      );
      const hasStartedDrag = currentDragState.hasMoved || distanceFromStart > 8;

      if (
        !currentDragState.hasMoved &&
        currentDragState.source === "tray" &&
        isHorizontalTrayScrollGesture(currentDragState, event.clientX, event.clientY)
      ) {
        suppressNextClickRef.current = true;
        updateDragState(null);
        return;
      }

      if (hasStartedDrag) {
        event.preventDefault();
      }

      updateDragState({
        ...currentDragState,
        hasMoved: hasStartedDrag,
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

    if (
      !currentDragState.hasMoved &&
      currentDragState.source === "tray" &&
      isHorizontalTrayScrollGesture(currentDragState, event.clientX, event.clientY)
    ) {
      suppressNextClickRef.current = true;
      updateDragState(null);
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

  function handleObjectPointerCancel(_event: ReactPointerEvent<HTMLButtonElement>, objectId: string) {
    const currentDragState = dragStateRef.current;

    if (!currentDragState || currentDragState.objectId !== objectId) {
      return;
    }

    updateDragState(null);
  }

  function handlePendingObjectPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || !pendingPlacement) {
      return;
    }

    const object = trayObjects.find((trayObject) => trayObject.id === pendingPlacement.objectId);

    if (!object) {
      return;
    }

    updateDragState({
      hasMoved: false,
      imageUrl: object.imageUrl,
      objectId: object.id,
      source: "scene",
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
    });
  }

  const nextHintLevel = ((activeHintsUsed + 1 - 1) % 4) + 1;
  const preparedHintVideoUrl =
    feedback || (spokenCommandResult && spokenCommandResult.status !== "ready")
      ? undefined
      : getHintVideoUrlForLevel(instruction.id, nextHintLevel, instruction.placement.relation);
  const hintFeedbackVideoUrl = feedback?.hintVideoUrl ?? preparedHintVideoUrl;
  const shouldRenderFeedbackCard = Boolean(feedback || hintFeedbackVideoUrl);
  const actionLabel =
    sceneComplete && feedback?.kind === "correct"
      ? "Opnieuw"
      : feedback?.kind === "correct"
        ? "Volgende"
        : "Klaar";

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
      data-speak-and-place-auto-executed={speakAndPlaceStats.autoExecuted}
      data-speak-and-place-retry={speakAndPlaceStats.retry}
      data-speak-and-place-self-made={speakAndPlaceStats.selfMade}
      data-speak-and-place-with-help={speakAndPlaceStats.withHelp}
      data-named-words={activelyNamedWords.join(",")}
      data-practiced-concepts={sceneCompletionSummary?.practicedConcepts.join(",") ?? ""}
      data-practiced-words={sceneCompletionSummary?.practicedWords.join(",") ?? ""}
      data-scene-complete={sceneComplete ? "true" : "false"}
      data-scene-complete-count={sceneCompletionTarget}
      data-speed-value={speedValue}
      data-unlocked-rewards={unlockedRewardIds.join(",")}
      data-sentence-repeat-good={sentenceRepeatStats.good}
      data-sentence-repeat-help={sentenceRepeatStats.help}
      data-sentence-repeat-partial={sentenceRepeatStats.partial}
      data-hint-event-count={hintEvents.length}
      data-supported-concepts={supportedSceneBuilderConcepts.join(",")}
      data-spoken-hint-zone-id={spokenHintZoneId ?? ""}
      data-spoken-command-status={spokenCommandResult?.status ?? "none"}
      data-spoken-command-transcript={spokenCommandResult?.transcript ?? ""}
      className="pointer-events-none absolute inset-0 z-10 flex flex-col gap-2 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-[calc(env(safe-area-inset-top)+0.5rem)] landscape:gap-1.5 landscape:px-3"
    >
      <SceneBuilderTopBar
        actionLabel={actionLabel}
        isCorrectFeedback={feedback?.kind === "correct"}
        onAction={handleConfirm}
        onHint={handleHint}
        onHintPointerDown={playPreparedHintVideo}
        starCount={wordStarValue}
      />

      <CompactInstructionCard
        actionControls={
          <SpokenCommandControls
            exampleText={instruction.prompt}
            onTranscript={applySpokenCommandTranscript}
            profileId={rewardProfileId}
          />
        }
        leadingControl={
          currentInstructionVideoUrl ? (
            <InstructionVideoButton
              label="Speel video-opdracht"
              onPlaybackError={handleInstructionVideoPlaybackError}
              onPlaybackStart={handleInstructionVideoPlaybackStart}
              onPlayRequest={handleInstructionVideoRequest}
              src={currentInstructionVideoUrl}
            />
          ) : undefined
        }
        text={currentInstructionText}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-2 landscape:gap-1.5">

        <section
          aria-label="Scenegebied"
          data-testid="scene-builder-scene-area"
          ref={sceneAreaRef}
          className="relative min-h-0 flex-1 overflow-hidden rounded-[1.35rem] border border-white/35 bg-white/0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
        >
          <button
            aria-label="Kies plek in de scene"
            className="pointer-events-auto absolute inset-0 touch-manipulation"
            data-testid="scene-tap-target"
            onClick={handleSceneTap}
            type="button"
          />

          {showTargetZoneHint && visualHintZone ? <TargetZoneHint zone={visualHintZone} /> : null}

          {showZoneDevTools ? (
            <SceneZoneDevTools initialZoneId={visualHintZone?.id} zones={effectiveZones} />
          ) : null}

          {placedObjects.map((placedObject) => {
            const object = objects.find((sceneObject) => sceneObject.id === placedObject.objectId);

            if (!object) {
              return null;
            }

            return (
              <img
                alt=""
                className="pointer-events-none absolute h-[clamp(3rem,12vw,5.5rem)] w-[clamp(3rem,12vw,5.5rem)] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_4px_0_rgba(15,23,42,0.16)]"
                data-testid={`placed-object-${placedObject.objectId}`}
                draggable={false}
                key={placedObject.instructionId}
                src={getBeachObjectStickerUrl(object.assetId)}
                style={{
                  left: `${placedObject.x}%`,
                  top: `${placedObject.y}%`,
                }}
              />
            );
          })}

          {pendingPlacement ? (
            (() => {
              const object = objects.find(
                (sceneObject) => sceneObject.id === pendingPlacement.objectId,
              );
              const imageUrl = object ? getBeachObjectStickerUrl(object.assetId) : undefined;

              if (!object || !imageUrl) {
                return null;
              }

              return (
                <button
                  aria-label={`Verplaats ${object.label}`}
                  className={`pointer-events-auto absolute h-[clamp(3rem,12vw,5.5rem)] w-[clamp(3rem,12vw,5.5rem)] -translate-x-1/2 -translate-y-1/2 touch-none ${
                    pendingPlacement.source === "spoken"
                      ? "drop-shadow-[0_0_18px_rgba(56,189,248,0.55)] motion-safe:animate-[bounce_550ms_ease-out_1]"
                      : ""
                  }`}
                  data-placement-source={pendingPlacement.source ?? "manual"}
                  data-testid={`pending-object-${pendingPlacement.objectId}`}
                  onPointerCancel={(event) =>
                    handleObjectPointerCancel(event, pendingPlacement.objectId)
                  }
                  onPointerDown={handlePendingObjectPointerDown}
                  onPointerMove={(event) =>
                    handleObjectPointerMove(event, pendingPlacement.objectId)
                  }
                  onPointerUp={(event) => handleObjectPointerUp(event, pendingPlacement.objectId)}
                  style={{
                    left: `${pendingPlacement.x}%`,
                    top: `${pendingPlacement.y}%`,
                  }}
                  type="button"
                >
                  <img
                    alt=""
                    className="h-full w-full object-contain drop-shadow-[0_4px_0_rgba(15,23,42,0.16)]"
                    draggable={false}
                    src={imageUrl}
                  />
                </button>
              );
            })()
          ) : null}

          <FloatingSuccessToast
            feedback={feedback}
            hintVideoUrl={shouldRenderFeedbackCard ? hintFeedbackVideoUrl : undefined}
            onHintVideoClick={handleHintFeedbackVideoClick}
            onRepeatSpokenCommand={handleRepeatSpokenCommand}
            onSpokenCommandChoice={handleSpokenCommandChoice}
            spokenCommandResult={spokenCommandResult}
          />
        </section>

        <CompactProgressBar
          boosting={speedBoosting}
          onOpenObservation={() => setShowObservationPanel(true)}
          speedMax={10}
          speedValue={speedValue}
          starMax={30}
          starValue={wordStarValue}
        />

        <ObjectCarousel>
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
        </ObjectCarousel>
      </div>

      <ParentObservationSheet
        notice={observationNotice}
        onClose={() => setShowObservationPanel(false)}
        onRecordActiveVocabulary={recordActiveVocabulary}
        onRecordSentenceRepeat={recordSentenceRepeat}
        open={showObservationPanel}
      />

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
