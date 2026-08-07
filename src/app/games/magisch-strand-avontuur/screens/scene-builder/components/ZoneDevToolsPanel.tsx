import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { classNames } from "../../../components/ui/classNames";
import type { SceneZone } from "../../../types";
import type { PanelPosition, ZonePoint } from "../logic/zone-devtools-utils";

interface ZoneDevToolsPanelProps {
  activePoints: ZonePoint[];
  activeZone?: SceneZone;
  copyStatus: string;
  deleteSelectedPoint: () => void;
  dockPanel: (corner: "top-left" | "top-right" | "bottom-left" | "bottom-right") => void;
  generatedPath: string;
  handleClearPoints: () => void;
  handleCopyPath: () => void;
  handlePanelDragStart: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  handleResetSavedPath: () => void;
  handleSavePath: () => void;
  handleUndoPoint: () => void;
  isCollapsed: boolean;
  nudgePoint: (deltaX: number, deltaY: number) => void;
  panelPosition: PanelPosition;
  panelRef: RefObject<HTMLElement>;
  selectedPointIndex: number | null;
  setActiveZoneId: (zoneId: string) => void;
  setCopyStatus: (status: string) => void;
  setIsCollapsed: (collapsed: boolean) => void;
  setSelectedPointIndex: (index: number | null) => void;
  zones: SceneZone[];
}

