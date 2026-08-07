import type { ScenePoint } from "../../../logic/scene-zones";

const HORIZONTAL_STEP = 5;
const VERTICAL_STEP = 5;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export type SceneDirectionKey = "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp";

export const moveKeyboardScenePoint = (
  point: ScenePoint,
  direction: SceneDirectionKey,
): ScenePoint => {
  const horizontalDelta =
    direction === "ArrowLeft" ? -HORIZONTAL_STEP : direction === "ArrowRight" ? HORIZONTAL_STEP : 0;
  const verticalDelta =
    direction === "ArrowUp" ? -VERTICAL_STEP : direction === "ArrowDown" ? VERTICAL_STEP : 0;

  return {
    x: clamp(point.x + horizontalDelta, 4, 96),
    y: clamp(point.y + verticalDelta, 6, 94),
  };
};

export const isSceneDirectionKey = (key: string): key is SceneDirectionKey =>
  key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp";
