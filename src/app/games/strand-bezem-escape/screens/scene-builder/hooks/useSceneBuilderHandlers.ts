import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useCallback, useRef } from "react";
import {
  getConceptHintVideoUrl,
  getHighlightedObjectHintVideoUrl,
  getSeekObjectHintVideoUrl,
  sharedPlaceHintVideoUrl,
} from "../../../asset-urls";
import {
  evaluateDynamicRelationPlacement,
  usesDynamicRelationZone,
} from "../../../logic/dynamic-scene-relations";
import { appendPracticeEvent } from "../../../logic/progress";
import { resolveNewRewardUnlocks, saveUnlockedRewardIds } from "../../../logic/rewards";
import {
  executeSpokenSceneCommand,
  type SceneCommandChoice,
} from "../../../logic/scene-command-executor";
import {
  selectedZoneMatchesTarget,
  zoneSupportsConcept,
} from "../../../logic/scene-zones";
import { readBezemEscapeSettings } from "../../../logic/settings";
import { speakDutch } from "../../../logic/speech";
import type {
  AssistanceLevel,
  PracticeResult,
  SceneBuilderInstruction,
  SceneCompletionSummary,
  SceneObject,
  SceneZone,
  SpatialConcept,
} from "../../../types";
import { getScenePointFromViewportPoint, getZoneFromViewportPoint } from "../logic/scene-geometry-utils";
import type { DragState, useSceneBuilderState } from "./useSceneBuilderState";

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
  spokenCommandResult: unknown;
  spokenHelpCount: number;
}) => {
  const isSpoken = Boolean(spokenCommandResult);
  const earnedSpeed = instruction.reward.speed + (isSpoken ? 1 : 0);
  const earnedWordStars = instruction.reward.wordStars + (isSpoken ? 1 : 0);
  const assistance: AssistanceLevel =
    activeHintsUsed > 0 || spokenHelpCount > 0
      ? "hint"
      : activeAudioRepeats > 0
        ? "audio-repeat"
        : "none";
  const result: PracticeResult = assistance === "none" ? "mastered" : "supported";

  return {
    activeSpatialConcept: instruction.placement.relation,
    assistance,
    autoExecuted: isSpoken,
    earnedSpeed,
    earnedWordStars,
    independentSentence: isSpoken && assistance === "none",
    result,
    selfMadeSentence: isSpoken,
    targetWord: getObjectLabelById(objects, instruction.placement.objectId),
  };
};

