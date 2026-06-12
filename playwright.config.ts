import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the UX stress-test suite.
 *
 * We test the BUILT + previewed artifact (not `vite dev`) because the
 * GitHub Pages deep-link / 404 behavior only exists after `npm run build`
 * runs scripts/postbuild-pages.mjs. The app deploys at the domain root
 * (no Vite `base`), so `vite preview` at `/` matches production.
 */
const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  // Only the chromium build is provisioned in this environment (the
  // cdn.playwright.dev egress needed for Firefox/WebKit downloads is blocked),
  // so both projects run on chromium: one desktop, one mobile emulation.
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
});
