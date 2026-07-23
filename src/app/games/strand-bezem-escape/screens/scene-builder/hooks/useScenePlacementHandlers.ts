import { useRef } from "react";
import {
  evaluateDynamicRelationPlacement,
  usesDynamicRelationZone,
} from "../../../logic/dynamic-scene-relations";
import { resolveNewRewardUnlocks, saveUnlockedRewardIds } from "../../../logic/rewards";
import { createInstructionPracticeObservation } from "../../../logic/practice-observations";
import { selectedZoneMatchesTarget, zoneSupportsConcept } from "../../../logic/scene-zones";
import type { SceneBuilderInstruction, SceneObject, SpatialConcept } from "../../../types";
import type { SceneCompletionSummary } from "../logic/scene-builder-types";
import { getSpeakAndPlaceReward } from "../logic/scene-placement-utils";
import type { useSceneBuilderState } from "./useSceneBuilderState";
import { useGameRuntime } from "../../../runtime/GameRuntimeContext";
export const useScenePlacementHandlers = ({
  instructions,
  objects,
  state,
}: {
  instructions: readonly SceneBuilderInstruction[];
  objects: readonly SceneObject[];
  state: ReturnType<typeof useSceneBuilderState>;
}) => {
  const runtime = useGameRuntime();
  const attemptNumbersRef = useRef<Record<string, number>>({});
  const {
    activeAudioRepeats,
    activeHintsUsed,
    activeSpokenHelpCount,
    advanceInstruction,
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
    setFeedback,
    setPendingPlacement,
    setPlacedObjects,
    setSceneComplete,
    setSceneCompletionSummary,
    setShowTargetZoneHint,
    setSpeedValue,
    setUnlockedRewardIds,
    setWordStarValue,
    speedValue,
    spokenCommandResult,
    targetZone,
    unlockedRewardIds,
    wordStarValue,
  } = state;
  const createObservationContext = () => {
    const attemptNumber = (attemptNumbersRef.current[instruction.id] ?? 0) + 1;
    attemptNumbersRef.current[instruction.id] = attemptNumber;
    return createInstructionPracticeObservation({
      instructionReplays: activeAudioRepeats,
      languageDomains: instruction.languageDomains,
      outcome: "incorrect",
      spatialConcepts: instruction.spatialConcepts,
      spokenHelp: activeSpokenHelpCount,
      taskId: instruction.id,
      visualHints: activeHintsUsed,
      vocabularyId: instruction.placement.objectId,
      attemptNumber,
    });
  };
  const placeCorrectObject = () => {
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
        .map(
          (placedObject) =>
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
    saveUnlockedRewardIds(rewardProfileId, nextUnlockedRewardIds, runtime.storage);
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
    void runtime.practice.append({
      ...createObservationContext(),
      outcome: "correct",
    });
  };
  const handleConfirm = () => {
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
    void runtime.practice.append({
      ...createObservationContext(),
      outcome: "incorrect",
    });
    setShowTargetZoneHint(true);
    setFeedback({
      kind: "almost",
      text: instruction.feedbackCopy.almost ?? `${instruction.hint} Kijk naar de plek die oplicht.`,
    });
  };
  return {
    handleConfirm,
    placeCorrectObject,
  };
};