export const useSceneBuilderHandlers = ({
  instructions,
  objects,
  sceneAreaRef,
  state,
  trayObjects,
}: {
  instructions: readonly SceneBuilderInstruction[];
  objects: readonly SceneObject[];
  sceneAreaRef: RefObject<HTMLElement | null>;
  state: ReturnType<typeof useSceneBuilderState>;
  trayObjects: { id: string; imageUrl: string; label: string }[];
}) => {
  const hintVideoPressStartedRef = useRef(false);

  const {
    activeAudioRepeats,
    activeHintsUsed,
    activeSpokenHelpCount,
    advanceInstruction,
    dragState,
    effectiveZones,
    feedback,
    instruction,
    pendingPlacement,
    placedObjectPoints,
    placedObjects,
    resetSceneBuilderRound,
    rewardProfileId,
    sceneComplete,
    sceneCompletionTarget,
    selectedObjectId,
    selectedZone,
    setAudioRepeatsByInstruction,
    setDragState,
    setFeedback,
    setHighlightedObjectId,
    setHintEvents,
    setHintsByInstruction,
    setPendingPlacement,
    setPlacedObjects,
    setSceneComplete,
    setSceneCompletionSummary,
    setSelectedObjectId,
    setSelectedZoneId,
    setShowTargetZoneHint,
    setSpeedValue,
    setSpokenCommandResult,
    setSpokenHelpByInstruction,
    setSpokenHintZoneId,
    setUnlockedRewardIds,
    setWordStarValue,
    speedValue,
    spokenCommandResult,
    suppressNextClickRef,
    targetObject,
    targetZone,
    unlockedRewardIds,
    wordStarValue,
  } = state;

  const updateDragState = useCallback(
    (nextDragState: DragState | null) => {
      setDragState(nextDragState);
    },
    [setDragState],
  );

  const handleObjectDrop = useCallback(
    (objectId: string, clientX: number, clientY: number) => {
      const scenePoint = getScenePointFromViewportPoint(sceneAreaRef, clientX, clientY);
      const droppedZone = getZoneFromViewportPoint(sceneAreaRef, effectiveZones, clientX, clientY);

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
    },
    [effectiveZones, sceneAreaRef, setFeedback, setPendingPlacement, setSelectedObjectId, setSelectedZoneId, setShowTargetZoneHint, setSpokenCommandResult, setSpokenHintZoneId],
  );

  const applySpokenCommandTranscript = useCallback(
    (transcript: string) => {
      const executionResult = executeSpokenSceneCommand({
        instruction,
        objects,
        placements: placedObjectPoints,
        transcript,
        zones: effectiveZones,
      });

      setSpokenCommandResult(executionResult);

      if (executionResult.status !== "ready" || !executionResult.placement) {
        setSpokenHelpByInstruction((currentHelp) => ({
          ...currentHelp,
          [instruction.id]: (currentHelp[instruction.id] ?? 0) + 1,
        }));
        setPendingPlacement(null);

        if (executionResult.visualHint.objectId) {
          setSelectedObjectId(executionResult.visualHint.objectId);
          setHighlightedObjectId(executionResult.visualHint.objectId);
        }

        if (executionResult.visualHint.zoneId) {
          setSelectedZoneId(executionResult.visualHint.zoneId);
          setSpokenHintZoneId(executionResult.visualHint.zoneId);
          setShowTargetZoneHint(true);
        }

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
    [effectiveZones, instruction, objects, placedObjectPoints, setFeedback, setHighlightedObjectId, setPendingPlacement, setSelectedObjectId, setSelectedZoneId, setShowTargetZoneHint, setSpokenCommandResult, setSpokenHelpByInstruction, setSpokenHintZoneId],
  );

  function placeCorrectObject() {
    if (!pendingPlacement) {
      return;
    }

    const nextPlacedObjects = [
      ...placedObjects.filter((placedObject) => placedObject.instructionId !== instruction.id),
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

    saveUnlockedRewardIds(rewardProfileId, nextUnlockedRewardIds);
    setPlacedObjects(nextPlacedObjects);
    setPendingPlacement(null);
    setSceneComplete(nextSceneComplete);
    setSceneCompletionSummary(nextSceneComplete ? nextCompletionSummary : null);
    setSpeedValue(nextSpeedValue);
    setWordStarValue(nextWordStarValue);
    setUnlockedRewardIds(nextUnlockedRewardIds);

    setFeedback({
      kind: "correct",
      mascot: "celebration",
      rewardLabels: newRewardUnlocks.map((r) => r.label),
      text: instruction.feedbackCopy.correct,
    });

    appendPracticeEvent(rewardProfileId, {
      activeSpatialConcept: instruction.placement.relation,
      assistance: activeHintsUsed > 0 ? "hint" : "none",
      attempts: 1,
      audioRepeats: activeAudioRepeats,
      hintsUsed: activeHintsUsed,
      id: `${instruction.id}:${Date.now()}`,
      instructionId: instruction.id,
      isCorrect: true,
      languageDomains: instruction.languageDomains,
      mode: "listen-and-place",
      result: activeHintsUsed === 0 ? "mastered" : "supported",
      spatialConcepts: instruction.spatialConcepts,
      speedEarned,
      targetWords: [targetObject?.label ?? instruction.placement.objectId],
      wordStarsEarned,
    });
  }

  function handleConfirm() {
    if (sceneComplete) {
      resetSceneBuilderRound();
      return;
    }

    if (feedback?.kind === "correct") {
      advanceInstruction();
      return;
    }

    if (!pendingPlacement || !selectedObjectId) {
      setFeedback({
        kind: "almost",
        text: "Kies eerst een plaatje en zet het op het strand.",
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
    } else if (nextHintLevel === 3) {
      setHighlightedObjectId(instruction.placement.objectId);
      setShowTargetZoneHint(true);
    } else if (nextHintLevel === 2) {
      setHighlightedObjectId(instruction.placement.objectId);
      setShowTargetZoneHint(false);
    } else {
      setHighlightedObjectId(null);
      setShowTargetZoneHint(false);
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

  const handleHint = () => {
    applyHint({ playAudioForFirstHint: true });
  };

  const playPreparedHintVideo = () => {
    if (!readBezemEscapeSettings(rewardProfileId).hintsEnabled) {
      return;
    }

    hintVideoPressStartedRef.current = true;
    applyHint({ playAudioForFirstHint: false });
  };

  const handleHintFeedbackVideoClick = () => {
    applyHint({ playAudioForFirstHint: false });
  };

  const handleObjectPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    object: { id: string; imageUrl: string; label: string },
  ) => {
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
  };

  const handleObjectPointerMove = (
    event: ReactPointerEvent<HTMLButtonElement>,
    objectId: string,
  ) => {
    const currentDragState = dragState;

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
  };

  const handleObjectPointerUp = (
    event: ReactPointerEvent<HTMLButtonElement>,
    objectId: string,
  ) => {
    const currentDragState = dragState;

    if (!currentDragState || currentDragState.objectId !== objectId) {
      return;
    }

    updateDragState(null);

    if (currentDragState.hasMoved) {
      suppressNextClickRef.current = true;
      handleObjectDrop(objectId, event.clientX, event.clientY);
    }
  };

  const handleObjectPointerCancel = (
    _event: ReactPointerEvent<HTMLButtonElement>,
    objectId: string,
  ) => {
    if (dragState?.objectId !== objectId) {
      return;
    }

    updateDragState(null);
  };

  const handlePendingObjectPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
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
  };

  const handleObjectActivate = (objectId: string) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }

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
  };

  const handleSceneTap = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!selectedObjectId) {
      setFeedback({
        kind: "almost",
        text: "Kies eerst een plaatje onderaan.",
      });
      return;
    }

    const scenePoint = getScenePointFromViewportPoint(sceneAreaRef, event.clientX, event.clientY);
    const tappedZone = getZoneFromViewportPoint(sceneAreaRef, effectiveZones, event.clientX, event.clientY);

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
    setPendingPlacement({
      objectId: selectedObjectId,
      source: "manual",
      x: scenePoint.x,
      y: scenePoint.y,
      zoneId: tappedZone.id,
    });
    setFeedback({
      kind: "ready",
      text: `Plek gekozen: ${tappedZone.label}. Je kunt nog verplaatsen. Druk daarna op Klaar.`,
    });
  };

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

  return {
    applySpokenCommandTranscript,
    handleConfirm,
    handleHint,
    handleHintFeedbackVideoClick,
    handleInstructionVideoPlaybackError,
    handleInstructionVideoPlaybackStart,
    handleInstructionVideoRequest,
    handleObjectActivate,
    handleObjectDrop,
    handleObjectPointerCancel,
    handleObjectPointerDown,
    handleObjectPointerMove,
    handleObjectPointerUp,
    handlePendingObjectPointerDown,
    handleRepeatSpokenCommand,
    handleSceneTap,
    handleSpokenCommandChoice,
    playPreparedHintVideo,
    suppressNextClickRef,
  };
};
