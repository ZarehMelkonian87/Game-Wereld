import { parseSimplePolygonPath } from "../../../logic/scene-zones";
import type { SceneZone } from "../../../types";

export interface ZonePoint {
  x: number;
  y: number;
}

export interface PanelPosition {
  x: number;
  y: number;
}

export interface PanelDragState {
  offsetX: number;
  offsetY: number;
}

export interface PointDragState {
  index: number;
  zoneId: string;
}

export const zoneColors = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

export const formatPointValue = (value: number) => Number(value.toFixed(1));

export const formatPoint = (point: ZonePoint) =>
  `${formatPointValue(point.x)} ${formatPointValue(point.y)}`;

export const buildPathFromPoints = (points: ZonePoint[]) => {
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

export const getPointFromBounds = (
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

export const getZoneColor = (zoneIndex: number) => zoneColors[zoneIndex % zoneColors.length];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const getEditablePointsFromZone = (zone?: SceneZone): ZonePoint[] =>
  parseSimplePolygonPath(zone?.visualHintPath).map((point) => ({
    x: formatPointValue(point.x),
    y: formatPointValue(point.y),
  }));
