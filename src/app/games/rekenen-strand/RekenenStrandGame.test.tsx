import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createFakeGameRuntime, createGameId } from "../../game-platform";
import { Game } from "./index";

describe("Schelpen Tellen", () => {
  it("schrijft een neutrale oefenobservatie en biedt tekst naast de visuele hoeveelheid", async () => {
    const runtime = createFakeGameRuntime();
    runtime.identity.gameId = createGameId("rekenen-strand-avontuur");
    render(<Game runtime={runtime} />);

    await userEvent.click(screen.getByRole("button", { name: "Start met tellen" }));

    expect(screen.getByRole("img", { name: "Er liggen 1 schelpen." })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "1 schelpen" }));

    expect(await screen.findByText("Goed geteld!")).toBeVisible();
    expect(runtime.captured.observations).toEqual([
      {
        assistance: [],
        attemptNumber: 1,
        outcome: "correct",
        responseTimeMs: 0,
        skillIds: ["number-quantity-1-5"],
        taskId: "tel-1",
      },
    ]);
  });

  it("rondt vijf opdrachten af via hetzelfde lifecyclecontract", async () => {
    const runtime = createFakeGameRuntime();
    runtime.identity.gameId = createGameId("rekenen-strand-avontuur");
    render(<Game runtime={runtime} />);
    await userEvent.click(screen.getByRole("button", { name: "Start met tellen" }));

    for (const answer of [1, 3, 2, 5, 4]) {
      await userEvent.click(screen.getByRole("button", { name: `${answer} schelpen` }));
      await userEvent.click(screen.getByRole("button", { name: "Volgende opdracht" }));
    }

    expect(screen.getByText("Je telde 5 van de 5 hoeveelheden goed.")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Terug naar de spellen" }));
    expect(runtime.captured.completions).toEqual([{ correctActions: 5, score: 500, stars: 5 }]);
    expect(runtime.captured.observations).toHaveLength(5);
  });
});
