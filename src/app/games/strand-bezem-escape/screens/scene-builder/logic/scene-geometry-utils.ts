import type { RefObject } from "react";
import { findSmallestZoneAtPoint } from "../../../logic/scene-zones";
import type { SceneZone } from "../../../types";
export const getScenePointFromViewportPoint = (
  sceneAreaRef: RefObject<HTMLElement | null>,
  clientX: number,
  clientY: number,
) => {
  const sceneBounds = sceneAreaRef.current?.getBoundingClientRect();
  if (!sceneBounds) {
    return undefined;
  }
  const tolerance = 30;
  const isWithinTolerance =
    clientX >= sceneBounds.left - tolerance &&
    clientX <= sceneBounds.right + tolerance &&
    clientY >= sceneBounds.top - tolerance &&
    clientY <= sceneBounds.bottom + tolerance;
  if (!isWithinTolerance) {
    return undefined;
  }
  const clampedClientX = Math.min(sceneBounds.right, Math.max(sceneBounds.left, clientX));
  const clampedClientY = Math.min(sceneBounds.bottom, Math.max(sceneBounds.top, clientY));
  return {
    x: Math.min(96, Math.max(4, ((clampedClientX - sceneBounds.left) / sceneBounds.width) * 100)),
    y: Math.min(94, Math.max(6, ((clampedClientY - sceneBounds.top) / sceneBounds.height) * 100)),
  };
};
export const getZoneFromViewportPoint = (
  sceneAreaRef: RefObject<HTMLElement | null>,
  effectiveZones: SceneZone[],
  clientX: number,
  clientY: number,
) => {
  const scenePoint = getScenePointFromViewportPoint(sceneAreaRef, clientX, clientY);
  if (!scenePoint) {
    return undefined;
  }
  return findSmallestZoneAtPoint(effectiveZones, scenePoint);
};
