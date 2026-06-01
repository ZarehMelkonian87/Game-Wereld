import { CheckCircle2, Sparkles } from "lucide-react";
import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  selectedZoneMatchesTarget,
  supportedSceneBuilderConcepts,
  zoneSupportsConcept,
} from "../logic/scene-zones";
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
import { useProfile } from "../../../contexts/ProfileContext";

interface SceneBuilderScreenProps {
  instructions: SceneBuilderInstruction[];
  instructionText?: string;
  objects: SceneObject[];
  onStartRace?: () => void;
  spokenCommandPreviewText?: string;
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
  onStartRace,
  spokenCommandPreviewText,
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
  const instruction = instructions[activeInstructionIndex] ?? instructions[0];
  const currentInstructionText = instructionText ?? instruction.prompt;
  const selectedZone = zones.find((zone) => zone.id === selectedZoneId);
  const targetZone = zones.find((zone) => zone.id === instruction.placement.zoneId);
  const visualHintZone = zones.find((zone) => zone.id === spokenHintZoneId) ?? targetZone;
  const targetObject = objects.find((object) => object.id === instruction.placement.objectId);
  const activeAudioRepeats = audioRepeatsByInstruction[instruction.id] ?? 0;
  const activeHintsUsed = hintsByInstruction[instruction.id] ?? 0;
  const activeSpokenHelpCount = spokenHelpByInstruction[instruction.id] ?? 0;

  useEffect(() => {
    setUnlockedRewardIds(readUnlockedRewardIds(rewardProfileId));
  }, [rewardProfileId]);

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

    return findSmallestZoneAtPoint(zones, scenePoint);
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
      const executionResult = executeSpokenSceneCommand({ objects, transcript, zones });
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
      rewardProfileId,
      zones,
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

    const chosenZone = zones.find((zone) => zone.id === choice.id);
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
    const nextSceneComplete = nextPlacedObjects.length >= 5;
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
        nextSceneComplete ? "De scene is klaar. Je kunt de race starten!" : "",
        nextSceneComplete ? "Druk op Start race." : "Druk op Volgende.",
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  function startRace() {
    if (typeof window !== "undefined" && sceneCompletionSummary) {
      window.sessionStorage.setItem(
        "woordenschat-bezem-escape:race-state",
        JSON.stringify(sceneCompletionSummary),
      );
    }

    onStartRace?.();
  }

