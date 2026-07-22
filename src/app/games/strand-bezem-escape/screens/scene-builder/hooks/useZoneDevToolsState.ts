import type { RefObject } from "react";
import { useState } from "react";
import {
  clearSceneZoneVisualHintOverride,
  saveSceneZoneVisualHintOverride,
} from "../../../logic/scene-zone-visual-overrides";
import type { SceneZone } from "../../../types";
import { useZoneDevToolsDocking } from "./useZoneDevToolsDocking";
import { useZoneDevToolsPoints } from "./useZoneDevToolsPoints";

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
  const [activeZoneId, setActiveZoneId] = useState(initialZoneId ?? zones[0]?.id ?? "");

  const activeZone = zones.find((zone) => zone.id === activeZoneId) ?? zones[0];

  const docking = useZoneDevToolsDocking({ panelRef, rootRef });
  const points = useZoneDevToolsPoints({ activeZone, rootRef });

  const {
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
  } = points;

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

  return {
    activePoints,
    activeZone,
    activeZoneId,
    copyStatus,
    deleteSelectedPoint,
    dockPanel: docking.dockPanel,
    generatedPath,
    handleAddPoint,
    handleClearPoints,
    handleCopyPath,
    handlePointDragStart,
    handleResetSavedPath,
    handleSavePath,
    handleUndoPoint,
    isCollapsed: docking.isCollapsed,
    movePointToClientPoint,
    nudgePoint,
    panelPosition: docking.panelPosition,
    selectedPointIndex,
    setActiveZoneId,
    setIsCollapsed: docking.setIsCollapsed,
    setSelectedPointIndex,
    startPanelDrag: docking.startPanelDrag,
  };
};
