import { test, expect } from "../fixtures/test-fixtures";
import { routes } from "../fixtures/selectors";
import { seedTheme } from "../utils/theme";

const pages = [
  { name: "home", path: routes.home },
  { name: "research", path: routes.research },
  { name: "cv", path: routes.cv },
  { name: "contact", path: routes.contact },
];

test.describe("accessibility (axe WCAG 2a/2aa)", () => {
  // Scan with reduced motion so framer-motion renders final (at-rest) colors
  // immediately. Otherwise the scan can catch cards mid fade-in and report
  // transient, blended color-contrast values that don't reflect the real UI.
  test.use({ reducedMotion: "reduce" });

  for (const { name, path } of pages) {
    for (const theme of ["light", "dark"] as const) {
      test(`${name} has no violations (${theme})`, async ({ page, makeAxe }, testInfo) => {
        if (theme === "dark") await seedTheme(page, "dark");
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const results = await makeAxe(page).analyze();
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
    const drawer = page.getByRole("dialog", { name: "Mobile navigation" });
    await expect(drawer).toBeVisible();
    // Wait for the slide-in spring to settle (translateX ~0) so axe measures the
    // final colors, not blended values from the in-flight transform.
    await expect
      .poll(() =>
        drawer.evaluate((el) => {
          const t = getComputedStyle(el).transform;
          if (t === "none") return 0;
          const m = t.match(/matrix\(([^)]+)\)/);
          return m ? Math.abs(Number(m[1].split(",")[4]) || 0) : 0;
        }),
      )
      .toBeLessThan(1);
    const results = await makeAxe(page).analyze();
    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
});
