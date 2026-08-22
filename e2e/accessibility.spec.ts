import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const auditCurrentScreen = async (page: Page, screenName: string) => {
  const result = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(result.violations, `${screenName}: WCAG 2.2 A/AA-overtredingen`).toEqual([]);
};

const openProfileSelection = async (page: Page) => {
  await page.goto("/");
  await page.getByRole("button", { name: "START" }).click();
  await expect(page.getByRole("button", { name: "NIEUW SPELER" })).toBeVisible();
};

const createProfile = async (page: Page) => {
  await openProfileSelection(page);
  await page.getByRole("button", { name: "NIEUW SPELER" }).click();
  await page.locator('[data-component="AvatarCard"]').first().click();
  await page.getByPlaceholder("Type je gamer naam...").fill("A11y Tester");
  await page.getByRole("button", { name: "LET'S GO!" }).click();
  await expect(page.getByText("A11y Tester", { exact: true })).toBeVisible();
};

const openSceneBuilder = async (page: Page) => {
  await page.getByRole("button", { name: /Speciale Woordenschat/ }).click();
  await page.getByRole("button", { name: /Magisch Strand-Avontuur/ }).click();
  await expect(page.getByTestId("start-screen")).toBeVisible();
  await page.getByTestId("start-play-button").click();
  await page.getByTestId("compact-mode-card-listen-and-place").click();
  await page.getByTestId("adventure-start-game-button").click();
  await expect(page.getByTestId("scene-builder-screen")).toBeVisible();
};

test("@accessibility auditeert alle release-kernschermen met axe", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "GAME WERELD" })).toBeVisible();
  const reducedMotionState = await page.evaluate(() => {
    const startButton = document.querySelector<HTMLButtonElement>('button[type="button"]');
    return {
      duration: startButton ? window.getComputedStyle(startButton).transitionDuration : null,
      matches: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  });
  expect(reducedMotionState.matches, "prefers-reduced-motion is actief").toBe(true);
  expect(
    Number.parseFloat(reducedMotionState.duration ?? "1"),
    "transitie is praktisch uitgeschakeld",
  ).toBeLessThanOrEqual(0.00001);
  await auditCurrentScreen(page, "welkom");

  await page.getByRole("button", { name: "START" }).click();
  await auditCurrentScreen(page, "profielselectie");

  await page.getByRole("button", { name: "NIEUW SPELER" }).click();
  await page.locator('[data-component="AvatarCard"]').first().click();
  await page.getByPlaceholder("Type je gamer naam...").fill("Axe Tester");
  await page.getByRole("button", { name: "LET'S GO!" }).click();
  await auditCurrentScreen(page, "catalogus");

  await page.goto("/settings");
  await auditCurrentScreen(page, "instellingen");

  await page.goto("/progress");
  await auditCurrentScreen(page, "voortgang");

  await page.goto("/home");
  await page.getByRole("button", { name: /Speciale Woordenschat/ }).click();
  await page.getByRole("button", { name: /Magisch Strand-Avontuur/ }).click();
  await expect(page.getByTestId("start-screen")).toBeVisible();
  await auditCurrentScreen(page, "GameHost");

  await page.goto("/games/math/rekenen-strand-avontuur");
  await expect(page.getByRole("heading", { name: "Schelpen Tellen" })).toBeVisible();
  await auditCurrentScreen(page, "Schelpen Tellen start");
  await page.getByRole("button", { name: "Start met tellen" }).click();
  await auditCurrentScreen(page, "Schelpen Tellen opdracht");
});

test("@accessibility voltooit de kernopdracht met geweigerde microfoon en toetsenbord", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "webkitSpeechRecognition", {
      configurable: true,
      value: () => undefined,
    });
    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      value: {
        query: async () => ({ state: "denied" }),
      },
    });
  });

  await createProfile(page);
  await openSceneBuilder(page);

  await page.getByRole("button", { name: "Zeg een zin" }).click();
  await page.getByTestId("voice-privacy-accept-button").click();
  await expect(page.getByTestId("microphone-permission-message")).toContainText(
    /geblokkeerd|geweigerd/,
  );
  await expect(page.getByTestId("typed-command-fallback")).toBeVisible();

  const commandInput = page.getByTestId("typed-command-input");
  const command = await commandInput.getAttribute("placeholder");
  expect(command).toBeTruthy();
  await commandInput.focus();
  await page.keyboard.type(command ?? "");
  await page.keyboard.press("Enter");

  const pendingPlacement = page.locator('[data-testid^="pending-object-"]');
  await expect(pendingPlacement).toBeVisible();
  await expect(pendingPlacement).toHaveAttribute("data-placement-source", "spoken");
  const sceneBuilder = page.getByTestId("scene-builder-screen");
  const targetZoneId = await sceneBuilder.getAttribute("data-target-zone-id");
  const targetObjectId = await sceneBuilder.getAttribute("data-target-object-id");
  expect(targetZoneId).toBeTruthy();
  expect(targetObjectId).toBeTruthy();
  await expect(sceneBuilder).toHaveAttribute("data-selected-zone-id", targetZoneId ?? "");
  await expect(sceneBuilder).toHaveAttribute("data-selected-object-id", targetObjectId ?? "");
  const activeRelation = await sceneBuilder.getAttribute("data-active-relation");
  const selectedZoneConcepts = await sceneBuilder.getAttribute("data-selected-zone-concepts");
  expect(selectedZoneConcepts?.split(",")).toContain(activeRelation);
  await page.getByTestId("scene-builder-confirm-button").click();
  await expect(page.getByTestId("scene-builder-confirm-button")).toHaveAccessibleName(
    /Volgende|Opnieuw/,
  );

  const firstObject = page.getByTestId("scene-builder-tray-area").getByRole("button").first();
  await firstObject.focus();
  await page.keyboard.press("Enter");
  await page.getByTestId("scene-tap-target").focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByTestId("scene-keyboard-cursor")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-testid^="pending-object-"]')).toBeVisible();
});
