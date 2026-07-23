import { useEffect, useMemo, useRef } from "react";
import { getBeachObjectStickerUrl } from "../asset-urls";
import { ObjectStickerButton } from "../components/ui";
import { classNames } from "../components/ui/classNames";
import { supportedSceneBuilderConcepts } from "../logic/scene-zones";
import { readBezemEscapeSettings } from "../logic/settings";
import { useGameRuntime } from "../runtime/GameRuntimeContext";
import type { SceneBuilderInstruction, SceneObject, SceneZone } from "../types";
import { CompactInstructionCard } from "./scene-builder/CompactInstructionCard";
import { SceneAreaCanvas } from "./scene-builder/components/SceneAreaCanvas";
import { FloatingSuccessToast } from "./scene-builder/FloatingSuccessToast";
import { useSceneBuilderDragAndDrop } from "./scene-builder/hooks/useSceneBuilderDragAndDrop";
import { useSceneBuilderHandlers } from "./scene-builder/hooks/useSceneBuilderHandlers";
import { useSceneBuilderState } from "./scene-builder/hooks/useSceneBuilderState";
import { InstructionVideoButton } from "./scene-builder/InstructionVideoButton";
import { ObjectCarousel } from "./scene-builder/ObjectCarousel";
import { SceneBuilderTopBar } from "./scene-builder/SceneBuilderTopBar";
import { SpokenCommandControls } from "./scene-builder/SpokenCommandControls";
interface SceneBuilderScreenProps {
  instructionText?: string;
  instructions: readonly SceneBuilderInstruction[];
  objects: readonly SceneObject[];
  onBackToMenu: () => void;
  showTrayLabels?: boolean;
  showZoneDevTools?: boolean;
  spokenCommandPreviewText?: string | null;
  zones: SceneZone[];
}
const getTrayObjects = (objects: readonly SceneObject[]) =>
  objects.map((object) => ({
    id: object.id,
    imageUrl: getBeachObjectStickerUrl(object.assetId),
    label: object.label,
  }));
