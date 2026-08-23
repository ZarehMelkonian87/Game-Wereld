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
    answerOptions: ["leeuw", "olifant"],
    audioText: "Waar is de leeuw?",
    choiceCount: 2,
    distractorStrategy: "same-theme",
    feedback: "Super! Dat is de leeuw.",
    feedbackCopy: {
      almost: "Zoek het dier dat brult.",
      correct: "Super! Dat is de leeuw.",
      repeatAfterSuccess: "De leeuw staat in de piste.",
    },
    hint: "Zoek het dier dat brult.",
    id: "cw-test-1",
    languageDomains: ["receptive-vocabulary"],
    level: 1,
    mode: "choose-word",
    prompt: "Waar is de leeuw?",
    reward: { speed: 1, wordStars: 2 },
    spatialConcepts: ["in"],
    tags: ["test"],
    targetObjectIds: ["leeuw"],
    targetWord: "leeuw",
    targetZoneIds: [],
  },
  {
    answerOptions: ["eenwieler", "bal"],
    audioText: "Waar is de eenwieler?",
    choiceCount: 2,
    distractorStrategy: "same-theme",
    feedback: "Geweldig! Dat is de eenwieler.",
    feedbackCopy: {
      almost: "Zoek het voertuig met één wiel.",
      correct: "Geweldig! Dat is de eenwieler.",
      repeatAfterSuccess: "De eenwieler staat in de piste.",
    },
    hint: "Zoek het voertuig met één wiel.",
    id: "cw-test-2",
    languageDomains: ["receptive-vocabulary"],
    level: 1,
    mode: "choose-word",
    prompt: "Waar is de eenwieler?",
    reward: { speed: 1, wordStars: 2 },
    spatialConcepts: ["op"],
    tags: ["test"],
    targetObjectIds: ["eenwieler"],
    targetWord: "eenwieler",
    targetZoneIds: [],
  },
];

describe("WordChoiceScreen afronding en resultaten", () => {
  it("toont het resultatenoverzicht zodra alle opdrachten zijn voltooid en blijft in de game", async () => {
    const user = userEvent.setup();
    const runtime = createFakeGameRuntime();

    render(
      <GameRuntimeProvider runtime={runtime}>
        <WordChoiceScreen instructions={mockInstructions} objects={beachWorld.objects} />
      </GameRuntimeProvider>,
    );

    // Vraag 1 voortgang
    expect(screen.getByText("1/2")).toBeInTheDocument();

    // Opdracht 1: Kies het juiste antwoord (leeuw)
    const leeuwButton = screen.getByRole("button", { name: /leeuw/i });
    await user.click(leeuwButton);

    // Klik volgende
    const nextButton1 = screen.getByTestId("word-choice-next-button");
    await user.click(nextButton1);

    // Vraag 2 voortgang
    expect(screen.getByText("2/2")).toBeInTheDocument();

    // Opdracht 2: Kies het juiste antwoord (eenwieler)
    const eenwielerButton = screen.getByRole("button", { name: /eenwieler/i });
    await user.click(eenwielerButton);

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
    const runtime = createFakeGameRuntime();

    render(
      <GameRuntimeProvider runtime={runtime}>
        <WordChoiceScreen instructions={mockInstructions} objects={beachWorld.objects} />
      </GameRuntimeProvider>,
    );

    // Voltooi beide opdrachten
    await user.click(screen.getByRole("button", { name: /leeuw/i }));
    await user.click(screen.getByTestId("word-choice-next-button"));

    await user.click(screen.getByRole("button", { name: /eenwieler/i }));
    await user.click(screen.getByTestId("word-choice-next-button"));

    expect(screen.getByTestId("word-choice-round-summary")).toBeInTheDocument();

    // Klik opnieuw
    await user.click(screen.getByTestId("word-choice-summary-replay-button"));

    // Resultatenoverzicht is weg en eerste vraag is weer terug
    expect(screen.queryByTestId("word-choice-round-summary")).not.toBeInTheDocument();
    expect(screen.getByText(/Waar is de leeuw\?/i)).toBeInTheDocument();
  });
});
