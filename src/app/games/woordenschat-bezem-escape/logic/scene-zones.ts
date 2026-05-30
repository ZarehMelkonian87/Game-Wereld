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

export function getZoneArea(zone: SceneZone) {
  return zone.width * zone.height;
}

export function pointIsInsideZone(point: ScenePoint, zone: SceneZone) {
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
