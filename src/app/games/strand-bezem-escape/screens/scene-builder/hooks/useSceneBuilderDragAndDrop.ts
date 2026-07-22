import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { findSmallestZoneAtPoint } from "../../../logic/scene-zones";
import type { SceneZone } from "../../../types";

export interface DragState {
  hasMoved: boolean;
  imageUrl: string;
  objectId: string;
  source: "scene" | "tray";
  startX: number;
  startY: number;
  x: number;
  y: number;
}

function isHorizontalTrayScrollGesture(dragState: DragState, clientX: number, clientY: number) {
  const deltaX = clientX - dragState.startX;
  const deltaY = clientY - dragState.startY;

  return Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
}

export const useSceneBuilderDragAndDrop = ({
  dragState,
  effectiveZones,
  handleObjectDrop,
  sceneAreaRef,
  setDragState,
  suppressNextClickRef,
}: {
  dragState: DragState | null;
  effectiveZones: SceneZone[];
  handleObjectDrop: (objectId: string, clientX: number, clientY: number) => void;
  sceneAreaRef: RefObject<HTMLElement | null>;
  setDragState: (dragState: DragState | null) => void;
  suppressNextClickRef: { current: boolean };
}) => {
  const dragStateRef = useRef<DragState | null>(null);
  const handleObjectDropRef = useRef(handleObjectDrop);

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  useEffect(() => {
    handleObjectDropRef.current = handleObjectDrop;
  }, [handleObjectDrop]);

  useEffect(() => {
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
        dragStateRef.current = null;
        setDragState(null);
        return;
      }

      if (hasStartedDrag) {
        event.preventDefault();
      }

      const nextDragState: DragState = {
        ...currentDragState,
        hasMoved: hasStartedDrag,
        x: event.clientX,
        y: event.clientY,
      };

      dragStateRef.current = nextDragState;
      setDragState(nextDragState);
    }

    function handleWindowPointerUp(event: globalThis.PointerEvent) {
      const currentDragState = dragStateRef.current;

      if (!currentDragState) {
        return;
      }

      dragStateRef.current = null;
      setDragState(null);

      if (currentDragState.hasMoved) {
        suppressNextClickRef.current = true;
        handleObjectDropRef.current(currentDragState.objectId, event.clientX, event.clientY);
      }
    }

    function handleWindowPointerCancel() {
      if (dragStateRef.current) {
        dragStateRef.current = null;
        setDragState(null);
      }
    }

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: false });
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerCancel);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerCancel);
    };
  }, [setDragState, suppressNextClickRef]);

  return {
    suppressNextClickRef,
  };
};
