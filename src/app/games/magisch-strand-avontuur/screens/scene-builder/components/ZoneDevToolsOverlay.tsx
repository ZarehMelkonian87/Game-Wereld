import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
import { classNames } from "../../../components/ui/classNames";
import type { SceneZone } from "../../../types";
import { getZoneColor, type ZonePoint } from "../logic/zone-devtools-utils";

interface ZoneDevToolsOverlayProps {
  activePoints: ZonePoint[];
  activeZone?: SceneZone;
  generatedPath: string;
  handleAddPoint: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  handlePointDragStart: (event: ReactPointerEvent<HTMLButtonElement>, index: number) => void;
  rootRef: RefObject<HTMLDivElement>;
  selectedPointIndex: number | null;
  setSelectedPointIndex: (index: number | null) => void;
  zones: SceneZone[];
}

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

export const ZoneDevToolsOverlay = ({
  activePoints,
  activeZone,
  generatedPath,
  handleAddPoint,
  handlePointDragStart,
  selectedPointIndex,
  setSelectedPointIndex,
  zones,
}: ZoneDevToolsOverlayProps) => {
  return (
    <>
      <button
        aria-label="Zonepunt toevoegen"
        className="pointer-events-auto absolute inset-0 z-10 cursor-crosshair bg-transparent touch-none"
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
              className="pointer-events-auto absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center touch-none cursor-grab active:cursor-grabbing"
              data-testid={`scene-zone-devtools-point-${index}`}
              key={`${point.x}-${point.y}-${index}-handle`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setSelectedPointIndex(index);
              }}
              onPointerDown={(event) => handlePointDragStart(event, index)}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
              type="button"
            >
              <span
                className={classNames(
                  "grid h-6 w-6 place-items-center rounded-full border-2 text-[0.62rem] font-black leading-none shadow-md transition-transform",
                  selected
                    ? "border-slate-950 bg-amber-300 text-slate-950 scale-110"
                    : "border-slate-950/80 bg-amber-100 text-slate-950",
                )}
                aria-hidden="true"
              >
                {index + 1}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};

ZoneDevToolsOverlay.displayName = "ZoneDevToolsOverlay";
