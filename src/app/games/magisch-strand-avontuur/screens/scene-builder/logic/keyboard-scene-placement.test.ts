import { describe, expect, it } from "vitest";
import { isSceneDirectionKey, moveKeyboardScenePoint } from "./keyboard-scene-placement";

describe("toetsenbordplaatsing in de scene", () => {
  it("verplaatst het focuspunt in voorspelbare stappen", () => {
    expect(moveKeyboardScenePoint({ x: 50, y: 50 }, "ArrowLeft")).toEqual({ x: 45, y: 50 });
    expect(moveKeyboardScenePoint({ x: 50, y: 50 }, "ArrowDown")).toEqual({ x: 50, y: 55 });
  });

  it("houdt het focuspunt binnen het bruikbare scenegebied", () => {
    expect(moveKeyboardScenePoint({ x: 4, y: 6 }, "ArrowLeft")).toEqual({ x: 4, y: 6 });
    expect(moveKeyboardScenePoint({ x: 96, y: 94 }, "ArrowDown")).toEqual({ x: 96, y: 94 });
  });

  it("accepteert uitsluitend pijltoetsen als richting", () => {
    expect(isSceneDirectionKey("ArrowUp")).toBe(true);
    expect(isSceneDirectionKey("Enter")).toBe(false);
  });
});
