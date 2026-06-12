import { test, expect } from "../fixtures/test-fixtures";
import { routes } from "../fixtures/selectors";
import { isDark, storedTheme, seedTheme } from "../utils/theme";

test.describe("dark mode", () => {
  const toggleName = /Switch to (light|dark) mode/;

  test("toggles the html class and persists to localStorage", async ({ page }) => {
    await page.goto(routes.home);
    const toggle = page.getByRole("button", { name: toggleName }).first();

    const startedDark = await isDark(page);
    await toggle.click();
    await expect.poll(() => isDark(page)).toBe(!startedDark);
    expect(await storedTheme(page)).toBe(!startedDark ? "dark" : "light");
  });

  test("persists across reload with no flash of the wrong theme", async ({ page }) => {
    await page.goto(routes.home);
    const toggle = page.getByRole("button", { name: toggleName }).first();
    // Force a known dark state.
    if (!(await isDark(page))) await toggle.click();
    await expect.poll(() => isDark(page)).toBe(true);

    await page.reload({ waitUntil: "commit" });
    // The pre-paint inline script must apply `dark` before React mounts.
    await expect.poll(() => isDark(page)).toBe(true);
  });

  test("prefers-color-scheme: dark with no stored theme starts dark", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto(routes.home);
    await expect.poll(() => isDark(page)).toBe(true);
    await context.close();
  });

  test("explicit stored light theme wins over OS dark preference", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await seedTheme(page, "light");
    await page.goto(routes.home);
    await expect.poll(() => isDark(page)).toBe(false);
    await context.close();
  });

  test("adversarial: corrupt localStorage theme does not crash the app", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await seedTheme(page, "{not-valid-json-garbage}");
    await page.goto(routes.home);
    await expect(page.locator("#main-content")).toBeVisible();
    expect(errors, errors.join("\n")).toEqual([]);
    await context.close();
  });

  test("adversarial: rapid toggle spam keeps DOM and localStorage in sync", async ({ page }) => {
    await page.goto(routes.home);
    const toggle = page.getByRole("button", { name: toggleName }).first();
    for (let i = 0; i < 21; i++) await toggle.click();
    // After an odd number of clicks the state must be the opposite of the start
    // AND the DOM class must match the stored value.
    await expect
      .poll(async () => {
        const dom = await isDark(page);
        const stored = (await storedTheme(page)) === "dark";
        return dom === stored;
      })
      .toBe(true);
  });
});
