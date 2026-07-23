import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    hasTouch: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    viewport: { width: 1024, height: 768 },
  },
  // De PWA-updateproef vervangt tijdelijk dezelfde dist/service-workerbestanden als de andere
  // productieproeven gebruiken. Serieel draaien voorkomt cross-test reloads en houdt de audit zuiver.
  workers: 1,
  projects: [
    { name: "chromium-tablet", use: { browserName: "chromium" } },
    { name: "webkit-tablet", use: { browserName: "webkit" } },
  ],
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    url: "http://127.0.0.1:4173",
  },
});
