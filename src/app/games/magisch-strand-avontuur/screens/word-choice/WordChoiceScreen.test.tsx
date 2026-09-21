import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createFakeGameRuntime, success } from "../../../../game-platform";
import { GameRuntimeProvider } from "../../runtime/GameRuntimeContext";
import { beachWorld } from "../../content";
import { defaultBezemEscapeSettings, saveBezemEscapeSettings } from "../../logic/settings";
import { WordChoiceScreen } from "../WordChoiceScreen";
import type { VocabularyChoiceInstruction } from "../../types";

// Korte wachttijd zodat de tests niet 1,8 s per vraag hoeven te wachten.
const TEST_AUTO_ADVANCE_MS = 30;

const renderScreen = (runtime = createFakeGameRuntime()) => {
  render(
    <GameRuntimeProvider runtime={runtime}>
      <WordChoiceScreen
        autoAdvanceDelayMs={TEST_AUTO_ADVANCE_MS}
        autoAdvanceWithRewardDelayMs={TEST_AUTO_ADVANCE_MS}
        instructions={mockInstructions}
        objects={beachWorld.objects}
      />
    </GameRuntimeProvider>,
  );
  return runtime;
};

const mockInstructions: VocabularyChoiceInstruction[] = [
  {
    answerOptions: ["dolfijn", "boot"],
    audioText: "Waar is de dolfijn?",
    choiceCount: 2,
    distractorStrategy: "same-theme",
    feedback: "Super! Dat is de dolfijn.",
    feedbackCopy: {
      almost: "Kijk goed naar het water.",
      correct: "Super! Dat is de dolfijn.",
      repeatAfterSuccess: "De dolfijn zwemt in de zee.",
    },
    hint: "Zoek het dier dat zwemt.",
    id: "cw-test-1",
    languageDomains: ["receptive-vocabulary"],
    level: 1,
    mode: "choose-word",
    prompt: "Waar is de dolfijn?",
    reward: { speed: 1, wordStars: 2 },
    spatialConcepts: ["in"],
    tags: ["test"],
    targetObjectIds: ["dolfijn"],
    targetWord: "dolfijn",
    targetZoneIds: [],
  },
  {
    answerOptions: ["boot", "krab"],
    audioText: "Waar is de boot?",
    choiceCount: 2,
    distractorStrategy: "same-theme",
    feedback: "Geweldig! Dat is de boot.",
    feedbackCopy: {
      almost: "Kijk goed op het water.",
      correct: "Geweldig! Dat is de boot.",
      repeatAfterSuccess: "De boot vaart op zee.",
    },
    hint: "Zoek het voertuig met een zeil.",
    id: "cw-test-2",
    languageDomains: ["receptive-vocabulary"],
    level: 1,
    mode: "choose-word",
    prompt: "Waar is de boot?",
    reward: { speed: 1, wordStars: 2 },
    spatialConcepts: ["op"],
    tags: ["test"],
    targetObjectIds: ["boot"],
    targetWord: "boot",
    targetZoneIds: [],
  },
];

