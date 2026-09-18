import { expect, test, type Page } from "@playwright/test";
import { createPlayerAndOpenStrandGame, earnStarsToUnlockModes } from "./helpers";

const openVoiceScroller = async (page: Page) => {
  await createPlayerAndOpenStrandGame(page);
  await page.getByTestId("start-play-button").click();
  // Zeg & Vlieg is vergrendeld tot er sterren zijn verdiend (T-31): eerst een
  // ronde Kies het Woord spelen om het te ontgrendelen.
  await earnStarsToUnlockModes(page);
  await page.getByTestId("compact-mode-card-zeg-en-vlieg").click();
  await page.getByTestId("adventure-start-game-button").click();
  await expect(page.getByTestId("voice-side-scroller-screen")).toBeVisible();
};

test.describe("Zeg & Vlieg (e2e)", () => {
  test("rendert stage, HUD en 3 schildjes met de start-overlay", async ({ page }) => {
    await openVoiceScroller(page);

    await expect(page.getByTestId("voice-side-scroller-stage")).toBeVisible();
    await expect(page.getByTestId("voice-side-scroller-hud")).toBeVisible();
    await expect(page.getByTestId("voice-side-scroller-shields")).toHaveAttribute(
      "data-shields",
      "3",
    );
    await expect(page.getByTestId("voice-side-scroller-start-overlay")).toBeVisible();
  });

  test("start zet de ronde in gang en de afstand loopt op", async ({ page }) => {
    await openVoiceScroller(page);

    await page.getByRole("button", { name: "Start Zeg en Vlieg" }).click();

    const screen = page.getByTestId("voice-side-scroller-screen");
    await expect(screen).toHaveAttribute("data-status", "running");
    await expect(page.getByTestId("voice-side-scroller-start-overlay")).toHaveCount(0);

    // De game-loop draait: de wereld scrollt en de afstand loopt op.
    const stage = page.getByTestId("voice-side-scroller-stage");
    await expect
      .poll(async () => Number(await stage.getAttribute("data-scroll-x")) || 0, { timeout: 8000 })
      .toBeGreaterThan(0.2);
  });
});
