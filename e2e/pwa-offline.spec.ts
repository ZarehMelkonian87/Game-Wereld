import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";

const hash = (value: string) => `sha256-${createHash("sha256").update(value).digest("hex")}`;

test("downloadt, verifieert en opent de wereld daarna offline", async ({ browserName, page }) => {
  test.skip(browserName !== "chromium", "De blokkerende offlineproductieflow draait op Chromium.");
  const fixtureAssets = [
    {
      body: "game",
      id: "fixture-game",
      mimeType: "text/javascript",
      packageId: "magisch-strand-avontuur-beach",
      url: "/fixture/game.js",
    },
    {
      body: "media",
      id: "fixture-media",
      mimeType: "text/plain",
      packageId: "magisch-strand-avontuur-beach",
      url: "/fixture/media.txt",
    },
    {
      body: "math-game",
      id: "fixture-math-game",
      mimeType: "text/javascript",
      packageId: "rekenen-strand-basis",
      url: "/fixture/math-game.js",
    },
  ];
  const createManifest = ({
    contentVersion,
    gameId,
    id,
    worldId,
  }: {
    contentVersion: string;
    gameId: string;
    id: string;
    worldId: string;
  }) => {
    const packageAssets = fixtureAssets.filter((asset) => asset.packageId === id);
    return {
      assets: packageAssets.map((asset) => ({
        bytes: asset.body.length,
        hash: hash(asset.body),
        id: asset.id,
        license: "E2E-fixture",
        mimeType: asset.mimeType,
        required: true,
        source: "E2E-fixture",
        sourcePath: asset.id,
        url: asset.url,
      })),
      contentVersion,
      gameId,
      id,
      schemaVersion: 1,
      totalBytes: packageAssets.reduce((total, asset) => total + asset.body.length, 0),
      version: 1,
      worldId,
    };
  };
  const manifests = [
    createManifest({
      contentVersion: "magisch-strand-avontuur-2026.07",
      gameId: "magisch-strand-avontuur",
      id: "magisch-strand-avontuur-beach",
      worldId: "beach",
    }),
    createManifest({
      contentVersion: "rekenen-strand-2026.07",
      gameId: "rekenen-strand-avontuur",
      id: "rekenen-strand-basis",
      worldId: "counting",
    }),
  ];

  await page.addInitScript(
    ({ assets, packageManifests }) => {
      const nativeFetch = window.fetch.bind(window);
      window.fetch = async (input, init) => {
        const url =
          typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        const packageManifest = packageManifests.find((candidate) =>
          url.endsWith(`/offline/${candidate.id}-v${candidate.version}.json`),
        );
        if (packageManifest) {
          return new Response(JSON.stringify(packageManifest), {
            headers: { "content-type": "application/json" },
          });
        }
        const asset = assets.find((candidate) => url.endsWith(candidate.url));
        return asset
          ? new Response(asset.body, { headers: { "content-type": asset.mimeType } })
          : nativeFetch(input, init);
      };
    },
    { assets: fixtureAssets, packageManifests: manifests },
  );

  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.getByRole("button", { name: "START" }).click();
  await page.getByRole("button", { name: "NIEUW SPELER" }).click();
  await page.locator('[data-component="AvatarCard"]').first().click();
  await page.getByPlaceholder("Type je gamer naam...").fill("Offline Tester");
  await page.getByRole("button", { name: "LET'S GO!" }).click();
  await page.getByRole("button", { name: /Speciale Woordenschat/ }).click();

  const offlineCard = page.locator('[data-component="OfflinePackageCard"]');
  await offlineCard.getByRole("button", { name: "Grootte controleren" }).click();
  await expect(offlineCard.getByText(/Downloadgrootte:/)).toBeVisible();
  await offlineCard.getByRole("button", { name: "Downloaden" }).click();
  await expect(offlineCard.getByText(/Offline beschikbaar/)).toBeVisible();

  await page.goto("/games/math");
  const mathOfflineCard = page.locator('[data-component="OfflinePackageCard"]');
  await mathOfflineCard.getByRole("button", { name: "Grootte controleren" }).click();
  await mathOfflineCard.getByRole("button", { name: "Downloaden" }).click();
  await expect(mathOfflineCard.getByText(/Offline beschikbaar/)).toBeVisible();
  await page.getByRole("button", { name: /Schelpen Tellen/ }).click();
  await expect(page.getByTestId("start-screen")).toBeVisible();
  await page.getByRole("button", { name: "Start met tellen" }).click();
  await expect(page.getByRole("img", { name: "Er liggen 1 schelpen." })).toBeVisible();

  await page.goto("/games/vocabulary");
  await page.getByRole("button", { name: /Magisch Strand-Avontuur/ }).click();
  await expect(page.getByTestId("start-screen")).toBeVisible();
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.register(`/sw.js?e2e-update=${Date.now()}`);
    const candidate = registration.installing ?? registration.waiting;
    if (!candidate || candidate.state === "installed") return;
    await new Promise<void>((resolve) => {
      candidate.addEventListener("statechange", () => {
        if (candidate.state === "installed") resolve();
      });
    });
  });
  await expect(page.getByText("Update klaar na dit spel")).toBeVisible();
  expect(
    await page.evaluate(
      async () => (await caches.keys()).filter((name) => name.includes("precache")).length,
    ),
  ).toBeGreaterThan(0);
  await page.goto("/games/vocabulary");
  await expect(page.getByText("Een nieuwe versie staat klaar")).toBeVisible();
  await page.getByRole("button", { name: "Nu bijwerken" }).click();
  await page.waitForLoadState("domcontentloaded");
  await expect
    .poll(async () => {
      try {
        return await page.evaluate(
          async () => (await caches.keys()).filter((name) => name.includes("precache")).length,
        );
      } catch {
        return -1;
      }
    })
    .toBe(1);
  await page.getByRole("button", { name: /Magisch Strand-Avontuur/ }).click();
  await expect(page.getByTestId("start-screen")).toBeVisible();
  await page.evaluate(() => {
    const durations: number[] = [];
    (
      window as typeof window & {
        __longTaskDurations?: number[];
      }
    ).__longTaskDurations = durations;
    if (PerformanceObserver.supportedEntryTypes.includes("longtask")) {
      new PerformanceObserver((list) => {
        durations.push(...list.getEntries().map((entry) => entry.duration));
      }).observe({ type: "longtask" });
    }
  });
  await page.getByTestId("start-play-button").click();
  await expect(page.getByTestId("compact-mode-card-listen-and-place")).toBeVisible();
  const longestTask = await page.evaluate(() =>
    Math.max(
      0,
      ...((window as typeof window & { __longTaskDurations?: number[] }).__longTaskDurations ?? []),
    ),
  );
  expect(longestTask).toBeLessThanOrEqual(100);
  expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  const cachedPaths = await page.evaluate(async () => {
    const names = await caches.keys();
    return (
      await Promise.all(
        names.map(async (name) => {
          const cache = await caches.open(name);
          return (await cache.keys()).map((request) => new URL(request.url).pathname);
        }),
      )
    ).flat();
  });
  expect(cachedPaths).toContain("/index.html");

  await page.route("**/*", (route) => route.abort("internetdisconnected"));
  await page.reload().catch(() => undefined);
  await expect(page.getByTestId("start-screen")).toBeVisible();
  await page.goto("/games/math");
  await page.getByRole("button", { name: /Schelpen Tellen/ }).click();
  await expect(page.getByTestId("start-screen")).toBeVisible();
  await page.getByRole("button", { name: "Start met tellen" }).click();
  await expect(page.getByRole("img", { name: "Er liggen 1 schelpen." })).toBeVisible();
});
