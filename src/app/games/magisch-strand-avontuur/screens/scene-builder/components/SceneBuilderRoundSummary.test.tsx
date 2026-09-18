import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { RewardUnlock } from "../../../logic/rewards";
import type { SceneObject } from "../../../types";
import type { SceneCompletionSummary } from "../logic/scene-builder-types";
import { SceneBuilderRoundSummary } from "./SceneBuilderRoundSummary";

const objects: SceneObject[] = [
  { id: "vliegtuig", assetId: "vliegtuig", label: "vliegtuig" } as SceneObject,
  { id: "bal", assetId: "bal", label: "bal" } as SceneObject,
];

const summary: SceneCompletionSummary = {
  placedObjects: [
    { instructionId: "lp-1", objectId: "vliegtuig", x: 0.1, y: 0.1, zoneId: "boven-zee" },
    { instructionId: "lp-2", objectId: "bal", x: 0.2, y: 0.2, zoneId: "op-strand" },
  ],
  practicedConcepts: ["boven", "op"],
  practicedWords: ["vliegtuig", "bal"],
};

const nextReward: RewardUnlock = {
  id: "sticker-dolfijn",
  label: "Dolfijn Sticker",
  type: "sticker",
  unlockAfterWordStars: 10,
};

describe("SceneBuilderRoundSummary (T-03)", () => {
  it("viert de afgeronde plaat en toont de geoefende woorden en begrippen", () => {
    render(
      <SceneBuilderRoundSummary
        nextReward={nextReward}
        objects={objects}
        onBackToMenu={vi.fn()}
        onRestart={vi.fn()}
        summary={summary}
        totalWordStars={7}
      />,
    );

    expect(screen.getByText("Strandplaat af!")).toBeInTheDocument();
    expect(screen.getByText(/2 plaatjes/)).toBeInTheDocument();
    expect(screen.getByText("vliegtuig, bal")).toBeInTheDocument();
    expect(screen.getByText("boven, op")).toBeInTheDocument();
    expect(screen.getByText("Jouw sterren: 7")).toBeInTheDocument();
  });

  it("toont hoeveel sterren tot de volgende beloning", () => {
    render(
      <SceneBuilderRoundSummary
        nextReward={nextReward}
        objects={objects}
        onBackToMenu={vi.fn()}
        onRestart={vi.fn()}
        summary={summary}
        totalWordStars={7}
      />,
    );

    // 10 - 7 = 3 sterren te gaan
    expect(screen.getByTestId("scene-builder-next-reward")).toHaveTextContent(
      "Nog 3 sterren tot: Dolfijn Sticker",
    );
  });

  it("viert wanneer alle beloningen ontgrendeld zijn", () => {
    render(
      <SceneBuilderRoundSummary
        objects={objects}
        onBackToMenu={vi.fn()}
        onRestart={vi.fn()}
        summary={summary}
        totalWordStars={99}
      />,
    );

    expect(screen.getByText(/Alle beloningen ontgrendeld/)).toBeInTheDocument();
  });
});
