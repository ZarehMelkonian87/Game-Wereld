// @vitest-environment node

import { describe, expect, it } from "vitest";
import { beachWorld, sceneBuilderInstructions } from "../content";
import type { SceneObject, SceneZone } from "../types";
import { normalizeSpokenCommand, parseSpokenPlacementCommand } from "./spoken-command-parser";

const objects: SceneObject[] = [
  {
    article: "de",
    assetId: "boat",
    assetPath: "boat.png",
    category: "voertuigen",
    description: "Een boot",
    emoji: "⛵",
    id: "boat",
    label: "boot",
    tags: ["schip"],
    vocabularyLevel: 1,
  },
];

const zones: SceneZone[] = [
  {
    description: "De zee",
    height: 50,
    id: "sea",
    kind: "absolute",
    label: "zee",
    supportedConcepts: ["in"],
    width: 100,
    x: 0,
    y: 0,
  },
];

describe("spoken command parser", () => {
  it("normalizes casing, punctuation and diacritics", () => {
    expect(normalizeSpokenCommand("  ZÉT de BOOT, in de ZEE!  ")).toBe("zet de boot in de zee");
  });

  it("extracts a complete high-confidence placement command", () => {
    const result = parseSpokenPlacementCommand({
      objects,
      transcript: "Zet de boot in de zee",
      zones,
    });

    expect(result).toMatchObject({
      confidence: "high",
      missing: [],
      objectId: "boat",
      relation: "in",
      zoneId: "sea",
    });
  });

  it("reports the missing placement details instead of guessing", () => {
    const result = parseSpokenPlacementCommand({
      objects,
      transcript: "de boot",
      zones,
    });

    expect(result.confidence).toBe("needs-help");
    expect(result.missing).toEqual(["spatial-concept", "zone"]);
  });

  it("houdt iedere zelfstandige opdrachtzin gelijk aan het bedoelde object en de bedoelde plek", () => {
    const independentInstructions = sceneBuilderInstructions.filter(
      (instruction) => !instruction.placement.anchorObjectIds?.length,
    );

    independentInstructions.forEach((instruction) => {
      const result = parseSpokenPlacementCommand({
        objects: beachWorld.objects,
        transcript: instruction.prompt,
        zones: beachWorld.zones,
      });

      expect(result, instruction.id).toMatchObject({
        confidence: "high",
        objectId: instruction.placement.objectId,
        relation: instruction.placement.relation,
        zoneId: instruction.placement.zoneId,
      });
    });
  });
});
