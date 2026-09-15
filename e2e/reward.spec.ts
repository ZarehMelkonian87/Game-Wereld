import { expect, test, type Page } from "@playwright/test";
import { createPlayerAndOpenStrandGame } from "./helpers";

const openRewards = async (page: Page) => {
  await createPlayerAndOpenStrandGame(page);
  await page.getByTestId("start-play-button").click();
  await page.getByTestId("adventure-rewards-button").click();
  await expect(page.getByTestId("reward-screen")).toBeVisible();
};

test.describe("Beloningsscherm (e2e)", () => {
  test("rendert titel, sterrenteller en beloningskaart", async ({ page }) => {
    await openRewards(page);

    await expect(page.getByTestId("reward-title")).toHaveText("Beloning");
    await expect(page.getByTestId("reward-stars")).toBeVisible();
    await expect(page.getByTestId("reward-card")).toBeVisible();
  });

  test("toont nul sterren voor een vers profiel", async ({ page }) => {
    await openRewards(page);

    await expect(page.getByTestId("reward-stars")).toContainText("0");
  });

  test("de wereldknop keert terug naar het keuzescherm", async ({ page }) => {
    await openRewards(page);

    await page.getByTestId("reward-world-button").click();
    await expect(page.getByTestId("adventure-select-screen")).toBeVisible();
  });
});
