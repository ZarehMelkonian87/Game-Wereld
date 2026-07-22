import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  clearSceneZoneVisualHintOverride,
  saveSceneZoneVisualHintOverride,
} from "../../../logic/scene-zone-visual-overrides";
import type { SceneZone } from "../../../types";
import {
  buildPathFromPoints,
  clamp,
  formatPointValue,
  getEditablePointsFromZone,
  getPointFromBounds,
  type PanelDragState,
  type PanelPosition,
  type PointDragState,
  type ZonePoint,
} from "../logic/zone-devtools-utils";

export const useZoneDevToolsState = ({
  initialZoneId,
  panelRef,
  rootRef,
  zones,
}: {
  initialZoneId?: string;
  panelRef: RefObject<HTMLElement | null>;
  rootRef: RefObject<HTMLDivElement | null>;
  zones: SceneZone[];
}) => {
  const dragStateRef = useRef<PanelDragState | null>(null);
  const pointDragStateRef = useRef<PointDragState | null>(null);

  const [activeZoneId, setActiveZoneId] = useState(initialZoneId ?? zones[0]?.id ?? "");
  const [pointsByZone, setPointsByZone] = useState<Record<string, ZonePoint[]>>({});
  const [panelPosition, setPanelPosition] = useState<PanelPosition>({ x: 12, y: 72 });
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeZone = zones.find((zone) => zone.id === activeZoneId) ?? zones[0];
  const activePoints = activeZone ? pointsByZone[activeZone.id] ?? [] : [];
  const generatedPath = useMemo(() => buildPathFromPoints(activePoints), [activePoints]);

  useEffect(() => {
    if (!activeZone) {
      return;
    }

    const existingPoints = getEditablePointsFromZone(activeZone);

    if (existingPoints.length === 0) {
      return;
    }

    setPointsByZone((currentPoints) => {
      if (currentPoints[activeZone.id] !== undefined) {
        return currentPoints;
      }

      return {
        ...currentPoints,
        [activeZone.id]: existingPoints,
      };
    });
  }, [activeZone]);

  const getPointFromClientPoint = (clientX: number, clientY: number) => {
    const bounds = rootRef.current?.getBoundingClientRect();

    if (!bounds) {
      return undefined;
    }

    return getPointFromBounds(bounds, clientX, clientY);
  };

  const handleAddPoint = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!activeZone) {
      return;
    }

    const point = getPointFromClientPoint(event.clientX, event.clientY);

    if (!point) {
      return;
    }

    setPointsByZone((currentPoints) => ({
      ...currentPoints,
      [activeZone.id]: [...(currentPoints[activeZone.id] ?? []), point],
    }));
    setSelectedPointIndex(activePoints.length);
    setCopyStatus("");
  };

  const handleUndoPoint = () => {
    if (!activeZone) {
      return;
    }

    setPointsByZone((currentPoints) => ({
      ...currentPoints,
      [activeZone.id]: (currentPoints[activeZone.id] ?? []).slice(0, -1),
    }));
    setSelectedPointIndex((currentIndex) => {
      if (currentIndex === null) {
        return null;
      }

      return Math.max(0, currentIndex - 1);
    });
    setCopyStatus("");
  };

  const handleClearPoints = () => {
    if (!activeZone) {
      return;
    }

    setPointsByZone((currentPoints) => ({
      ...currentPoints,
      [activeZone.id]: [],
    }));
    setSelectedPointIndex(null);
    setCopyStatus("");
  };

  const handleCopyPath = async () => {
    if (!generatedPath) {
      setCopyStatus("Plaats eerst punten.");
      return;
    }

    try {
      await navigator.clipboard.writeText(`visualHintPath: "${generatedPath}",`);
      setCopyStatus("Path gekopieerd.");
    } catch {
      setCopyStatus("Kopieren lukt niet.");
    }
  };

  const handleSavePath = () => {
    if (!activeZone || !generatedPath) {
      setCopyStatus("Plaats eerst punten.");
      return;
    }

    saveSceneZoneVisualHintOverride(activeZone.id, generatedPath);
    setCopyStatus(`Opgeslagen: ${activeZone.label}.`);
  };

  const handleResetSavedPath = () => {
    if (!activeZone) {
      return;
    }

    clearSceneZoneVisualHintOverride(activeZone.id);
    setCopyStatus(`Reset: ${activeZone.label}.`);
  };

  const nudgePoint = (deltaX: number, deltaY: number) => {
    if (!activeZone || selectedPointIndex === null) {
      return;
    }

    setPointsByZone((currentPoints) => {
      const zonePoints = currentPoints[activeZone.id] ?? [];

      return {
        ...currentPoints,
        [activeZone.id]: zonePoints.map((point, index) => {
          if (index !== selectedPointIndex) {
            return point;
          }

          return {
            x: clamp(formatPointValue(point.x + deltaX), 0, 100),
            y: clamp(formatPointValue(point.y + deltaY), 0, 100),
          };
        }),
      };
    });
    setCopyStatus("");
  };

  const deleteSelectedPoint = () => {
    if (!activeZone || selectedPointIndex === null) {
      return;
    }

    setPointsByZone((currentPoints) => {
      const zonePoints = currentPoints[activeZone.id] ?? [];

      return {
        ...currentPoints,
        [activeZone.id]: zonePoints.filter((_, index) => index !== selectedPointIndex),
      };
    });
    setSelectedPointIndex(null);
    setCopyStatus("");
  };

  const movePanelToClientPoint = (clientX: number, clientY: number) => {
    const rootBounds = rootRef.current?.getBoundingClientRect();
    const panelBounds = panelRef.current?.getBoundingClientRect();
    const dragState = dragStateRef.current;

    if (!rootBounds || !panelBounds || !dragState) {
      return;
    }

    const maxX = Math.max(6, rootBounds.width - panelBounds.width - 6);
    const maxY = Math.max(6, rootBounds.height - panelBounds.height - 6);

    setPanelPosition({
      x: clamp(clientX - rootBounds.left - dragState.offsetX, 6, maxX),
      y: clamp(clientY - rootBounds.top - dragState.offsetY, 6, maxY),
    });
  };

  const dockPanel = (corner: "top-left" | "top-right" | "bottom-left" | "bottom-right") => {
    const rootBounds = rootRef.current?.getBoundingClientRect();
    const panelBounds = panelRef.current?.getBoundingClientRect();
    const width = panelBounds?.width ?? 240;
    const height = panelBounds?.height ?? 220;
    const rootW = rootBounds?.width ?? (typeof window !== "undefined" ? window.innerWidth : 360);
    const rootH = rootBounds?.height ?? (typeof window !== "undefined" ? window.innerHeight : 640);

    const margin = 12;

    switch (corner) {
      case "top-left":
        setPanelPosition({ x: margin, y: margin });
        break;
      case "top-right":
        setPanelPosition({ x: Math.max(margin, rootW - width - margin), y: margin });
        break;
      case "bottom-left":
        setPanelPosition({ x: margin, y: Math.max(margin, rootH - height - margin) });
        break;
      case "bottom-right":
        setPanelPosition({
          x: Math.max(margin, rootW - width - margin),
          y: Math.max(margin, rootH - height - margin),
        });
        break;
    }
  };

  const startPanelDrag = (clientX: number, clientY: number) => {
    const panelBounds = panelRef.current?.getBoundingClientRect();

    if (!panelBounds) {
      return;
    }

    dragStateRef.current = {
      offsetX: clientX - panelBounds.left,
      offsetY: clientY - panelBounds.top,
    };
  };

  const movePointToClientPoint = (
    zoneId: string,
    pointIndex: number,
    clientX: number,
    clientY: number,
  ) => {
    const point = getPointFromClientPoint(clientX, clientY);

    if (!point) {
      return;
    }

    setPointsByZone((currentPoints) => ({
      ...currentPoints,
      [zoneId]: (currentPoints[zoneId] ?? []).map((currentPoint, index) =>
        index === pointIndex ? point : currentPoint,
      ),
    }));
    setCopyStatus("");
  };

  const startPointDrag = (zoneId: string, pointIndex: number) => {
    pointDragStateRef.current = {
      index: pointIndex,
      zoneId,
    };
    setSelectedPointIndex(pointIndex);
  };

  const handlePointDragStart = (
    event: ReactPointerEvent<HTMLButtonElement>,
    pointIndex: number,
  ) => {
    if (!activeZone || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    startPointDrag(activeZone.id, pointIndex);
  };

  const handlePointDragMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = pointDragStateRef.current;

    if (!dragState) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    movePointToClientPoint(dragState.zoneId, dragState.index, event.clientX, event.clientY);
  };

  const handlePointDragEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!pointDragStateRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    pointDragStateRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointMouseDown = (
    event: ReactMouseEvent<HTMLButtonElement>,
    pointIndex: number,
  ) => {
    if (!activeZone) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    startPointDrag(activeZone.id, pointIndex);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dragState = pointDragStateRef.current;

      if (!dragState) {
        return;
      }

      moveEvent.preventDefault();
      movePointToClientPoint(
        dragState.zoneId,
        dragState.index,
        moveEvent.clientX,
        moveEvent.clientY,
      );
    };

    const handleMouseUp = () => {
      pointDragStateRef.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handlePanelDragStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    startPanelDrag(event.clientX, event.clientY);
  };

  const handlePanelDragMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragStateRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    movePanelToClientPoint(event.clientX, event.clientY);
  };

  const handlePanelDragEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragStateRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePanelMouseDown = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    startPanelDrag(event.clientX, event.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      movePanelToClientPoint(moveEvent.clientX, moveEvent.clientY);
    };

    const handleMouseUp = () => {
      dragStateRef.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return {
    activePoints,
    activeZone,
    activeZoneId,
    copyStatus,
    deleteSelectedPoint,
    dockPanel,
    generatedPath,
    handleAddPoint,
    handleClearPoints,
    handleCopyPath,
    handlePanelDragEnd,
    handlePanelDragMove,
    handlePanelDragStart,
    handlePanelMouseDown,
    handlePointDragEnd,
    handlePointDragMove,
    handlePointDragStart,
    handlePointMouseDown,
    handleResetSavedPath,
    handleSavePath,
    handleUndoPoint,
    isCollapsed,
    nudgePoint,
    panelPosition,
    selectedPointIndex,
    setActiveZoneId,
    setCopyStatus,
    setIsCollapsed,
    setSelectedPointIndex,
  };
};
