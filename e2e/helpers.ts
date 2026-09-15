import { expect, type Page } from "@playwright/test";

/**
 * Maakt een vers profiel aan en opent Magisch Strand-Avontuur tot het
 * startscherm. Gedeelde setup voor de modus-specifieke e2e-suites (T-24).
 */
export const createPlayerAndOpenStrandGame = async (
  page: Page,
  name = "Suite Tester",
): Promise<void> => {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
  });
  await page.reload();

  await expect(page.getByRole("heading", { name: "GAME WERELD" })).toBeVisible();
  await page.getByRole("button", { name: "START" }).click();

  await page.getByRole("button", { name: "NIEUW SPELER" }).click();
  await expect(page.getByRole("heading", { name: "KIES JE AVATAR" })).toBeVisible();
  await page.locator('[data-component="AvatarCard"]').first().click();

  await page.getByPlaceholder("Type je gamer naam...").fill(name);
  await page.getByRole("button", { name: "LET'S GO!" }).click();
  await expect(page.getByText(name, { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Speciale Woordenschat/ }).click();
  await page.getByRole("button", { name: /Magisch Strand-Avontuur/ }).click();
  await expect(page.getByTestId("start-screen")).toBeVisible();
};

/**
 * Speelt één volledige ronde "Kies het Woord" (de altijd-open instapmodus) met
 * correcte antwoorden, zodat er genoeg sterren worden verdiend om Zeg & Zet en
 * Zeg & Vlieg te ontgrendelen (T-31). De correcte optie is die waarvan het
 * aria-label in de vraagtekst voorkomt ("Waar is de boot?" → knop "Boot").
 *
 * Verwacht dat de pagina op het modus-/wereldkeuzescherm staat (mode-cards
 * zichtbaar) en eindigt daar ook weer, met alle modi ontgrendeld.
 */
export const earnStarsToUnlockModes = async (page: Page): Promise<void> => {
  await page.getByTestId("compact-mode-card-choose-word").click();
  await page.getByTestId("adventure-start-game-button").click();
  await expect(page.getByTestId("word-choice-screen")).toBeVisible();

  const summaryBack = page.getByRole("button", { name: "Terug naar wereldkeuze" });

  for (let round = 0; round < 24; round += 1) {
    if (await summaryBack.isVisible().catch(() => false)) {
      break;
    }

    const question = (
      await page.getByTestId("word-choice-question-panel").innerText()
    ).toLowerCase();
    const answers = page.getByTestId("word-choice-answer-area").getByRole("button");
    const answerCount = await answers.count();

    let answered = false;
    for (let index = 0; index < answerCount; index += 1) {
      const label = (await answers.nth(index).getAttribute("aria-label"))?.toLowerCase() ?? "";
      if (label && question.includes(label)) {
        await answers.nth(index).click();
        answered = true;
        break;
      }
    }

    if (!answered && answerCount > 0) {
      await answers.first().click();
    }

    const nextButton = page.getByTestId("word-choice-next-button");
    if (await nextButton.isVisible().catch(() => false)) {
      await nextButton.click();
    }
  }

  await summaryBack.click();
  await expect(page.getByTestId("compact-mode-card-listen-and-place")).toHaveAttribute(
    "data-disabled",
    "false",
  );
};
