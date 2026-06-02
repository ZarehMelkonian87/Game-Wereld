import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { classNames } from "../../components/ui/classNames";
import {
  clearSceneZoneVisualHintOverride,
  saveSceneZoneVisualHintOverride,
} from "../../logic/scene-zone-visual-overrides";
import { parseSimplePolygonPath } from "../../logic/scene-zones";
import type { SceneZone } from "../../types";

interface SceneZoneDevToolsProps {
  initialZoneId?: string;
  zones: SceneZone[];
}

interface ZonePoint {
  x: number;
  y: number;
}

interface PanelPosition {
  x: number;
  y: number;
}

interface PanelDragState {
  offsetX: number;
  offsetY: number;
}

interface PointDragState {
  index: number;
  zoneId: string;
}

const zoneColors = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

const formatPointValue = (value: number) => Number(value.toFixed(1));

const formatPoint = (point: ZonePoint) =>
  `${formatPointValue(point.x)} ${formatPointValue(point.y)}`;

const buildPathFromPoints = (points: ZonePoint[]) => {
  if (points.length === 0) {
    return "";
  }

  const [firstPoint, ...restPoints] = points;
  const pathParts = [
    `M${formatPoint(firstPoint)}`,
    ...restPoints.map((point) => `L${formatPoint(point)}`),
  ];

  return points.length > 2 ? `${pathParts.join(" ")} Z` : pathParts.join(" ");
};

const getPointFromBounds = (
  bounds: DOMRect,
  clientX: number,
  clientY: number,
): ZonePoint => {
  const x = ((clientX - bounds.left) / bounds.width) * 100;
  const y = ((clientY - bounds.top) / bounds.height) * 100;

  return {
    x: Math.min(100, Math.max(0, formatPointValue(x))),
    y: Math.min(100, Math.max(0, formatPointValue(y))),
  };
};

const getZoneColor = (zoneIndex: number) => zoneColors[zoneIndex % zoneColors.length];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getEditablePointsFromZone = (zone?: SceneZone): ZonePoint[] =>
  parseSimplePolygonPath(zone?.visualHintPath).map((point) => ({
    x: formatPointValue(point.x),
    y: formatPointValue(point.y),
  }));