describe("WordChoiceScreen afronding en resultaten", () => {
  it("gaat na een goed antwoord vanzelf door en toont daarna het resultatenoverzicht (T-51)", async () => {
    const user = userEvent.setup();
    renderScreen();

    // Vraag 1 voortgang
    expect(screen.getByText("1/2")).toBeInTheDocument();

    // Opdracht 1: Kies het juiste antwoord (dolfijn)
    await user.click(screen.getByRole("button", { name: /dolfijn/i }));
    expect(screen.getByText("Super! Dat is de dolfijn. Bonus zonder hint!")).toBeInTheDocument();
    // Geen "Volgende"-knop meer: de quiz schakelt zelf door.
    expect(screen.queryByTestId("word-choice-next-button")).not.toBeInTheDocument();

    // Vraag 2 verschijnt vanzelf
    await screen.findByText("2/2");

    // Opdracht 2: Kies het juiste antwoord (boot)
    await user.click(screen.getByRole("button", { name: /boot/i }));

    // Resultatenoverzicht verschijnt vanzelf
    expect(await screen.findByTestId("word-choice-round-summary")).toBeInTheDocument();
    expect(screen.getByText(/Goed gedaan!/i)).toBeInTheDocument();
    expect(screen.getByText(/Je hebt alle opdrachten voltooid!/i)).toBeInTheDocument();
  });

  it("speelt een goed-geluid bij een goed antwoord en een fout-geluid bij een fout antwoord (T-51)", async () => {
    const user = userEvent.setup();
    const runtime = createFakeGameRuntime();
    const playAudio = vi.fn(async (_source: string) => success(undefined));
    runtime.media.playAudio = playAudio;
    renderScreen(runtime);

    await user.click(screen.getByRole("button", { name: /boot/i }));
    expect(playAudio).toHaveBeenCalledTimes(1);
    expect(playAudio.mock.calls[0]?.[0]).toMatch(/feedback-wrong\.wav$/);

    await user.click(screen.getByRole("button", { name: /dolfijn/i }));
    expect(playAudio).toHaveBeenCalledTimes(2);
    expect(playAudio.mock.calls[1]?.[0]).toMatch(/feedback-correct\.wav$/);
  });

  it("speelt geen feedbackgeluid als audio uitstaat bij instellingen (T-51)", async () => {
    const user = userEvent.setup();
    const runtime = createFakeGameRuntime();
    const playAudio = vi.fn(async (_source: string) => success(undefined));
    runtime.media.playAudio = playAudio;
    saveBezemEscapeSettings(
      runtime.identity.profileId,
      { ...defaultBezemEscapeSettings, audioEnabled: false },
      runtime.storage,
    );
    renderScreen(runtime);

    await user.click(screen.getByRole("button", { name: /boot/i }));
    await user.click(screen.getByRole("button", { name: /dolfijn/i }));
    expect(playAudio).not.toHaveBeenCalled();
    // Doorschakelen werkt ook zonder geluid
    await screen.findByText("2/2");
  });

  it("negeert extra tikken terwijl de quiz doorschakelt, zodat sterren niet dubbel tellen (T-51)", async () => {
    const user = userEvent.setup();
    const runtime = createFakeGameRuntime();
    const playAudio = vi.fn(async (_source: string) => success(undefined));
    runtime.media.playAudio = playAudio;
    renderScreen(runtime);

    const dolfijnButton = screen.getByRole("button", { name: /dolfijn/i });
    await user.click(dolfijnButton);
    await user.click(dolfijnButton);
    await user.click(screen.getByRole("button", { name: /boot/i }));

    expect(playAudio).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Kijk goed naar het water.")).not.toBeInTheDocument();
    await screen.findByText("2/2");
    // Alleen de sterren van vraag 1 (2 + 1 bonus) staan op de teller.
    expect(screen.getByTestId("word-choice-screen").dataset.wordStarValue).toBe("3");
  });

  it("herstart de ronde bij klikken op 'Opnieuw'", async () => {
    const user = userEvent.setup();
    renderScreen();

    // Voltooi beide opdrachten (de quiz schakelt zelf door)
    await user.click(screen.getByRole("button", { name: /dolfijn/i }));
    await screen.findByText("2/2");
    await user.click(screen.getByRole("button", { name: /boot/i }));

    await waitFor(() =>
      expect(screen.getByTestId("word-choice-round-summary")).toBeInTheDocument(),
    );

    // Klik opnieuw
    await user.click(screen.getByTestId("word-choice-summary-replay-button"));

    // Resultatenoverzicht is weg en eerste vraag is weer terug
    expect(screen.queryByTestId("word-choice-round-summary")).not.toBeInTheDocument();
    expect(screen.getByText(/Waar is de dolfijn\?/i)).toBeInTheDocument();
  });
});
