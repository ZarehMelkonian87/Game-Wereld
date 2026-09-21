import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import { earnStarsToUnlockModes, openStrandGameFromList } from "./helpers";

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

const countDatabaseStore = (page: Page, storeName: string) =>
  page.evaluate(
    ({ databaseName, requestedStore }) =>
      new Promise<number>((resolve, reject) => {
        const request = window.indexedDB.open(databaseName);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const database = request.result;
          const transaction = database.transaction(requestedStore, "readonly");
          const countRequest = transaction.objectStore(requestedStore).count();
          countRequest.onerror = () => reject(countRequest.error);
          countRequest.onsuccess = () => {
            resolve(countRequest.result);
            database.close();
          };
        };
      }),
    { databaseName: "game-wereld", requestedStore: storeName },
  );

test("maakt een profiel, herstelt het en opent de hoofdgame veilig", async ({ page }) => {
  const expectNoBrowserErrors = failOnBrowserErrors(page);

  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
  });
  await page.reload();
  await expect(page.getByRole("heading", { name: "GAME WERELD" })).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accessibility.violations, "WCAG 2.2 AA-overtredingen").toEqual([]);
  await page.getByRole("button", { name: "START" }).click();

  await page.getByRole("button", { name: "NIEUWE SPELER" }).click();
  await expect(page.getByRole("heading", { name: "KIES JE AVATAR" })).toBeVisible();
  await page.locator('[data-component="AvatarCard"]').first().click();

  await page.getByPlaceholder("Typ je gamernaam...").fill("Codex Tester");
  await page.getByRole("button", { name: "LET'S GO!" }).click();
  await expect(page.getByText("Codex Tester", { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByText("Codex Tester", { exact: true })).toBeVisible();

  await page.getByTitle("Profielinstellingen").click();
  const soundSetting = page.getByRole("button", { name: /Sound FX/ });
  await expect(soundSetting).toHaveAttribute("aria-pressed", "true");
  await soundSetting.click();
  await expect(soundSetting).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(page.getByRole("button", { name: /Sound FX/ })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await page.getByRole("button", { name: "Terug" }).click();

  await page.getByRole("button", { name: /Speciale Woordenschat/ }).click();
  await openStrandGameFromList(page);

  await page.getByTestId("start-play-button").click();
  // Zeg & Zet is vergrendeld tot er sterren verdiend zijn (T-31): eerst een
  // ronde Kies het Woord spelen om het te ontgrendelen.
  await earnStarsToUnlockModes(page);
  await page.getByTestId("compact-mode-card-listen-and-place").click();
  await page.getByTestId("adventure-start-game-button").click();
  await expect(page.getByTestId("scene-builder-screen")).toBeVisible();
  await page.getByRole("button", { name: "Terug" }).click();
  await page.getByTestId("compact-mode-card-choose-word").click();
  await page.getByTestId("adventure-start-game-button").click();
  await expect(page.getByTestId("word-choice-screen")).toBeVisible();
  const answers = page.getByTestId("word-choice-answer-area").getByRole("button");
  const answerCount = await answers.count();
  for (let index = 0; index < answerCount; index += 1) {
    await answers.nth(index).click();
    // Na een goed antwoord schakelt de quiz zelf door (T-51); één antwoord
    // (goed of fout) is genoeg voor een oefenobservatie.
    if (
      (await page.getByTestId("word-choice-screen").getAttribute("data-auto-advancing")) === "true"
    ) {
      break;
    }
  }
  await expect.poll(() => countDatabaseStore(page, "practiceEvents")).toBeGreaterThan(0);

  await page.goto("/progress");
  await expect(
    page.getByText(/Gebaseerd op \d+ oefenpogingen met rekenregel versie 1/),
  ).toBeVisible();
  await expect(page.getByText(/Geregistreerd:.*oefenpogingen/)).toBeVisible();

  // Rekenen is nog niet beschikbaar: de zone is vergrendeld en niet te openen.
  await page.goto("/home");
  const mathZone = page.locator('[data-theme-id="math"]');
  await expect(mathZone).toHaveAttribute("data-coming-soon", "true");
  await expect(mathZone).toContainText("Binnenkort beschikbaar");
  // Playwright klikt geen aria-disabled knop; force bewijst dat een tik niets doet.
  await mathZone.click({ force: true });
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/home$/);

  await page.goto("/settings");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Voortgang downloaden" }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(downloadPath).toBeTruthy();
  const exportedProgress = JSON.parse(fs.readFileSync(downloadPath ?? "", "utf8")) as {
    practiceEvents: Array<{ gameId: string }>;
    profileAlias: string;
  };
  expect(exportedProgress.profileAlias).toBe("local-profile");
  expect(exportedProgress.practiceEvents.map((event) => event.gameId)).toEqual(
    expect.arrayContaining(["magisch-strand-avontuur"]),
  );
  expect(JSON.stringify(exportedProgress)).not.toContain("Codex Tester");

  await page.evaluate(() => {
    Math.random = () => 0;
  });
  await page.getByRole("button", { name: "Speler verwijderen" }).click();
  await expect(page.getByText("Wat is 5 + 5?")).toBeVisible();
  await page.getByPlaceholder("?").fill("10");
  const confirmDelete = page.getByRole("button", { name: "Ja, verwijderen" });
  await expect(confirmDelete).toBeEnabled();
  await confirmDelete.click();
  await expect(page.getByRole("heading", { name: "GAME WERELD" })).toBeVisible();
  for (const storeName of [
    "profiles",
    "profileSettings",
    "settings",
    "gameSessions",
    "practiceEvents",
    "progressProjections",
  ]) {
    await expect.poll(() => countDatabaseStore(page, storeName)).toBe(0);
  }
  await page.reload();
  await page.getByRole("button", { name: "START" }).click();
  await expect(page.getByText("Codex Tester", { exact: true })).toHaveCount(0);
  expectNoBrowserErrors();
});

test("herstelt van ontbrekende duurzame opslag met zichtbare tijdelijke modus", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", {
      configurable: true,
      get: () => undefined,
    });
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Voortgangsopslag is niet beschikbaar" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Tijdelijk spelen" }).click();
  await expect(page.getByText(/Tijdelijke modus: voortgang wordt niet bewaard/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "GAME WERELD" })).toBeVisible();
});