export const SceneBuilderScreen = ({
  instructions,
  instructionText,
  objects,
  onBackToMenu,
  showTrayLabels = false,
  showZoneDevTools = false,
  spokenCommandPreviewText,
  zones,
}: SceneBuilderScreenProps) => {
  const runtime = useGameRuntime();
  const sceneAreaRef = useRef<HTMLElement>(null);
  const state = useSceneBuilderState({ instructions, instructionText, objects, zones });
  const trayObjects = useMemo(() => getTrayObjects(objects), [objects]);
  const {
    activeAudioRepeats,
    activeHintsUsed,
    appliedSpokenCommandPreviewText,
    currentInstructionText,
    currentInstructionVideoUrl,
    dragState,
    effectiveZones,
    feedback,
    highlightedObjectId,
    hintEvents,
    instruction,
    isHintVideoPlaying,
    pendingPlacement,
    placedObjects,
    rewardProfileId,
    sceneComplete,
    sceneCompletionSummary,
    sceneCompletionTarget,
    selectedObjectId,
    selectedZone,
    setAppliedSpokenCommandPreviewText,
    setDragState,
    setIsHintVideoPlaying,
    setVoiceRecognitionStatus,
    showTargetZoneHint,
    spokenCommandResult,
    spokenHintZoneId,
    targetZone,
    targetObject,
    unlockedRewardIds,
    visualHintZone,
    voiceRecognitionStatus,
    wordStarValue,
  } = state;
  const {
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
    handleSceneKeyboardPlace,
    handleSceneTap,
    handleSpokenCommandChoice,
    playPreparedHintVideo,
  } = useSceneBuilderHandlers({
    instructions,
    objects,
    sceneAreaRef,
    state,
    trayObjects,
  });
  useSceneBuilderDragAndDrop({
    dragState,
    handleObjectDrop,
    setDragState,
    suppressNextClickRef: state.suppressNextClickRef,
  });
  useEffect(() => {
    if (!spokenCommandPreviewText || appliedSpokenCommandPreviewText === spokenCommandPreviewText) {
      return;
    }
    applySpokenCommandTranscript(spokenCommandPreviewText);
    setAppliedSpokenCommandPreviewText(spokenCommandPreviewText);
  }, [
    appliedSpokenCommandPreviewText,
    applySpokenCommandTranscript,
    setAppliedSpokenCommandPreviewText,
    spokenCommandPreviewText,
  ]);
  const actionLabel =
    sceneComplete && feedback?.kind === "correct"
      ? "Opnieuw"
      : feedback?.kind === "correct"
        ? "Volgende"
        : "Klaar";
  return (
    <div
      className="absolute inset-0 z-10 overflow-hidden"
      data-active-audio-repeats={activeAudioRepeats}
      data-active-hints-used={activeHintsUsed}
      data-active-instruction-id={instruction.id}
      data-active-relation={instruction.placement.relation}
      data-audio-supported={runtime.speech.isRecognitionAvailable() ? "true" : "false"}
      data-hint-event-count={hintEvents.length}
      data-feedback-kind={feedback?.kind ?? "none"}
      data-mode="listen-and-place"
      data-practiced-concepts={sceneCompletionSummary?.practicedConcepts.join(",") ?? ""}
      data-practiced-words={sceneCompletionSummary?.practicedWords.join(",") ?? ""}
      data-scene-builder-screen="true"
      data-scene-complete={sceneComplete ? "true" : "false"}
      data-scene-complete-count={sceneCompletionTarget}
      data-selected-zone-id={selectedZone?.id ?? ""}
      data-selected-zone-concepts={selectedZone?.supportedConcepts.join(",") ?? ""}
      data-selected-object-id={selectedObjectId ?? ""}
      data-spoken-command-status={spokenCommandResult?.status ?? "none"}
      data-spoken-command-transcript={spokenCommandResult?.transcript ?? ""}
      data-spoken-hint-zone-id={spokenHintZoneId ?? ""}
      data-supported-concepts={supportedSceneBuilderConcepts.join(",")}
      data-target-zone-id={targetZone?.id ?? ""}
      data-target-object-id={targetObject?.id ?? ""}
      data-testid="scene-builder-screen"
      data-unlocked-rewards={unlockedRewardIds.join(",")}
    >
      <SceneAreaCanvas
        effectiveZones={effectiveZones}
        handleObjectPointerCancel={handleObjectPointerCancel}
        handleObjectPointerMove={handleObjectPointerMove}
        handleObjectPointerUp={handleObjectPointerUp}
        handlePendingObjectPointerDown={handlePendingObjectPointerDown}
        handleSceneKeyboardPlace={handleSceneKeyboardPlace}
        handleSceneTap={handleSceneTap}
        isHintVideoPlaying={isHintVideoPlaying}
        objects={objects}
        pendingPlacement={pendingPlacement}
        placedObjects={placedObjects}
        sceneAreaRef={sceneAreaRef}
        showTargetZoneHint={showTargetZoneHint}
        showZoneDevTools={showZoneDevTools}
        selectedObjectId={selectedObjectId}
        visualHintZone={visualHintZone}
        voiceRecognitionStatus={voiceRecognitionStatus}
      />

      <div
        className={classNames(
          "pointer-events-none absolute inset-0 z-10 flex flex-col gap-2 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-[calc(env(safe-area-inset-top)+0.5rem)] landscape:gap-1.5 landscape:px-3 transition-opacity duration-300",
          showZoneDevTools ? "opacity-20 pointer-events-none" : "",
        )}
      >
        <SceneBuilderTopBar
          actionLabel={actionLabel}
          isCorrectFeedback={feedback?.kind === "correct"}
          onAction={handleConfirm}
          onBackToMenu={onBackToMenu}
          onHint={handleHint}
          onHintPointerDown={playPreparedHintVideo}
          starCount={wordStarValue}
        />

        <CompactInstructionCard
          actionControls={
            <SpokenCommandControls
              exampleText={instruction.prompt}
              onTranscript={applySpokenCommandTranscript}
              onVoiceStatusChange={setVoiceRecognitionStatus}
              profileId={rewardProfileId}
            />
          }
          leadingControl={
            currentInstructionVideoUrl ? (
              <InstructionVideoButton
                autoPlayOnMount={
                  readBezemEscapeSettings(rewardProfileId, runtime.storage).audioEnabled
                }
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

        <div className="flex-1 min-h-0 pointer-events-none" />

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

      <div className={showZoneDevTools ? "opacity-20 pointer-events-none" : ""}>
        <FloatingSuccessToast
          autoPlayFeedbackVideo={
            readBezemEscapeSettings(rewardProfileId, runtime.storage).audioEnabled
          }
          feedback={feedback}
          hintVideoUrl={feedback?.hintVideoUrl}
          onHintVideoClick={handleHintFeedbackVideoClick}
          onHintVideoPlaybackStateChange={setIsHintVideoPlaying}
          onRepeatSpokenCommand={handleRepeatSpokenCommand}
          onSpokenCommandChoice={handleSpokenCommandChoice}
          spokenCommandResult={spokenCommandResult}
        />
      </div>

      {dragState ? (
        <div
          className="pointer-events-none fixed z-50 h-24 w-24 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl transition-transform duration-75"
          data-slot="drag-preview"
          style={{
            left: `${dragState.x}px`,
            top: `${dragState.y}px`,
          }}
        >
          <img
            alt=""
            className="h-full w-full object-contain"
            draggable={false}
            src={dragState.imageUrl}
          />
        </div>
      ) : null}
    </div>
  );
};
SceneBuilderScreen.displayName = "SceneBuilderScreen";
