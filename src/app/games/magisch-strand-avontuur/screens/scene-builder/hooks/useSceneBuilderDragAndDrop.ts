import { useEffect, useRef } from "react";
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
const isHorizontalTrayScrollGesture = (dragState: DragState, clientX: number, clientY: number) => {
  const deltaX = clientX - dragState.startX;
  const deltaY = clientY - dragState.startY;
  return Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
};
export const useSceneBuilderDragAndDrop = ({
  dragState,
  handleObjectDrop,
  setDragState,
  suppressNextClickRef,
}: {
  dragState: DragState | null;
  handleObjectDrop: (objectId: string, clientX: number, clientY: number) => void;
  setDragState: (dragState: DragState | null) => void;
  suppressNextClickRef: {
    current: boolean;
  };
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
    const handleWindowPointerMove = (event: globalThis.PointerEvent) => {
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
    };
    const handleWindowPointerUp = (event: globalThis.PointerEvent) => {
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
    };
    const handleWindowPointerCancel = () => {
      if (dragStateRef.current) {
        dragStateRef.current = null;
        setDragState(null);
      }
    };
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
