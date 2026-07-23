import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SceneZone } from "../../../types";
import {
  buildPathFromPoints,
  clamp,
  formatPointValue,
  getEditablePointsFromZone,
  getPointFromBounds,
  type PointDragState,
  type ZonePoint,
} from "../logic/zone-devtools-utils";

export const useZoneDevToolsPoints = ({
  activeZone,
  rootRef,
}: {
  activeZone: SceneZone | undefined;
  rootRef: RefObject<HTMLDivElement>;
}) => {
  const pointDragStateRef = useRef<PointDragState | null>(null);
  const [pointsByZone, setPointsByZone] = useState<Record<string, ZonePoint[]>>({});
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState("");

  const activePoints = useMemo(
    () => (activeZone ? (pointsByZone[activeZone.id] ?? []) : []),
    [activeZone, pointsByZone],
  );
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

  const getPointFromClientPoint = useCallback(
    (clientX: number, clientY: number) => {
      const bounds = rootRef.current?.getBoundingClientRect();

      if (!bounds) {
        return undefined;
      }

      return getPointFromBounds(bounds, clientX, clientY);
    },
    [rootRef],
  );

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const pointDragState = pointDragStateRef.current;

      if (!pointDragState) {
        return;
      }

      const point = getPointFromClientPoint(event.clientX, event.clientY);

      if (!point) {
        return;
      }

      setPointsByZone((currentPoints) => ({
        ...currentPoints,
        [pointDragState.zoneId]: (currentPoints[pointDragState.zoneId] ?? []).map(
          (currentPoint, index) => (index === pointDragState.index ? point : currentPoint),
        ),
      }));
      setCopyStatus("");
    }

    function handlePointerUp() {
      pointDragStateRef.current = null;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [getPointFromClientPoint]);

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

    event.stopPropagation();
    event.preventDefault();

    startPointDrag(activeZone.id, pointIndex);
  };

  return {
    activePoints,
    copyStatus,
    deleteSelectedPoint,
    generatedPath,
    handleAddPoint,
    handleClearPoints,
    handlePointDragStart,
    handleUndoPoint,
    movePointToClientPoint,
    nudgePoint,
    selectedPointIndex,
    setCopyStatus,
    setSelectedPointIndex,
  };
};
