import { useRef } from "react";
import type { SceneZone } from "../../types";
import { ZoneDevToolsOverlay } from "./components/ZoneDevToolsOverlay";
import { ZoneDevToolsPanel } from "./components/ZoneDevToolsPanel";
import { useZoneDevToolsState } from "./hooks/useZoneDevToolsState";

interface SceneZoneDevToolsProps {
  initialZoneId?: string;
  zones: SceneZone[];
}

export const SceneZoneDevTools = ({ initialZoneId, zones }: SceneZoneDevToolsProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const {
    activePoints,
    activeZone,
    copyStatus,
    deleteSelectedPoint,
    dockPanel,
    generatedPath,
    handleAddPoint,
    handleClearPoints,
    handleCopyPath,
    handlePanelDragStart,
    handlePointDragStart,
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
  } = useZoneDevToolsState({ initialZoneId, panelRef, rootRef, zones });

  return (
    <div
      aria-label="Zone devtools"
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
      data-component="SceneZoneDevTools"
      data-testid="scene-zone-devtools"
      ref={rootRef}
    >
      <ZoneDevToolsOverlay
        activePoints={activePoints}
        activeZone={activeZone}
        generatedPath={generatedPath}
        handleAddPoint={handleAddPoint}
        handlePointDragStart={handlePointDragStart}
        rootRef={rootRef}
        selectedPointIndex={selectedPointIndex}
        setSelectedPointIndex={setSelectedPointIndex}
        zones={zones}
      />

      <ZoneDevToolsPanel
        activePoints={activePoints}
        activeZone={activeZone}
        copyStatus={copyStatus}
        deleteSelectedPoint={deleteSelectedPoint}
        dockPanel={dockPanel}
        generatedPath={generatedPath}
        handleClearPoints={handleClearPoints}
        handleCopyPath={handleCopyPath}
        handlePanelDragStart={handlePanelDragStart}
        handleResetSavedPath={handleResetSavedPath}
        handleSavePath={handleSavePath}
        handleUndoPoint={handleUndoPoint}
        isCollapsed={isCollapsed}
        nudgePoint={nudgePoint}
        panelPosition={panelPosition}
        panelRef={panelRef}
        selectedPointIndex={selectedPointIndex}
        setActiveZoneId={setActiveZoneId}
        setCopyStatus={setCopyStatus}
        setIsCollapsed={setIsCollapsed}
        setSelectedPointIndex={setSelectedPointIndex}
        zones={zones}
      />
    </div>
  );
};

SceneZoneDevTools.displayName = "SceneZoneDevTools";
