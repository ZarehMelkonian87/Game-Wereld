import { expect, test, type Page } from "@playwright/test";
import { createPlayerAndOpenStrandGame, waitForWordChoiceAutoAdvance } from "./helpers";

const openWordChoice = async (page: Page) => {
  await createPlayerAndOpenStrandGame(page);
  await page.getByTestId("start-play-button").click();
  // Kies het Woord is de altijd-open instapmodus en staat standaard geselecteerd.
  await page.getByTestId("compact-mode-card-choose-word").click();
  await page.getByTestId("adventure-start-game-button").click();
  await expect(page.getByTestId("word-choice-screen")).toBeVisible();
};

const getQuestionText = async (page: Page) =>
  (await page.getByTestId("word-choice-question-panel").innerText()).toLowerCase();

const clickAnswerMatching = async (page: Page, wantMatch: boolean) => {
  const question = await getQuestionText(page);
  const answers = page.getByTestId("word-choice-answer-area").getByRole("button");
  const count = await answers.count();

  for (let index = 0; index < count; index += 1) {
    const label = (await answers.nth(index).getAttribute("aria-label"))?.toLowerCase() ?? "";
    if (label && question.includes(label) === wantMatch) {
      await answers.nth(index).click();
      return true;
    }
  }

  return false;
};

test.describe("Kies het Woord (e2e)", () => {
  test("rendert vraagpaneel, antwoordkaarten en voortgang", async ({ page }) => {
    await openWordChoice(page);

    await expect(page.getByTestId("word-choice-question-panel")).toBeVisible();
    await expect(page.getByTestId("word-choice-answer-area")).toBeVisible();
    await expect(page.getByTestId("word-choice-status-area")).toBeVisible();
  });

  test("goed antwoord geeft succesfeedback en gaat vanzelf door zonder Volgende-knop (T-51)", async ({
    page,
  }) => {
    await openWordChoice(page);
    const screen = page.getByTestId("word-choice-screen");
    const firstInstructionId = await screen.getAttribute("data-active-instruction-id");

    expect(await clickAnswerMatching(page, true)).toBe(true);
    await expect(page.getByTestId("word-choice-target-card")).toBeVisible();
    await expect(screen).toHaveAttribute("data-auto-advancing", "true");
    await expect(page.getByTestId("word-choice-next-button")).toHaveCount(0);

    // Zonder klik verschijnt de volgende vraag vanzelf.
    await waitForWordChoiceAutoAdvance(page);
    await expect(screen).not.toHaveAttribute(
      "data-active-instruction-id",
      firstInstructionId ?? "",
    );
  });

  test("fout antwoord geeft vriendelijke feedback en blijft bij dezelfde vraag", async ({
    page,
  }) => {
    await openWordChoice(page);
    const screen = page.getByTestId("word-choice-screen");
    const firstInstructionId = await screen.getAttribute("data-active-instruction-id");

    expect(await clickAnswerMatching(page, false)).toBe(true);
    await expect(page.getByTestId("word-choice-target-card")).toBeVisible();
    await expect(screen).toHaveAttribute("data-auto-advancing", "false");
    // Ruim langer dan de doorschakeltijd wachten: de vraag blijft staan.
    await page.waitForTimeout(2_200);
    await expect(screen).toHaveAttribute("data-active-instruction-id", firstInstructionId ?? "");
  });

  test("een volledige ronde eindigt met het ronde-eindscherm", async ({ page }) => {
    test.slow();
    await openWordChoice(page);

    const summary = page.getByTestId("word-choice-round-summary");

    for (let step = 0; step < 24; step += 1) {
      if (await summary.isVisible().catch(() => false)) {
        break;
      }

      // Goed antwoorden en wachten tot de quiz zelf doorschakelt (T-51): zo
      // klikken we nooit een antwoordkaart aan die achter het ronde-eindscherm ligt.
      const answered = await clickAnswerMatching(page, true);
      if (!answered) {
        await page.getByTestId("word-choice-answer-area").getByRole("button").first().click();
      }
      await waitForWordChoiceAutoAdvance(page);
    }

    await expect(summary).toBeVisible();
  });
});
