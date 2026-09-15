import { expect, test, type Page } from "@playwright/test";
import { earnStarsToUnlockModes } from "./helpers";

const failOnBrowserErrors = (page: Page) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  return () => expect(browserErrors, "onverwachte browserfouten").toEqual([]);
};

const setupPlayerAndOpenStrandGame = async (page: Page) => {
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

  await page.getByPlaceholder("Type je gamer naam...").fill("Strand Tester");
  await page.getByRole("button", { name: "LET'S GO!" }).click();
  await expect(page.getByText("Strand Tester", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Speciale Woordenschat/ }).click();
  await page.getByRole("button", { name: /Magisch Strand-Avontuur/ }).click();
  await expect(page.getByTestId("start-screen")).toBeVisible();
};

test.describe("Magisch Strand-Avontuur: Fase 1 - Startscherm", () => {
  test("1.1: Startscherm toont alle basiselementen", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await expect(page.getByTestId("start-screen")).toBeVisible();
    await expect(page.getByTestId("start-star-counter")).toBeVisible();
    await expect(page.getByTestId("start-settings-button")).toBeVisible();
    await expect(page.getByTestId("start-play-button")).toBeVisible();
    await expect(page.getByRole("button", { name: "Terug naar spellen" })).toBeVisible();

    expectNoBrowserErrors();
  });

  test("1.2: Klik op Instellingen navigeert naar het instellingenscherm", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-settings-button").click();
    await expect(page.getByTestId("game-settings-screen")).toBeVisible();
    await expect(page.getByTestId("settings-title")).toHaveText("Instellingen");

    expectNoBrowserErrors();
  });

  test("1.3: Klik op Terug navigeert terug naar portaal", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByRole("button", { name: "Terug naar spellen" }).click();
    await expect(page.getByTestId("start-screen")).not.toBeVisible();
    await expect(page.getByRole("button", { name: /Magisch Strand-Avontuur/ })).toBeVisible();

    expectNoBrowserErrors();
  });

  test("1.4: Klik op Spelen navigeert door naar modusselectie", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-play-button").click();
    await expect(page.getByTestId("compact-mode-card-listen-and-place")).toBeVisible();

    expectNoBrowserErrors();
  });
});

test.describe("Magisch Strand-Avontuur: Fase 2 - Instellingenscherm", () => {
  test("2.1 & 2.2: Toggles kunnen worden bediend en wijzigen toestand", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-settings-button").click();
    await expect(page.getByTestId("game-settings-screen")).toBeVisible();

    const audioToggle = page.getByTestId("settings-audio-toggle");
    await expect(audioToggle).toBeVisible();
    const initialAudioState = await audioToggle.getAttribute("aria-pressed");

    await audioToggle.click();
    const toggledAudioState = await audioToggle.getAttribute("aria-pressed");
    expect(toggledAudioState).not.toBe(initialAudioState);

    const musicToggle = page.getByTestId("settings-music-toggle");
    await expect(musicToggle).toBeVisible();
    const initialMusicState = await musicToggle.getAttribute("aria-pressed");

    await musicToggle.click();
    const toggledMusicState = await musicToggle.getAttribute("aria-pressed");
    expect(toggledMusicState).not.toBe(initialMusicState);

    expectNoBrowserErrors();
  });

  test("2.3: Spraakprivacy- en microfoonstatus worden getoond", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-settings-button").click();
    await expect(page.getByTestId("game-settings-screen")).toBeVisible();

    const privacyCard = page.getByTestId("settings-voice-privacy-card");
    await expect(privacyCard).toBeVisible();
    await expect(privacyCard).toContainText("Microfoon en privacy");

    expectNoBrowserErrors();
  });

  test("2.4: Voortgang reset dialoog: annuleren en bevestigen", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-settings-button").click();
    await expect(page.getByTestId("game-settings-screen")).toBeVisible();

    await page.getByTestId("settings-reset-progress-button").click();
    await expect(page.getByTestId("settings-confirm-reset-dialog")).toBeVisible();

    await page.getByTestId("settings-cancel-reset-button").click();
    await expect(page.getByTestId("settings-confirm-reset-dialog")).not.toBeVisible();

    await page.getByTestId("settings-reset-progress-button").click();
    await expect(page.getByTestId("settings-confirm-reset-dialog")).toBeVisible();
    await page.getByTestId("settings-confirm-reset-button").click();

    await expect(page.getByTestId("settings-confirm-reset-dialog")).not.toBeVisible();
    await expect(page.getByTestId("settings-reset-message")).toBeVisible();

    expectNoBrowserErrors();
  });

  test("2.5: Terugknop navigeert terug naar StartScreen", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-settings-button").click();
    await expect(page.getByTestId("game-settings-screen")).toBeVisible();

    await page.getByTestId("settings-back-button").click();
    await expect(page.getByTestId("start-screen")).toBeVisible();

    expectNoBrowserErrors();
  });
});

