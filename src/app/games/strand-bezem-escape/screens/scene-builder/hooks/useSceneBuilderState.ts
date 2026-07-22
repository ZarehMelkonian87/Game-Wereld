import { useEffect, useMemo, useRef, useState } from "react";
import { useProfile } from "../../../../../contexts/ProfileContext";
import { getInstructionVideoUrl } from "../../../asset-urls";
import {
  getDynamicRelationHintZone,
  type SceneObjectPlacementPoint,
} from "../../../logic/dynamic-scene-relations";
import {
  readUnlockedRewardIds,
} from "../../../logic/rewards";
import {
  applySceneZoneVisualHintOverrides,
  zoneVisualHintOverridesChangedEvent,
} from "../../../logic/scene-zone-visual-overrides";
import type { SceneCommandExecutionResult } from "../../../logic/scene-command-executor";
import type {
  PlacedObject,
  SceneBuilderInstruction,
  SceneCompletionSummary,
  SceneObject,
  SceneZone,
} from "../../../types";
import type { DragState } from "./useSceneBuilderDragAndDrop";

export interface PendingPlacement {
  objectId: string;
  source?: "manual" | "spoken";
  transcript?: string;
  x: number;
  y: number;
  zoneId: string;
}

export interface FeedbackState {
  hintVideoUrl?: string;
  kind: "almost" | "correct" | "ready";
  mascot?: "celebration" | "hint";
  repeatText?: string;
  rewardLabels?: string[];
  text: string;
}

export interface HintUsageEvent {
  hintLevel: number;
  instructionId: string;
  usedAt: string;
}

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
  const { currentProfile } = useProfile();
  const rewardProfileId = currentProfile?.id ?? "demo-profile";

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
  const [isHintVideoPlaying, setIsHintVideoPlaying] = useState(false);
  const [voiceRecognitionStatus, setVoiceRecognitionStatus] = useState<string>("idle");
  const [zoneOverrideVersion, setZoneOverrideVersion] = useState(0);
  const [spokenHintZoneId, setSpokenHintZoneId] = useState<string | null>(null);
  const [highlightedObjectId, setHighlightedObjectId] = useState<string | null>(null);
  const [audioRepeatsByInstruction, setAudioRepeatsByInstruction] = useState<Record<string, number>>({});
  const [hintsByInstruction, setHintsByInstruction] = useState<Record<string, number>>({});
  const [hintEvents, setHintEvents] = useState<HintUsageEvent[]>([]);
  const [spokenHelpByInstruction, setSpokenHelpByInstruction] = useState<Record<string, number>>({});
  const [speedValue, setSpeedValue] = useState(0);
  const [wordStarValue, setWordStarValue] = useState(0);
  const suppressNextClickRef = useRef(false);
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
    const handleZoneOverridesChanged = () => {
      setZoneOverrideVersion((currentVersion) => currentVersion + 1);
    };

    window.addEventListener(zoneVisualHintOverridesChangedEvent, handleZoneOverridesChanged);

    return () => {
      window.removeEventListener(zoneVisualHintOverridesChangedEvent, handleZoneOverridesChanged);
    };
  }, []);

  function resetSelection() {
    setSelectedObjectId(null);
    setSelectedZoneId(null);
    setPendingPlacement(null);
    setSpokenCommandResult(null);
    setShowTargetZoneHint(false);
    setSpokenHintZoneId(null);
    setHighlightedObjectId(null);
  }

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

  useEffect(() => {
    resetSceneBuilderRound();
  }, [instructions]);

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
    resetSelection,
    rewardProfileId,
    sceneComplete,

    sceneCompletionSummary,
    sceneCompletionTarget,

    selectedObjectId,
    selectedZone,
    selectedZoneId,
    setActiveInstructionIndex,

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
