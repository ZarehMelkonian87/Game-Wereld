import { describe, expect, it } from "vitest";
import {
  evaluateDynamicRelationPlacement,
  getDynamicRelationHintZone,
  getSuggestedDynamicRelationPoint,
  type SceneObjectPlacementPoint,
} from "./dynamic-scene-relations";

/**
 * Borgt de robuustheid van dynamische zones (T-15 / GAP-08): een opdracht met
 * een relatie t.o.v. een anker dat nog niet geplaatst is, mag nooit crashen of
 * per ongeluk als "goed" tellen. In plaats daarvan geeft alles netjes een
 * "nog niet mogelijk"-antwoord terug (undefined / matches:false + het
 * ontbrekende anker).
 */
describe("dynamische zones zonder geplaatst anker (T-15)", () => {
  const emptyPlacements: SceneObjectPlacementPoint[] = [];

  it("suggereert geen punt zolang het anker ontbreekt", () => {
    expect(
      getSuggestedDynamicRelationPoint({
        anchorObjectIds: ["parasol"],
        placements: emptyPlacements,
        relation: "naast",
      }),
    ).toBeUndefined();
  });

  it("keurt een plaatsing af én meldt het ontbrekende anker", () => {
    const evaluation = evaluateDynamicRelationPlacement({
      anchorObjectIds: ["parasol"],
      placementPoint: { x: 50, y: 50 },
      placements: emptyPlacements,
      relation: "naast",
    });

    expect(evaluation.matches).toBe(false);
    expect(evaluation.missingAnchorObjectIds).toEqual(["parasol"]);
  });

  it("toont geen hint-zone zolang het anker ontbreekt", () => {
    expect(
      getDynamicRelationHintZone({
        anchorObjectIds: ["parasol"],
        placements: emptyPlacements,
        relation: "naast",
        zoneId: "naast-parasol",
      }),
    ).toBeUndefined();
  });

  it("meldt bij 'tussen' beide ontbrekende ankers", () => {
    const evaluation = evaluateDynamicRelationPlacement({
      anchorObjectIds: ["parasol", "boot"],
      placementPoint: { x: 50, y: 50 },
      placements: emptyPlacements,
      relation: "tussen",
    });

    expect(evaluation.matches).toBe(false);
    expect(evaluation.missingAnchorObjectIds).toEqual(["parasol", "boot"]);
  });

  it("werkt zodra het anker wél geplaatst is", () => {
    const placements: SceneObjectPlacementPoint[] = [{ objectId: "parasol", x: 40, y: 50 }];

    const point = getSuggestedDynamicRelationPoint({
      anchorObjectIds: ["parasol"],
      placements,
      relation: "naast",
    });
    expect(point).toBeDefined();

    const evaluation = evaluateDynamicRelationPlacement({
      anchorObjectIds: ["parasol"],
      placementPoint: point ?? { x: 0, y: 0 },
      placements,
      relation: "naast",
    });
    expect(evaluation.missingAnchorObjectIds).toEqual([]);
    expect(evaluation.matches).toBe(true);
  });
});
