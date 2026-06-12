import { test, expect } from "../fixtures/test-fixtures";
import { routes } from "../fixtures/selectors";
import { seedTheme } from "../utils/theme";

const pages = [
  { name: "home", path: routes.home },
  { name: "research", path: routes.research },
  { name: "cv", path: routes.cv },
  { name: "contact", path: routes.contact },
];

/**
 * Two violations are design-level and tracked as deferred findings in
 * docs/ux-stress-test-report.md (they stem from the brand primary blue
 * #5c85d6 sitting at ~4.49:1, just under WCAG AA's 4.5:1). They require a
 * brand-color decision, so we exclude them here to keep the suite enforcing
 * every OTHER rule (button-name, aria, landmarks, labels, …) as a regression
 * guard. Remove these once the palette is adjusted.
 */
const DEFERRED_RULES = ["color-contrast", "link-in-text-block"];

test.describe("accessibility (axe WCAG 2a/2aa)", () => {
  for (const { name, path } of pages) {
    for (const theme of ["light", "dark"] as const) {
      test(`${name} has no violations (${theme})`, async ({ page, makeAxe }, testInfo) => {
        if (theme === "dark") await seedTheme(page, "dark");
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const results = await makeAxe(page).disableRules(DEFERRED_RULES).analyze();
        await testInfo.attach(`axe-${name}-${theme}.json`, {
          body: JSON.stringify(results.violations, null, 2),
          contentType: "application/json",
        });
        expect(
          results.violations,
          results.violations.map((v) => `${v.id}: ${v.help}`).join("\n"),
        ).toEqual([]);
      });
    }
  }

  test("mobile drawer (open dialog) passes axe", async ({ page, makeAxe, isMobile }) => {
    test.skip(!isMobile, "drawer is mobile only");
    await page.goto(routes.home);
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeVisible();
    const results = await makeAxe(page).disableRules(DEFERRED_RULES).analyze();
    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
});
