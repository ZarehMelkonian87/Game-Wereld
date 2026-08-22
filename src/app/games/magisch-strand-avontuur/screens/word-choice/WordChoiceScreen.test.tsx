import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createFakeGameRuntime } from "../../../../game-platform";
import { GameRuntimeProvider } from "../../runtime/GameRuntimeContext";
import { beachWorld } from "../../content";
import { WordChoiceScreen } from "../WordChoiceScreen";
import type { VocabularyChoiceInstruction } from "../../types";

const mockInstructions: VocabularyChoiceInstruction[] = [
  {
    answerOptions: ["dolfijn", "boot"],
    audioText: "Waar is de dolfijn?",
    choiceCount: 2,
    feedbackCopy: {
      almost: "Kijk goed naar het water.",
      correct: "Super! Dat is de dolfijn.",
      repeatAfterSuccess: "De dolfijn zwemt in de zee.",
    },
    hint: "Zoek het dier dat zwemt.",
    id: "cw-test-1",
    languageDomains: ["receptive-vocabulary"],
    prompt: "Waar is de dolfijn?",
    reward: { speed: 1, wordStars: 2 },
    spatialConcepts: ["in"],
    targetObjectIds: ["dolfijn"],
    targetWord: "dolfijn",
  },
  {
    answerOptions: ["boot", "krab"],
    audioText: "Waar is de boot?",
    choiceCount: 2,
    feedbackCopy: {
      almost: "Kijk goed op het water.",
      correct: "Geweldig! Dat is de boot.",
      repeatAfterSuccess: "De boot vaart op zee.",
    },
    hint: "Zoek het voertuig met een zeil.",
    id: "cw-test-2",
    languageDomains: ["receptive-vocabulary"],
    prompt: "Waar is de boot?",
    reward: { speed: 1, wordStars: 2 },
    spatialConcepts: ["op"],
    targetObjectIds: ["boot"],
    targetWord: "boot",
  },
];

describe("WordChoiceScreen afronding en resultaten", () => {
  it("toont het resultatenoverzicht zodra alle opdrachten zijn voltooid en blijft in de game", async () => {
    const user = userEvent.setup();
    const runtime = createFakeGameRuntime({
      gameId: "magisch-strand-avontuur",
    });

    render(
      <GameRuntimeProvider runtime={runtime}>
        <WordChoiceScreen instructions={mockInstructions} objects={beachWorld.objects} />
      </GameRuntimeProvider>,
    );

    // Vraag 1 voortgang
    expect(screen.getByText("1/2")).toBeInTheDocument();

    // Opdracht 1: Kies het juiste antwoord (dolfijn)
    const dolfijnButton = screen.getByRole("button", { name: /dolfijn/i });
    await user.click(dolfijnButton);

    // Klik volgende
    const nextButton1 = screen.getByTestId("word-choice-next-button");
    await user.click(nextButton1);

    // Vraag 2 voortgang
    expect(screen.getByText("2/2")).toBeInTheDocument();

    // Opdracht 2: Kies het juiste antwoord (boot)
    const bootButton = screen.getByRole("button", { name: /boot/i });
    await user.click(bootButton);

    // Klik volgende / afronden
    const nextButton2 = screen.getByTestId("word-choice-next-button");
    await user.click(nextButton2);

    // Resultatenoverzicht moet nu in beeld staan
    expect(screen.getByTestId("word-choice-round-summary")).toBeInTheDocument();
    expect(screen.getByText(/Goed gedaan!/i)).toBeInTheDocument();
    expect(screen.getByText(/Je hebt alle opdrachten voltooid!/i)).toBeInTheDocument();
  });

  it("herstart de ronde bij klikken op 'Opnieuw'", async () => {
    const user = userEvent.setup();
    const runtime = createFakeGameRuntime({
      gameId: "magisch-strand-avontuur",
    });

    render(
      <GameRuntimeProvider runtime={runtime}>
        <WordChoiceScreen instructions={mockInstructions} objects={beachWorld.objects} />
      </GameRuntimeProvider>,
    );

    // Voltooi beide opdrachten
    await user.click(screen.getByRole("button", { name: /dolfijn/i }));
    await user.click(screen.getByTestId("word-choice-next-button"));

    await user.click(screen.getByRole("button", { name: /boot/i }));
    await user.click(screen.getByTestId("word-choice-next-button"));

    expect(screen.getByTestId("word-choice-round-summary")).toBeInTheDocument();

    // Klik opnieuw
    await user.click(screen.getByTestId("word-choice-summary-replay-button"));

    // Resultatenoverzicht is weg en eerste vraag is weer terug
    expect(screen.queryByTestId("word-choice-round-summary")).not.toBeInTheDocument();
    expect(screen.getByText(/Waar is de dolfijn\?/i)).toBeInTheDocument();
  });
});
