import type { RefObject } from "react";
import type { SceneBuilderInstruction, SceneObject } from "../../../types";
import type { useSceneBuilderState } from "./useSceneBuilderState";
import { useSceneHintHandlers } from "./useSceneHintHandlers";
import { useScenePlacementHandlers } from "./useScenePlacementHandlers";
import { useScenePointerHandlers } from "./useScenePointerHandlers";
import { useSceneSpokenCommandHandlers } from "./useSceneSpokenCommandHandlers";

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
  const placement = useScenePlacementHandlers({ instructions, objects, state });
  const hints = useSceneHintHandlers({ state });
  const pointers = useScenePointerHandlers({ sceneAreaRef, state, trayObjects });
  const spoken = useSceneSpokenCommandHandlers({ objects, state });

  return {
    applySpokenCommandTranscript: spoken.applySpokenCommandTranscript,
    handleConfirm: placement.handleConfirm,
    handleHint: hints.handleHint,
    handleHintFeedbackVideoClick: hints.handleHintFeedbackVideoClick,
    handleInstructionVideoPlaybackError: hints.handleInstructionVideoPlaybackError,
    handleInstructionVideoPlaybackStart: hints.handleInstructionVideoPlaybackStart,
    handleInstructionVideoRequest: hints.handleInstructionVideoRequest,
    handleObjectActivate: pointers.handleObjectActivate,
    handleObjectDrop: pointers.handleObjectDrop,
    handleObjectPointerCancel: pointers.handleObjectPointerCancel,
    handleObjectPointerDown: pointers.handleObjectPointerDown,
    handleObjectPointerMove: pointers.handleObjectPointerMove,
    handleObjectPointerUp: pointers.handleObjectPointerUp,
    handlePendingObjectPointerDown: pointers.handlePendingObjectPointerDown,
    handleRepeatSpokenCommand: spoken.handleRepeatSpokenCommand,
    handleSceneTap: pointers.handleSceneTap,
    handleSpokenCommandChoice: spoken.handleSpokenCommandChoice,
    playInstructionAudio: hints.playInstructionAudio,
    playPreparedHintVideo: hints.playPreparedHintVideo,
  };
};
