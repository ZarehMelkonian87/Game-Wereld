import type { SceneZone, SpatialConcept } from "../types";

export interface ScenePoint {
  x: number;
  y: number;
}

export const supportedSceneBuilderConcepts: SpatialConcept[] = [
  "in",
  "op",
  "onder",
  "boven",
  "naast",
  "tussen",
  "links",
  "rechts",
  "midden",
  "dichtbij",
  "ver weg",
];

export function getZoneCenter(zone?: SceneZone): ScenePoint {
  if (!zone) {
    return { x: 50, y: 50 };
  }

  return {
    x: zone.x + zone.width / 2,
    y: zone.y + zone.height / 2,
  };
}

export const parseSimplePolygonPath = (path?: string): ScenePoint[] => {
  if (!path || /[CQSAHVT]/i.test(path)) {
    return [];
  }

  return [...path.matchAll(/[ML]\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/gi)]
    .map((match) => ({
      x: Number(match[1]),
      y: Number(match[2]),
    }))
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
};

const getPolygonArea = (points: ScenePoint[]) => {
  if (points.length < 3) {
    return 0;
  }

  const area = points.reduce((totalArea, point, index) => {
    const nextPoint = points[(index + 1) % points.length];

    return totalArea + point.x * nextPoint.y - nextPoint.x * point.y;
  }, 0);

  return Math.abs(area) / 2;
};

const pointIsInsidePolygon = (point: ScenePoint, polygon: ScenePoint[]) => {
  if (polygon.length < 3) {
    return false;
  }

  return polygon.reduce((insidePolygon, polygonPoint, index) => {
    const previousPoint = polygon[(index + polygon.length - 1) % polygon.length];
    const intersects =
      polygonPoint.y > point.y !== previousPoint.y > point.y &&
      point.x <
        ((previousPoint.x - polygonPoint.x) * (point.y - polygonPoint.y)) /
          (previousPoint.y - polygonPoint.y) +
          polygonPoint.x;

    return intersects ? !insidePolygon : insidePolygon;
  }, false);
};

export function getZoneArea(zone: SceneZone) {
  const polygonArea = getPolygonArea(parseSimplePolygonPath(zone.visualHintPath));

  if (polygonArea > 0) {
    return polygonArea;
  }

  return zone.width * zone.height;
}

export function pointIsInsideZone(point: ScenePoint, zone: SceneZone) {
  const polygonPoints = parseSimplePolygonPath(zone.visualHintPath);

  if (polygonPoints.length >= 3) {
    return pointIsInsidePolygon(point, polygonPoints);
  }

  return (
    point.x >= zone.x &&
    point.x <= zone.x + zone.width &&
    point.y >= zone.y &&
    point.y <= zone.y + zone.height
  );
}

export function findSmallestZoneAtPoint(zones: SceneZone[], point: ScenePoint) {
  return zones
    .filter((zone) => pointIsInsideZone(point, zone))
    .sort((firstZone, secondZone) => getZoneArea(firstZone) - getZoneArea(secondZone))[0];
}

export function zoneSupportsConcept(zone: SceneZone | undefined, concept: SpatialConcept) {
  return Boolean(zone?.supportedConcepts.includes(concept));
}

export function selectedZoneMatchesTarget(
  selectedZone: SceneZone | undefined,
  targetZone: SceneZone | undefined,
) {
  if (!selectedZone || !targetZone) {
    return false;
  }

  if (selectedZone.id === targetZone.id) {
    return true;
  }

  return pointIsInsideZone(getZoneCenter(selectedZone), targetZone);
}