const ZoneShape = ({
  active,
  color,
  zone,
}: {
  active: boolean;
  color: string;
  zone: SceneZone;
}) => {
  if (zone.visualHintPath) {
    return (
      <path
        d={zone.visualHintPath}
        fill={active ? `${color}33` : `${color}18`}
        fillRule="evenodd"
        stroke={color}
        strokeDasharray={active ? "1.5 1.2" : "0.7 1.5"}
        strokeOpacity={active ? 0.98 : 0.48}
        strokeWidth={active ? 0.9 : 0.55}
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  return (
    <rect
      fill={active ? `${color}24` : `${color}12`}
      height={zone.height}
      rx="2"
      stroke={color}
      strokeDasharray={active ? "1.5 1.2" : "0.7 1.5"}
      strokeOpacity={active ? 0.98 : 0.48}
      strokeWidth={active ? 0.9 : 0.55}
      vectorEffect="non-scaling-stroke"
      width={zone.width}
      x={zone.x}
      y={zone.y}
    />
  );
};

ZoneShape.displayName = "ZoneShape";

export const SceneZoneDevTools = ({ initialZoneId, zones }: SceneZoneDevToolsProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const dragStateRef = useRef<PanelDragState | null>(null);
  const pointDragStateRef = useRef<PointDragState | null>(null);
  const [activeZoneId, setActiveZoneId] = useState(initialZoneId ?? zones[0]?.id ?? "");
  const [pointsByZone, setPointsByZone] = useState<Record<string, ZonePoint[]>>({});
  const [panelPosition, setPanelPosition] = useState<PanelPosition>({ x: 8, y: 8 });
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
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

  return (
    <div
      aria-label="Zone devtools"
      className="pointer-events-none absolute inset-0 z-50"
      data-component="SceneZoneDevTools"
      data-testid="scene-zone-devtools"
      ref={rootRef}
    >
      <button
        aria-label="Zonepunt toevoegen"
        className="pointer-events-auto absolute inset-0 z-10 cursor-crosshair bg-transparent"
        data-testid="scene-zone-devtools-add-point-target"
        onClick={handleAddPoint}
        type="button"
      />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        data-slot="zone-overlay"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {zones.map((zone, zoneIndex) => (
          <g key={zone.id}>
            <ZoneShape
              active={zone.id === activeZone?.id}
              color={getZoneColor(zoneIndex)}
              zone={zone}
            />
            <text
              fill={getZoneColor(zoneIndex)}
              fontSize="2.4"
              fontWeight="900"
              paintOrder="stroke"
              stroke="white"
              strokeWidth="0.45"
              x={zone.x + 1}
              y={zone.y + 3}
            >
              {zone.id}
            </text>
          </g>
        ))}

        {activePoints.length > 0 ? (
          <path
            d={generatedPath}
            fill="rgba(251,191,36,0.24)"
            stroke="#f59e0b"
            strokeDasharray="1.6 1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="0.9"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}

      </svg>

      <div
        aria-label="Zonepunten"
        className="pointer-events-none absolute inset-0 z-[25]"
        data-testid="scene-zone-devtools-point-handles"
      >
        {activePoints.map((point, index) => {
          const selected = selectedPointIndex === index;

          return (
            <button
              aria-label={`Punt ${index + 1} verplaatsen`}
              className={classNames(
                "pointer-events-auto absolute grid h-[1.125rem] w-[1.125rem] -translate-x-1/2 -translate-y-1/2 touch-none cursor-grab place-items-center rounded-full border-2 text-[0.52rem] font-black leading-none active:cursor-grabbing",
                selected
                  ? "border-slate-950 bg-amber-300 text-slate-950"
                  : "border-slate-950/70 bg-amber-100 text-slate-950",
              )}
              data-testid={`scene-zone-devtools-point-${index}`}
              key={`${point.x}-${point.y}-${index}-handle`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setSelectedPointIndex(index);
              }}
              onMouseDown={(event) => handlePointMouseDown(event, index)}
              onPointerCancel={handlePointDragEnd}
              onPointerDown={(event) => handlePointDragStart(event, index)}
              onPointerMove={handlePointDragMove}
              onPointerUp={handlePointDragEnd}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
              type="button"
            >
              <span aria-hidden="true">{index + 1}</span>
            </button>
          );
        })}
      </div>

      <section
        className="pointer-events-auto absolute z-30 grid w-[min(13.25rem,calc(100%-0.75rem))] gap-1 rounded-2xl border-2 border-slate-900/20 bg-white/92 p-1 text-slate-950 shadow-[0_4px_0_rgba(15,23,42,0.18)] backdrop-blur-md"
        data-slot="panel"
        ref={panelRef}
        style={{
          left: `${panelPosition.x}px`,
          top: `${panelPosition.y}px`,
        }}
      >
        <button
          aria-label="Devtools verplaatsen"
          className="flex min-h-7 touch-none items-center justify-between rounded-xl border-2 border-slate-200 bg-slate-950 px-2 text-left text-white active:translate-y-0.5"
          data-testid="scene-zone-devtools-drag-handle"
          onPointerCancel={handlePanelDragEnd}
          onPointerDown={handlePanelDragStart}
          onPointerMove={handlePanelDragMove}
          onPointerUp={handlePanelDragEnd}
          onMouseDown={handlePanelMouseDown}
          type="button"
        >
          <span className="text-[0.7rem] font-black leading-none">Zone tool</span>
          <span className="text-[0.62rem] font-black leading-none text-amber-200">sleep</span>
        </button>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-1">
          <label className="grid min-w-0 gap-0.5 text-[0.54rem] font-black uppercase leading-none text-slate-600">
            Zone
            <select
              className="min-h-7 rounded-xl border-2 border-slate-300 bg-white px-1.5 text-[0.68rem] font-black normal-case text-slate-950"
              data-testid="scene-zone-devtools-zone-select"
              onChange={(event) => {
                setActiveZoneId(event.currentTarget.value);
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
          <span className="rounded-xl bg-amber-100 px-1.5 py-1 text-center text-[0.58rem] font-black leading-tight text-amber-950">
            {activePoints.length} punten
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1">
          <button
            className="min-h-7 rounded-xl border-2 border-slate-300 bg-white px-0.5 text-[0.52rem] font-black text-slate-950 active:translate-y-0.5"
            onClick={handleUndoPoint}
            type="button"
          >
            Undo
          </button>
          <button
            className="min-h-7 rounded-xl border-2 border-rose-300 bg-rose-50 px-0.5 text-[0.52rem] font-black text-rose-950 active:translate-y-0.5"
            onClick={handleClearPoints}
            type="button"
          >
            Wis
          </button>
          <button
            className="min-h-7 rounded-xl border-2 border-emerald-500 bg-emerald-100 px-0.5 text-[0.52rem] font-black text-emerald-950 active:translate-y-0.5"
            onClick={handleSavePath}
            type="button"
          >
            Save
          </button>
          <button
            className="min-h-7 rounded-xl border-2 border-sky-400 bg-sky-50 px-0.5 text-[0.52rem] font-black text-sky-950 active:translate-y-0.5"
            onClick={handleCopyPath}
            type="button"
          >
            Copy
          </button>
          <button
            className="min-h-7 rounded-xl border-2 border-slate-300 bg-slate-50 px-0.5 text-[0.52rem] font-black text-slate-800 active:translate-y-0.5"
            onClick={handleResetSavedPath}
            type="button"
          >
            Reset
          </button>
        </div>

        <code
          className={classNames(
            "block max-h-9 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-950/95 p-1.5 text-[0.54rem] font-bold leading-tight text-amber-100",
            !generatedPath && "text-slate-400",
          )}
          data-testid="scene-zone-devtools-path"
        >
          {generatedPath ? `visualHintPath: "${generatedPath}",` : "Nog geen path. Plaats punten op de scene."}
        </code>

        <p
          aria-live="polite"
          className="min-h-3 truncate text-[0.54rem] font-black leading-tight text-slate-700"
        >
          {copyStatus || "Tik voor punt. Sleep punt of paneel."}
        </p>
      </section>
    </div>
  );
};

SceneZoneDevTools.displayName = "SceneZoneDevTools";
