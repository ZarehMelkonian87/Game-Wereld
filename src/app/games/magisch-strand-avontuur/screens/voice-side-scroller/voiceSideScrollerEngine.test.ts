import { describe, expect, it } from "vitest";
import {
  collectVoiceSideScrollerTarget,
  startVoiceSideScrollerRound,
  tickVoiceSideScrollerState,
} from "./voiceSideScrollerEngine";
import {
  VOICE_SCROLLER_MAX_SHIELDS,
  type VoiceSideScrollerGameState,
  type VoiceSideScrollerObstacle,
} from "./voiceSideScrollerModel";

const PLAYER_X = 0.12;

const overlappingObstacle = (playerY: number): VoiceSideScrollerObstacle => ({
  collisionBox: { height: 0.07, offsetX: 0, offsetY: 0, width: 0.14 },
  height: 0.19,
  hit: false,
  id: "obstacle-test",
  kind: "cloud",
  label: "wolk",
  width: 0.28,
  x: PLAYER_X,
  y: playerY,
});

const runningStateWithCollision = (
  overrides: Partial<VoiceSideScrollerGameState> = {},
): VoiceSideScrollerGameState => {
  const base = startVoiceSideScrollerRound();

  return {
    ...base,
    obstacles: [overlappingObstacle(base.playerY)],
    targets: [],
    ...overrides,
  };
};

describe("voiceSideScrollerEngine · schildjes (T-30)", () => {
  it("een botsing kost een schildje en beëindigt de ronde niet", () => {
    const next = tickVoiceSideScrollerState({
      deltaMs: 16,
      state: runningStateWithCollision(),
      verticalInput: 0,
    });

    expect(next.shields).toBe(VOICE_SCROLLER_MAX_SHIELDS - 1);
    expect(next.status).toBe("running");
    expect(next.obstacleHits).toBe(1);
  });

  it("de ronde eindigt vriendelijk pas als het laatste schildje op is", () => {
    const next = tickVoiceSideScrollerState({
      deltaMs: 16,
      state: runningStateWithCollision({ shields: 1 }),
      verticalInput: 0,
    });

    expect(next.shields).toBe(0);
    expect(next.status).toBe("game-over");
    expect(next.gameplayFeedback?.message).toContain("Goed gevlogen");
  });

  it("een botsing breekt de combo", () => {
    const next = tickVoiceSideScrollerState({
      deltaMs: 16,
      state: runningStateWithCollision({ combo: 4, shields: 3 }),
      verticalInput: 0,
    });

    expect(next.combo).toBe(0);
  });
});

describe("voiceSideScrollerEngine · combo (T-30)", () => {
  it("een gevangen woord verhoogt de combo en de sterren", () => {
    const base = startVoiceSideScrollerRound();
    const targetId = base.targets[0]?.id ?? "";

    const next = collectVoiceSideScrollerTarget(base, targetId);

    expect(next.combo).toBe(1);
    expect(next.bestCombo).toBe(1);
    expect(next.stars).toBe(1);
  });

  it("elke derde combo geeft een bonusster en een combo-viering", () => {
    const base = startVoiceSideScrollerRound();
    const targetId = base.targets[0]?.id ?? "";

    const withCombo = collectVoiceSideScrollerTarget(
      { ...base, combo: 2, stars: 2 },
      targetId,
    );

    expect(withCombo.combo).toBe(3);
    expect(withCombo.stars).toBe(4); // +1 gewoon +1 bonus
    expect(withCombo.gameplayFeedback?.message).toContain("Combo x3");
  });
});
