import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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

test("maakt een profiel, herstelt het en opent de hoofdgame veilig", async ({ page }) => {
  const expectNoBrowserErrors = failOnBrowserErrors(page);

  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await expect(page.getByRole("heading", { name: "GAME WERELD" })).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accessibility.violations, "WCAG 2.2 AA-overtredingen").toEqual([]);
  await page.getByRole("button", { name: "START" }).click();

  await page.getByRole("button", { name: "NIEUW SPELER" }).click();
  await expect(page.getByRole("heading", { name: "KIES JE AVATAR" })).toBeVisible();
  await page.locator('[data-component="AvatarCard"]').first().click();

  await page.getByPlaceholder("Type je gamer naam...").fill("Codex Tester");
  await page.getByRole("button", { name: "LET'S GO!" }).click();
  await expect(page.getByText("Codex Tester", { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByText("Codex Tester", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Speciale Woordenschat/ }).click();
  await page.getByRole("button", { name: /Magisch Strand-Avontuur/ }).click();
  await expect(page.getByTestId("start-screen")).toBeVisible();

  await page.goBack();
  await expect(page.getByRole("heading", { name: "Speciale Woordenschat" })).toBeVisible();
  expectNoBrowserErrors();
});
