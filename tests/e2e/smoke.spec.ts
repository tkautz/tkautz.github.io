import { test, expect } from "../fixtures/test-fixtures";
import { routes, expectedTitles } from "../fixtures/selectors";

/** Every route loads, sets its title, renders <main>, and logs no console errors. */
test.describe("smoke: routes load cleanly", () => {
  for (const [name, path] of Object.entries(routes).filter(([k]) => k !== "notFound")) {
    test(`${name} (${path}) loads`, async ({ page, consoleErrors }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(expectedTitles[name as keyof typeof expectedTitles]);
      await expect(page.locator("#main-content")).toBeVisible();
      expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
    });
  }

  test("deep-link refresh on /research works (built 404/route fallback)", async ({ page }) => {
    await page.goto(routes.research);
    await page.reload();
    await expect(page).toHaveTitle(expectedTitles.research);
    await expect(page.getByRole("heading", { level: 1, name: "Research" })).toBeVisible();
  });
});