test.describe("Magisch Strand-Avontuur: Fase 3 - Zeg & Zet (SceneBuilder)", () => {
  test("3.1: Starten van Zeg & Zet toont speelveld, instructie en objectbalk", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-play-button").click();
    await earnStarsToUnlockModes(page);
    await page.getByTestId("compact-mode-card-listen-and-place").click();
    await page.getByTestId("adventure-start-game-button").click();

    await expect(page.getByTestId("scene-builder-screen")).toBeVisible();
    await expect(page.getByTestId("scene-builder-instruction-area")).toBeVisible();
    await expect(page.getByTestId("scene-builder-instruction-text")).toBeVisible();
    await expect(page.getByTestId("scene-builder-tray-area")).toBeVisible();
    await expect(page.getByTestId("scene-tap-target")).toBeVisible();

    expectNoBrowserErrors();
  });

  test("3.2: Typfunctionaliteit (openen, commando typen en bevestigen)", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-play-button").click();
    await earnStarsToUnlockModes(page);
    await page.getByTestId("compact-mode-card-listen-and-place").click();
    await page.getByTestId("adventure-start-game-button").click();
    await expect(page.getByTestId("scene-builder-screen")).toBeVisible();

    const instructionText = await page.getByTestId("scene-builder-instruction-text").innerText();
    expect(instructionText.length).toBeGreaterThan(0);

    await page.getByTestId("typed-command-open-button").click();
    await expect(page.getByTestId("typed-command-fallback")).toBeVisible();

    await page.getByTestId("typed-command-input").fill(instructionText);
    await page.getByTestId("typed-command-submit-button").click();

    await expect(page.getByTestId("typed-command-fallback")).not.toBeVisible();

    expectNoBrowserErrors();
  });

  test("3.3: Microfoon & SpeechWaveAnimation (activatie & hoge positie)", async ({
    page,
    context,
  }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await context.grantPermissions(["microphone"]);

    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-play-button").click();
    await earnStarsToUnlockModes(page);
    await page.getByTestId("compact-mode-card-listen-and-place").click();
    await page.getByTestId("adventure-start-game-button").click();
    await expect(page.getByTestId("scene-builder-screen")).toBeVisible();

    const micButton = page.getByTestId("voice-command-button");
    await expect(micButton).toBeVisible();

    await micButton.click();

    const privacyDialogAccept = page.getByTestId("voice-privacy-accept-button");
    if (await privacyDialogAccept.isVisible()) {
      await privacyDialogAccept.click();
    }

    const speechWave = page.locator('[data-slot="speech-wave-animation"]');
    await expect(speechWave).toBeVisible({ timeout: 5000 });

    const boundingBox = await speechWave.boundingBox();
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      expect(boundingBox.y).toBeLessThan(350);
    }

    // De wave heeft geen aparte "Klaar"-knop meer: hij rondt automatisch af na
    // een korte stilte (T-35).

    expectNoBrowserErrors();
  });

  test("3.4: Handmatige stickerselectie en plaatsing via tap", async ({ page }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-play-button").click();
    await earnStarsToUnlockModes(page);
    await page.getByTestId("compact-mode-card-listen-and-place").click();
    await page.getByTestId("adventure-start-game-button").click();
    await expect(page.getByTestId("scene-builder-screen")).toBeVisible();

    const firstSticker = page.getByTestId("scene-builder-tray-area").getByRole("button").first();
    await expect(firstSticker).toBeVisible();
    await firstSticker.click();

    const sceneTapTarget = page.getByTestId("scene-tap-target");
    await sceneTapTarget.click({ position: { x: 300, y: 300 } });

    expectNoBrowserErrors();
  });

  test("3.5: Onduidelijk commando toont herstelbare feedback zonder door te gaan", async ({
    page,
  }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-play-button").click();
    await earnStarsToUnlockModes(page);
    await page.getByTestId("compact-mode-card-listen-and-place").click();
    await page.getByTestId("adventure-start-game-button").click();

    const sceneBuilder = page.getByTestId("scene-builder-screen");
    await expect(sceneBuilder).toBeVisible();
    const instructionBefore = await sceneBuilder.getAttribute("data-active-instruction-id");

    // Een onduidelijk commando levert geen goede plaatsing op: de auto-bevestiging
    // plaatst niets en toont vriendelijke "almost"-feedback (T-35). De opdracht
    // gaat niet verder.
    await page.getByTestId("typed-command-open-button").click();
    await page.getByTestId("typed-command-input").fill("appelmoes");
    await page.getByTestId("typed-command-submit-button").click();

    await expect(sceneBuilder).toHaveAttribute("data-feedback-kind", "almost");
    expect(await sceneBuilder.getAttribute("data-active-instruction-id")).toBe(instructionBefore);

    expectNoBrowserErrors();
  });

  test("3.6: Goed getypt commando plaatst automatisch en gaat door naar de volgende opdracht", async ({
    page,
  }) => {
    const expectNoBrowserErrors = failOnBrowserErrors(page);
    await setupPlayerAndOpenStrandGame(page);

    await page.getByTestId("start-play-button").click();
    await earnStarsToUnlockModes(page);
    await page.getByTestId("compact-mode-card-listen-and-place").click();
    await page.getByTestId("adventure-start-game-button").click();

    const sceneBuilder = page.getByTestId("scene-builder-screen");
    await expect(sceneBuilder).toBeVisible();
    const instructionBefore = await sceneBuilder.getAttribute("data-active-instruction-id");
    const instructionText = await page.getByTestId("scene-builder-instruction-text").innerText();

    await page.getByTestId("typed-command-open-button").click();
    await page.getByTestId("typed-command-input").fill(instructionText);
    await page.getByTestId("typed-command-submit-button").click();

    // Geen "Klaar"-knop meer: de plaatsing wordt automatisch bevestigd en bij een
    // goed antwoord gaat het spel vanzelf naar de volgende opdracht (T-35).
    await expect
      .poll(async () => sceneBuilder.getAttribute("data-active-instruction-id"), { timeout: 8000 })
      .not.toBe(instructionBefore);

    expectNoBrowserErrors();
  });
});