  function handleConfirm() {
    if (sceneComplete && feedback?.kind === "correct") {
      startRace();
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
    const isCorrectZone = selectedZoneMatchesTarget(selectedZone, targetZone);
    const isCorrectRelation = zoneSupportsConcept(selectedZone, instruction.placement.relation);

    if (isCorrectObject && isCorrectZone && isCorrectRelation) {
      placeCorrectObject();
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

  function handleHint() {
    if (!readBezemEscapeSettings(rewardProfileId).hintsEnabled) {
      setFeedback({
        kind: "ready",
        mascot: "hint",
        text: "Hints staan uit bij instellingen.",
      });
      return;
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
      data-scene-complete-count={5}
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
      className="pointer-events-none absolute inset-0 z-10 px-3 pb-3 pt-[4.75rem] landscape:px-3 landscape:pb-3 landscape:pt-[4.25rem]"
    >
      <TopHud
        onAudioClick={() => playInstructionAudio()}
        onHintClick={handleHint}
        showParentBack
        starCount={wordStarValue}
      />

      <div className="grid h-full min-h-0 grid-rows-[4.5rem_minmax(0,1fr)_3.75rem_5rem] gap-2 landscape:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)] landscape:grid-rows-[4.5rem_minmax(0,1fr)_4.5rem]">
        <div
          className="grid min-h-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2 landscape:col-start-1 landscape:row-start-1"
          data-component="SceneBuilderCommandRow"
          data-slot="command-row"
        >
          <InstructionBubble
            aria-label="Opdrachtgebied"
            data-testid="scene-builder-instruction-area"
            onAudioClick={() => playInstructionAudio()}
            text={currentInstructionText}
            className="h-full min-h-0"
          />
          <SpokenCommandControls
            exampleText={instruction.prompt}
            onTranscript={applySpokenCommandTranscript}
            profileId={rewardProfileId}
          />
        </div>

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

          {showTargetZoneHint && visualHintZone ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute rounded-[1.5rem] border-4 border-dashed border-amber-400 bg-amber-200/20 shadow-[0_0_0_5px_rgba(255,255,255,0.72)]"
              data-testid="target-zone-hint"
              style={{
                height: `${visualHintZone.height}%`,
                left: `${visualHintZone.x}%`,
                top: `${visualHintZone.y}%`,
                width: `${visualHintZone.width}%`,
              }}
            />
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
                  {spokenCommandResult && feedback.kind !== "correct" ? (
                    <div
                      className="mt-2 flex flex-wrap items-center gap-1.5"
                      data-testid="spoken-command-actions"
                    >
                      {spokenCommandResult.status !== "ready"
                        ? spokenCommandResult.choices.slice(0, 4).map((choice) => (
                            <button
                              className="min-h-8 rounded-xl border-2 border-sky-300 bg-sky-100 px-2 text-[0.65rem] font-black text-sky-950"
                              data-choice-id={choice.id}
                              data-choice-type={choice.type}
                              key={`${choice.type}-${choice.id}`}
                              onClick={() => handleSpokenCommandChoice(choice)}
                              type="button"
                            >
                              Bedoel je {choice.label}?
                            </button>
                          ))
                        : null}
                      <button
                        className="min-h-8 rounded-xl border-2 border-amber-300 bg-amber-100 px-2 text-[0.65rem] font-black text-amber-950"
                        data-testid="repeat-spoken-command"
                        onClick={handleRepeatSpokenCommand}
                        type="button"
                      >
                        Opnieuw zeggen
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
              {feedback.kind === "correct" ? (
                <div
                  data-testid="active-language-panel"
                  className="mt-2 rounded-2xl border border-sky-200 bg-sky-50/85 p-2 text-[0.65rem] font-black leading-tight text-slate-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[0.72rem] text-slate-900">
                        Ouder-observatie
                      </p>
                      <p className="truncate text-[0.62rem] text-slate-600">
                        Optioneel: bewaar hoe het praten ging.
                      </p>
                    </div>
                    <button
                      className="min-h-9 shrink-0 rounded-xl border-2 border-sky-300 bg-white/80 px-3 text-[0.68rem] text-sky-900"
                      data-testid="toggle-observation-panel"
                      onClick={() => setShowObservationPanel((isVisible) => !isVisible)}
                      type="button"
                    >
                      {showObservationPanel ? "Sluit" : "Invullen"}
                    </button>
                  </div>
                  {observationNotice ? (
                    <p
                      className="mt-1 text-[0.62rem] text-emerald-800"
                      data-testid="observation-notice"
                    >
                      {observationNotice}
                    </p>
                  ) : null}
                  {showObservationPanel ? (
                    <div className="mt-2 grid gap-2 landscape:grid-cols-2">
                      <div className="min-w-0">
                        <p className="mb-1 truncate text-slate-900">
                          Heeft het kind het woord gezegd?
                        </p>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            className="min-h-9 rounded-xl border-2 border-emerald-300 bg-emerald-100 px-1"
                            data-testid="active-vocabulary-good"
                            onClick={() => recordActiveVocabulary("good")}
                            type="button"
                          >
                            Zelf
                          </button>
                          <button
                            className="min-h-9 rounded-xl border-2 border-amber-300 bg-amber-100 px-1"
                            data-testid="active-vocabulary-partial"
                            onClick={() => recordActiveVocabulary("partial")}
                            type="button"
                          >
                            Bijna
                          </button>
                          <button
                            className="min-h-9 rounded-xl border-2 border-sky-300 bg-sky-100 px-1"
                            data-testid="active-vocabulary-help"
                            onClick={() => recordActiveVocabulary("help")}
                            type="button"
                          >
                            Hulp
                          </button>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="mb-1 truncate text-slate-900">
                          Heeft het kind de zin nagezegd?
                        </p>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            className="min-h-9 rounded-xl border-2 border-emerald-300 bg-emerald-100 px-1"
                            data-testid="sentence-repeat-good"
                            onClick={() => recordSentenceRepeat("good")}
                            type="button"
                          >
                            Goed
                          </button>
                          <button
                            className="min-h-9 rounded-xl border-2 border-amber-300 bg-amber-100 px-1"
                            data-testid="sentence-repeat-partial"
                            onClick={() => recordSentenceRepeat("partial")}
                            type="button"
                          >
                            Deels
                          </button>
                          <button
                            className="min-h-9 rounded-xl border-2 border-sky-300 bg-sky-100 px-1"
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
              {sceneComplete && feedback?.kind === "correct"
                ? "Start race"
                : feedback?.kind === "correct"
                  ? "Volgende"
                  : "Klaar"}
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
