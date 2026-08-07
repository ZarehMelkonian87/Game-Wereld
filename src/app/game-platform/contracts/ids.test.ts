import { describe, expect, expectTypeOf, it } from "vitest";
import {
  createGameId,
  createThemeId,
  parseGameId,
  parseProfileId,
  type GameId,
  type ThemeId,
} from "./ids";

describe("branded ids", () => {
  it("rejects empty and non-string values at the boundary", () => {
    expect(parseGameId("  ")).toMatchObject({
      error: { code: "invalid-id", idType: "game" },
      ok: false,
    });
    expect(parseProfileId(null)).toMatchObject({
      error: { code: "invalid-id", idType: "profile" },
      ok: false,
    });
  });

  it("trims valid ids and keeps id categories type-distinct", () => {
    const gameId = createGameId(" magisch-strand-avontuur ");
    const themeId = createThemeId("vocabulary");

    expect(gameId).toBe("magisch-strand-avontuur");
    expectTypeOf(gameId).toEqualTypeOf<GameId>();
    expectTypeOf(themeId).toEqualTypeOf<ThemeId>();
    expectTypeOf(gameId).not.toEqualTypeOf(themeId);
  });

  it("throws through strict constructors for invalid ids", () => {
    expect(() => createGameId("")).toThrow("gameId moet een niet-lege string zijn");
  });
});
