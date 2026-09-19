import { expect, test, type Page } from "@playwright/test";
import { createPlayerAndOpenStrandGame, earnStarsToUnlockModes } from "./helpers";

// Eén zin met objecten uit álle thema's; placeCompound filtert per bouwkaart de
// passende objecten en haalt zo elk doel (elk thema heeft er hier ≥ goalCount).
const MEGA_SENTENCE =
  "de boot en de dolfijn en de krab en de schelp en de bal en de vlieger en de parasol en de zon en het vliegtuig op het strand";

const openZegBouw = async (page: Page) => {
  await createPlayerAndOpenStrandGame(page);
  await page.getByTestId("start-play-button").click();
  // Zeg & Bouw is vergrendeld tot er sterren zijn verdiend (T-31/T-04): eerst een
  // ronde Kies het Woord spelen om het te ontgrendelen.
  await earnStarsToUnlockModes(page);
  await page.getByTestId("compact-mode-card-zeg-en-bouw").click();
  await page.getByTestId("adventure-start-game-button").click();
  await expect(page.getByTestId("zeg-bouw-screen")).toBeVisible();
};

const buildFullCard = async (page: Page) => {
  await page.getByTestId("typed-command-open-button").click();
  await page.getByTestId("typed-command-input").fill(MEGA_SENTENCE);
  await page.getByTestId("typed-command-submit-button").click();
};

test.describe("Zeg & Bouw (e2e)", () => {
  test("rendert de bouwkaart, het strand en de objectbalk", async ({ page }) => {
    await openZegBouw(page);

    await expect(page.getByTestId("zeg-bouw-card")).toBeVisible();
    await expect(page.getByTestId("zeg-bouw-tap-target")).toBeVisible();
    await expect(page.getByTestId("zeg-bouw-progress")).toBeVisible();
    await expect(page.getByTestId("zeg-bouw-screen")).toHaveAttribute("data-progress-count", "0");
    expect(await page.locator('[data-component="ObjectCarousel"] button').count()).toBe(12);
  });

  test("een plaatje kiezen vraagt om een plek (tik-flow)", async ({ page }) => {
    await openZegBouw(page);

    await page.locator('[data-component="ObjectCarousel"] button').first().click();

    await expect(page.getByTestId("zeg-bouw-screen")).not.toHaveAttribute(
      "data-selected-object-id",
      "",
    );
    await expect(page.getByTestId("zeg-bouw-feedback")).toBeVisible();
  });

  test("een samengestelde zin bouwt de kaart af en toont het ronde-eindscherm", async ({
    page,
  }) => {
    await openZegBouw(page);
    await buildFullCard(page);

    // Doel gehaald, maar het eindscherm verschijnt bewust met een korte vertraging.
    await expect(page.getByTestId("zeg-bouw-screen")).toHaveAttribute(
      "data-build-complete",
      "true",
    );
    const summary = page.getByTestId("zeg-bouw-complete");
    await expect(summary).toBeVisible({ timeout: 8000 });
    await expect(summary).toContainText("Strand af!");
    await expect(page.getByTestId("zeg-bouw-summary-objects")).toBeVisible();
    await expect(page.getByTestId("zeg-bouw-next-reward")).toBeVisible();
  });

  test("Volgende strand start een verse bouwkaart", async ({ page }) => {
    await openZegBouw(page);
    await buildFullCard(page);
    await expect(page.getByTestId("zeg-bouw-complete")).toBeVisible({ timeout: 8000 });

    await page.getByTestId("zeg-bouw-next-card-button").click();

    await expect(page.getByTestId("zeg-bouw-complete")).toHaveCount(0);
    await expect(page.getByTestId("zeg-bouw-screen")).toHaveAttribute("data-progress-count", "0");
  });

  test("Menu keert terug naar het keuzescherm", async ({ page }) => {
    await openZegBouw(page);
    await buildFullCard(page);
    await expect(page.getByTestId("zeg-bouw-complete")).toBeVisible({ timeout: 8000 });

    await page.getByTestId("zeg-bouw-menu-button").click();

    await expect(page.getByTestId("adventure-select-screen")).toBeVisible();
  });

  test("Vrij bouwen: elk plaatje mag, zonder doel of eindscherm (variant B)", async ({ page }) => {
    await openZegBouw(page);

    await page.getByTestId("zeg-bouw-mode-toggle").click();
    await expect(page.getByTestId("zeg-bouw-card")).toContainText("Vrij bouwen");

    await page.locator('[data-component="ObjectCarousel"] button').first().click();
    await page.getByTestId("zeg-bouw-tap-target").click({ position: { x: 200, y: 250 } });

    // Mascotte benoemt mee; er is geen doel en dus geen ronde-eindscherm.
    await expect(page.getByTestId("zeg-bouw-feedback")).toContainText(/Wat mooi/);
    await expect(page.getByTestId("zeg-bouw-progress")).toContainText("gebouwd");
    await expect(page.getByTestId("zeg-bouw-complete")).toHaveCount(0);
    await expect(page.getByTestId("zeg-bouw-screen")).toHaveAttribute(
      "data-build-complete",
      "false",
    );
  });
});
