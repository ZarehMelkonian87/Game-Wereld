import { expect, test, type Page } from "@playwright/test";
import { createPlayerAndOpenStrandGame } from "./helpers";

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

  test("goed antwoord geeft succesfeedback en een Volgende-knop", async ({ page }) => {
    await openWordChoice(page);

    expect(await clickAnswerMatching(page, true)).toBe(true);
    await expect(page.getByTestId("word-choice-next-button")).toBeVisible();
  });

  test("fout antwoord geeft vriendelijke feedback zonder Volgende", async ({ page }) => {
    await openWordChoice(page);

    expect(await clickAnswerMatching(page, false)).toBe(true);
    await expect(page.getByTestId("word-choice-target-card")).toBeVisible();
    await expect(page.getByTestId("word-choice-next-button")).toHaveCount(0);
  });

  test("een volledige ronde eindigt met het ronde-eindscherm", async ({ page }) => {
    await openWordChoice(page);

    const summary = page.getByTestId("word-choice-round-summary");

    for (let step = 0; step < 24; step += 1) {
      if (await summary.isVisible().catch(() => false)) {
        break;
      }

      // Eerst goed antwoorden, dan pas doorschakelen: zo klikken we nooit een
      // antwoordkaart aan die achter het ronde-eindscherm ligt.
      const answered = await clickAnswerMatching(page, true);
      if (!answered) {
        await page.getByTestId("word-choice-answer-area").getByRole("button").first().click();
      }

      const next = page.getByTestId("word-choice-next-button");
      if (await next.isVisible().catch(() => false)) {
        await next.click();
      }
    }

    await expect(summary).toBeVisible();
  });
});