export const ZoneDevToolsPanel = ({
  activePoints,
  activeZone,
  copyStatus,
  deleteSelectedPoint,
  dockPanel,
  generatedPath,
  handleClearPoints,
  handleCopyPath,
  handlePanelDragStart,
  handleResetSavedPath,
  handleSavePath,
  handleUndoPoint,
  isCollapsed,
  nudgePoint,
  panelPosition,
  panelRef,
  selectedPointIndex,
  setActiveZoneId,
  setCopyStatus,
  setIsCollapsed,
  setSelectedPointIndex,
  zones,
}: ZoneDevToolsPanelProps) => {
  if (isCollapsed) {
    return (
      <button
        aria-label="Zone editor uitklappen"
        className="pointer-events-auto absolute z-30 flex items-center gap-1.5 rounded-2xl border-2 border-slate-900/30 bg-slate-950/92 px-3 py-2 text-white shadow-[0_4px_0_rgba(15,23,42,0.25)] backdrop-blur-md active:scale-95"
        onClick={() => setIsCollapsed(false)}
        style={{
          left: `${panelPosition.x}px`,
          top: `${panelPosition.y}px`,
        }}
        type="button"
      >
        <span className="text-xs font-black text-amber-300">🛠 {activeZone?.id ?? "Zone"}</span>
        <span className="text-[0.65rem] font-bold text-slate-300">({activePoints.length} pnt)</span>
        <span className="ml-1 rounded-xl bg-amber-400 px-2 py-0.5 text-[0.65rem] font-black text-slate-950">
          Open ✏️
        </span>
      </button>
    );
  }

  return (
    <section
      className="pointer-events-auto absolute z-30 grid w-[min(15.5rem,calc(100vw-1rem))] gap-1.5 rounded-2xl border-2 border-slate-900/20 bg-white/95 p-2 text-slate-950 shadow-[0_6px_0_rgba(15,23,42,0.18)] backdrop-blur-md"
      data-slot="panel"
      ref={panelRef}
      style={{
        left: `${panelPosition.x}px`,
        top: `${panelPosition.y}px`,
      }}
    >
      <div className="flex items-center justify-between gap-1">
        <button
          aria-label="Devtools verplaatsen"
          className="flex min-h-8 flex-1 touch-none items-center justify-between rounded-xl border-2 border-slate-700 bg-slate-950 px-2 text-left text-white active:translate-y-0.5"
          data-testid="scene-zone-devtools-drag-handle"
          onPointerDown={handlePanelDragStart}
          type="button"
        >
          <span className="text-[0.72rem] font-black leading-none text-amber-300">🛠 Zone Tool</span>
          <span className="text-[0.6rem] font-bold text-slate-400">Sleep ✥</span>
        </button>
        <div className="flex items-center gap-0.5 rounded-xl border border-slate-300 bg-slate-100 p-0.5">
          <button
            className="h-6 w-6 rounded-lg text-[0.65rem] font-black text-slate-800 hover:bg-slate-200 active:bg-amber-400"
            onClick={() => dockPanel("top-left")}
            title="Linksboven"
            type="button"
          >
            ↖
          </button>
          <button
            className="h-6 w-6 rounded-lg text-[0.65rem] font-black text-slate-800 hover:bg-slate-200 active:bg-amber-400"
            onClick={() => dockPanel("top-right")}
            title="Rechtsboven"
            type="button"
          >
            ↗
          </button>
          <button
            className="h-6 w-6 rounded-lg text-[0.65rem] font-black text-slate-800 hover:bg-slate-200 active:bg-amber-400"
            onClick={() => dockPanel("bottom-left")}
            title="Linksonder"
            type="button"
          >
            ↙
          </button>
          <button
            className="h-6 w-6 rounded-lg text-[0.65rem] font-black text-slate-800 hover:bg-slate-200 active:bg-amber-400"
            onClick={() => dockPanel("bottom-right")}
            title="Rechtsonder"
            type="button"
          >
            ↘
          </button>
        </div>
        <button
          aria-label="Inklappen"
          className="flex min-h-8 min-w-8 items-center justify-center rounded-xl border-2 border-slate-300 bg-slate-100 text-xs font-black text-slate-800 active:scale-95"
          onClick={() => setIsCollapsed(true)}
          title="Inklappen"
          type="button"
        >
          _
        </button>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-1.5">
        <label className="grid min-w-0 gap-0.5 text-[0.56rem] font-black uppercase leading-none text-slate-600">
          Zone
          <select
            className="min-h-9 rounded-xl border-2 border-slate-300 bg-white px-2 text-[0.75rem] font-black normal-case text-slate-950 shadow-sm"
            data-testid="scene-zone-devtools-zone-select"
            onChange={(event) => {
              setActiveZoneId(event.currentTarget.value);
              setSelectedPointIndex(null);
              setCopyStatus("");
            }}
            value={activeZone?.id ?? ""}
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.id} - {zone.label}
              </option>
            ))}
          </select>
        </label>
        <span className="rounded-xl bg-amber-100 px-2 py-1.5 text-center text-[0.62rem] font-black leading-tight text-amber-950">
          {activePoints.length} pnt
        </span>
      </div>

      {selectedPointIndex !== null && activePoints[selectedPointIndex] ? (
        <div className="grid gap-1 rounded-xl border border-amber-300 bg-amber-50/80 p-1.5">
          <div className="flex items-center justify-between text-[0.65rem] font-black text-amber-950">
            <span>
              Punt {selectedPointIndex + 1}: ({activePoints[selectedPointIndex].x},{" "}
              {activePoints[selectedPointIndex].y})
            </span>
            <button
              className="rounded-lg bg-rose-200 px-1.5 py-0.5 text-[0.6rem] font-black text-rose-950 active:scale-95"
              onClick={deleteSelectedPoint}
              type="button"
            >
              🗑 Wis
            </button>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[0.6rem] font-bold text-amber-900">Stel in:</span>
            <div className="flex gap-1">
              <button
                className="h-7 w-7 rounded-lg border border-amber-300 bg-white text-xs font-black active:bg-amber-200"
                onClick={() => nudgePoint(-0.5, 0)}
                title="Naar links"
                type="button"
              >
                ◄
              </button>
              <button
                className="h-7 w-7 rounded-lg border border-amber-300 bg-white text-xs font-black active:bg-amber-200"
                onClick={() => nudgePoint(0.5, 0)}
                title="Naar rechts"
                type="button"
              >
                ►
              </button>
              <button
                className="h-7 w-7 rounded-lg border border-amber-300 bg-white text-xs font-black active:bg-amber-200"
                onClick={() => nudgePoint(0, -0.5)}
                title="Omhoog"
                type="button"
              >
                ▲
              </button>
              <button
                className="h-7 w-7 rounded-lg border border-amber-300 bg-white text-xs font-black active:bg-amber-200"
                onClick={() => nudgePoint(0, 0.5)}
                title="Omlaag"
                type="button"
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-5 gap-1">
        <button
          className="min-h-8 rounded-xl border-2 border-slate-300 bg-white px-1 text-[0.6rem] font-black text-slate-950 active:translate-y-0.5"
          onClick={handleUndoPoint}
          type="button"
        >
          Undo
        </button>
        <button
          className="min-h-8 rounded-xl border-2 border-rose-300 bg-rose-50 px-1 text-[0.6rem] font-black text-rose-950 active:translate-y-0.5"
          onClick={handleClearPoints}
          type="button"
        >
          Wis
        </button>
        <button
          className="min-h-8 rounded-xl border-2 border-emerald-500 bg-emerald-100 px-1 text-[0.6rem] font-black text-emerald-950 active:translate-y-0.5"
          onClick={handleSavePath}
          type="button"
        >
          Save
        </button>
        <button
          className="min-h-8 rounded-xl border-2 border-sky-400 bg-sky-50 px-1 text-[0.6rem] font-black text-sky-950 active:translate-y-0.5"
          onClick={handleCopyPath}
          type="button"
        >
          Copy
        </button>
        <button
          className="min-h-8 rounded-xl border-2 border-slate-300 bg-slate-50 px-1 text-[0.6rem] font-black text-slate-800 active:translate-y-0.5"
          onClick={handleResetSavedPath}
          type="button"
        >
          Reset
        </button>
      </div>

      <code
        className={classNames(
          "block max-h-12 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-950/95 p-1.5 text-[0.58rem] font-bold leading-tight text-amber-100",
          !generatedPath && "text-slate-400",
        )}
        data-testid="scene-zone-devtools-path"
      >
        {generatedPath ? `visualHintPath: "${generatedPath}",` : "Tik op scherm voor punten."}
      </code>

      <p
        aria-live="polite"
        className="min-h-3 truncate text-[0.58rem] font-black leading-tight text-slate-700"
      >
        {copyStatus || "Tik scherm voor punten. Sleep of gebruik ◄►▲▼."}
      </p>
    </section>
  );
};

ZoneDevToolsPanel.displayName = "ZoneDevToolsPanel";
