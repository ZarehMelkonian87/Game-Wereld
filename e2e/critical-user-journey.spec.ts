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

  await page.getByRole("button", { name: "NIEUW SPELER" }).click();
  await expect(page.getByRole("heading", { name: "KIES JE AVATAR" })).toBeVisible();
  await page.locator('[data-component="AvatarCard"]').first().click();

  await page.getByPlaceholder("Type je gamer naam...").fill("Codex Tester");
  await page.getByRole("button", { name: "LET'S GO!" }).click();
  await expect(page.getByText("Codex Tester", { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByText("Codex Tester", { exact: true })).toBeVisible();

  await page.getByTitle("Profiel Instellingen").click();
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
  await page.getByRole("button", { name: /Magisch Strand-Avontuur/ }).click();
  await expect(page.getByTestId("start-screen")).toBeVisible();

  await page.goBack();
  await expect(page.getByRole("heading", { name: "Speciale Woordenschat" })).toBeVisible();

  await page.goto("/settings");
  await page.getByRole("button", { name: "Delete Speler" }).click();
  const equation = await page.getByText(/Wat is \d+ \+ \d+\?/).textContent();
  const operands = equation?.match(/(\d+) \+ (\d+)/);
  expect(operands).not.toBeNull();
  await page.getByPlaceholder("?").fill(String(Number(operands?.[1]) + Number(operands?.[2])));
  await page.getByRole("button", { name: "Ja, Delete" }).click();
  await expect(page.getByRole("heading", { name: "GAME WERELD" })).toBeVisible();
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
