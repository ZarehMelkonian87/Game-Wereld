import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
import { useCallback } from "react";
import {
  getScenePointFromViewportPoint,
  getZoneFromViewportPoint,
} from "../logic/scene-geometry-utils";
import type { DragState } from "./useSceneBuilderDragAndDrop";
import type { useSceneBuilderState } from "./useSceneBuilderState";

export const useScenePointerHandlers = ({
  sceneAreaRef,
  state,
  trayObjects,
}: {
  sceneAreaRef: RefObject<HTMLElement | null>;
  state: ReturnType<typeof useSceneBuilderState>;
  trayObjects: { id: string; imageUrl: string; label: string }[];
}) => {
  const {
    dragState,
    effectiveZones,
    pendingPlacement,
    selectedObjectId,
    setDragState,
    setFeedback,
    setHighlightedObjectId,
    setPendingPlacement,
    setSelectedObjectId,
    setSelectedZoneId,
    setShowTargetZoneHint,
    setSpokenCommandResult,
    setSpokenHintZoneId,
    suppressNextClickRef,
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
    [
      effectiveZones,
      sceneAreaRef,
      setFeedback,
      setPendingPlacement,
      setSelectedObjectId,
      setSelectedZoneId,
      setShowTargetZoneHint,
      setSpokenCommandResult,
      setSpokenHintZoneId,
    ],
  );

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

  const handleObjectPointerUp = (event: ReactPointerEvent<HTMLButtonElement>, objectId: string) => {
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
    const tappedZone = getZoneFromViewportPoint(
      sceneAreaRef,
      effectiveZones,
      event.clientX,
      event.clientY,
    );

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

  return {
    handleObjectActivate,
    handleObjectDrop,
    handleObjectPointerCancel,
    handleObjectPointerDown,
    handleObjectPointerMove,
    handleObjectPointerUp,
    handlePendingObjectPointerDown,
    handleSceneTap,
    updateDragState,
  };
};
