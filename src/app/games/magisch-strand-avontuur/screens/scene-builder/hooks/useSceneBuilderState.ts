import { useEffect, useMemo, useRef, useState } from "react";
import { getInstructionVideoUrl } from "../../../asset-urls";
import {
  getDynamicRelationHintZone,
  type SceneObjectPlacementPoint,
} from "../../../logic/dynamic-scene-relations";
import { readUnlockedRewardIds } from "../../../logic/rewards";
import {
  applySceneZoneVisualHintOverrides,
  zoneVisualHintOverridesChangedEvent,
} from "../../../logic/scene-zone-visual-overrides";
import type { SceneBuilderInstruction, SceneObject, SceneZone } from "../../../types";
import type {
  FeedbackState,
  HintUsageEvent,
  PendingPlacement,
  PlacedObject,
  SceneCommandExecutionResult,
  SceneCompletionSummary,
} from "../logic/scene-builder-types";
import type { DragState } from "./useSceneBuilderDragAndDrop";
import { useGameRuntime } from "../../../runtime/GameRuntimeContext";
export type { FeedbackState, HintUsageEvent, PendingPlacement };
export const useSceneBuilderState = ({
  instructions,
  instructionText,
  objects,
  zones,
}: {
  instructions: readonly SceneBuilderInstruction[];
  instructionText?: string;
  objects: readonly SceneObject[];
  zones: SceneZone[];
}) => {
  const runtime = useGameRuntime();
  const rewardProfileId = runtime.identity.profileId;
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(0);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [pendingPlacement, setPendingPlacement] = useState<PendingPlacement | null>(null);
  const [spokenCommandResult, setSpokenCommandResult] =
    useState<SceneCommandExecutionResult | null>(null);
  const [appliedSpokenCommandPreviewText, setAppliedSpokenCommandPreviewText] = useState<
    string | null
  >(null);
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);
  const [sceneComplete, setSceneComplete] = useState(false);
  const [sceneCompletionSummary, setSceneCompletionSummary] =
    useState<SceneCompletionSummary | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [showTargetZoneHint, setShowTargetZoneHint] = useState(false);
  const [isHintVideoPlaying, setIsHintVideoPlaying] = useState(false);
  const [voiceRecognitionStatus, setVoiceRecognitionStatus] = useState<string>("idle");
  const [zoneOverrideVersion, setZoneOverrideVersion] = useState(0);
  const [spokenHintZoneId, setSpokenHintZoneId] = useState<string | null>(null);
  const [highlightedObjectId, setHighlightedObjectId] = useState<string | null>(null);
  const [audioRepeatsByInstruction, setAudioRepeatsByInstruction] = useState<
    Record<string, number>
  >({});
  const [hintsByInstruction, setHintsByInstruction] = useState<Record<string, number>>({});
  const [hintEvents, setHintEvents] = useState<HintUsageEvent[]>([]);
  const [spokenHelpByInstruction, setSpokenHelpByInstruction] = useState<Record<string, number>>(
    {},
  );
  const [speedValue, setSpeedValue] = useState(0);
  const [wordStarValue, setWordStarValue] = useState(0);
  const suppressNextClickRef = useRef(false);
  const [unlockedRewardIds, setUnlockedRewardIds] = useState<string[]>(() =>
    readUnlockedRewardIds(rewardProfileId, runtime.storage),
  );
  const effectiveZones = useMemo(() => {
    void zoneOverrideVersion;
    return applySceneZoneVisualHintOverrides(zones, runtime.storage);
  }, [runtime.storage, zones, zoneOverrideVersion]);
  const placedObjectPoints = useMemo<SceneObjectPlacementPoint[]>(
    () =>
      placedObjects.map((placedObject) => ({
        objectId: placedObject.objectId,
        x: placedObject.x,
        y: placedObject.y,
      })),
    [placedObjects],
  );
  useEffect(() => {
    const handleOverridesChanged = () => {
      setZoneOverrideVersion((v) => v + 1);
    };
    if (typeof window !== "undefined") {
      window.addEventListener(zoneVisualHintOverridesChangedEvent, handleOverridesChanged);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(zoneVisualHintOverridesChangedEvent, handleOverridesChanged);
      }
    };
  }, []);
  const instruction = instructions[activeInstructionIndex] ?? instructions[0];
  const currentInstructionText = instructionText ?? instruction.prompt;
  const currentInstructionVideoUrl = getInstructionVideoUrl(instruction.id);
  const sceneCompletionTarget = instructions.length;
  const targetObject = useMemo(
    () => objects.find((object) => object.id === instruction.placement.objectId),
    [instruction.placement.objectId, objects],
  );
  const selectedZone = useMemo(
    () => effectiveZones.find((zone) => zone.id === selectedZoneId),
    [effectiveZones, selectedZoneId],
  );
  const targetZone = useMemo(
    () => effectiveZones.find((zone) => zone.id === instruction.placement.zoneId),
    [effectiveZones, instruction.placement.zoneId],
  );
  const visualHintZone = useMemo(() => {
    if (spokenHintZoneId) {
      return effectiveZones.find((zone) => zone.id === spokenHintZoneId);
    }
    return (
      getDynamicRelationHintZone({
        anchorObjectIds: instruction.placement.anchorObjectIds,
        placements: placedObjectPoints,
        relation: instruction.placement.relation,
        zoneId: instruction.placement.zoneId,
      }) ?? targetZone
    );
  }, [
    effectiveZones,
    instruction.placement.anchorObjectIds,
    instruction.placement.relation,
    instruction.placement.zoneId,
    placedObjectPoints,
    spokenHintZoneId,
    targetZone,
  ]);
  const activeHintsUsed = hintsByInstruction[instruction.id] ?? 0;
  const activeAudioRepeats = audioRepeatsByInstruction[instruction.id] ?? 0;
  const activeSpokenHelpCount = spokenHelpByInstruction[instruction.id] ?? 0;
  const resetSceneBuilderRound = () => {
    setActiveInstructionIndex(0);
    setSelectedObjectId(null);
    setSelectedZoneId(null);
    setPendingPlacement(null);
    setPlacedObjects([]);
    setSceneComplete(false);
    setSceneCompletionSummary(null);
    setFeedback(null);
    setShowTargetZoneHint(false);
    setIsHintVideoPlaying(false);
    setSpokenHintZoneId(null);
    setHighlightedObjectId(null);
    setSpokenCommandResult(null);
  };
  const advanceInstruction = () => {
    if (activeInstructionIndex < instructions.length - 1) {
      setActiveInstructionIndex((index) => index + 1);
      setSelectedObjectId(null);
      setSelectedZoneId(null);
      setPendingPlacement(null);
      setSpokenCommandResult(null);
      setShowTargetZoneHint(false);
      setIsHintVideoPlaying(false);
      setSpokenHintZoneId(null);
      setHighlightedObjectId(null);
      setFeedback(null);
    } else {
      setSceneComplete(true);
    }
  };
  return {
    activeAudioRepeats,
    activeHintsUsed,
    activeInstructionIndex,
    activeSpokenHelpCount,
    advanceInstruction,
    appliedSpokenCommandPreviewText,
    audioRepeatsByInstruction,
    currentInstructionText,
    currentInstructionVideoUrl,
    dragState,
    effectiveZones,
    feedback,
    highlightedObjectId,
    hintEvents,
    hintsByInstruction,
    instruction,
    isHintVideoPlaying,
    pendingPlacement,
    placedObjectPoints,
    placedObjects,
    resetSceneBuilderRound,
    rewardProfileId,
    sceneComplete,
    sceneCompletionSummary,
    sceneCompletionTarget,
    selectedObjectId,
    selectedZone,
    setAppliedSpokenCommandPreviewText,
    setAudioRepeatsByInstruction,
    setDragState,
    setFeedback,
    setHighlightedObjectId,
    setHintEvents,
    setHintsByInstruction,
    setIsHintVideoPlaying,
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
    setVoiceRecognitionStatus,
    setWordStarValue,
    showTargetZoneHint,
    speedValue,
    spokenCommandResult,
    spokenHelpByInstruction,
    spokenHintZoneId,
    suppressNextClickRef,
    targetObject,
    targetZone,
    unlockedRewardIds,
    visualHintZone,
    voiceRecognitionStatus,
    wordStarValue,
  };
};
