import { beforeEach, describe, expect, it } from "vitest";
import type { RefObject } from "react";
import type { SceneZone } from "../../../types";
import { getScenePointFromViewportPoint, getZoneFromViewportPoint } from "./scene-geometry-utils";

let sceneRef: RefObject<HTMLElement>;

const zones: SceneZone[] = [
  {
    description: "Grote zone",
    height: 100,
    id: "large",
    kind: "absolute",
    label: "Groot",
    supportedConcepts: ["in"],
    width: 100,
    x: 0,
    y: 0,
  },
  {
    description: "Kleine zone",
    height: 20,
    id: "small",
    kind: "absolute",
    label: "Klein",
    supportedConcepts: ["in"],
    width: 20,
    x: 40,
    y: 40,
  },
];

describe("scene geometry", () => {
  beforeEach(() => {
    const element = document.createElement("section");
    element.getBoundingClientRect = () => new DOMRect(100, 50, 200, 100);
    sceneRef = { current: element };
  });

  it("maps viewport coordinates to bounded scene percentages", () => {
    expect(getScenePointFromViewportPoint(sceneRef, 200, 100)).toEqual({ x: 50, y: 50 });
    expect(getScenePointFromViewportPoint(sceneRef, 90, 40)).toEqual({ x: 4, y: 6 });
    expect(getScenePointFromViewportPoint(sceneRef, 20, 20)).toBeUndefined();
  });

  it("chooses the smallest matching zone", () => {
    expect(getZoneFromViewportPoint(sceneRef, zones, 200, 100)?.id).toBe("small");
  });
});
