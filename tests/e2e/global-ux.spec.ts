import { test, expect } from "../fixtures/test-fixtures";
import { routes } from "../fixtures/selectors";

test.describe("global UX", () => {
  test("scroll-to-top FAB appears after scrolling and returns to top", async ({ page }) => {
    await page.goto(routes.research);
    // Wait for the mount-time ScrollToTopOnNavigate reset to settle, otherwise it
    // races our scroll back to 0.
    await page.waitForLoadState("networkidle");
    const fab = page.getByRole("button", { name: /Scroll to top/i });
    await expect(fab).toBeHidden();
    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" as ScrollBehavior }));
    await expect(fab).toBeVisible();
    await fab.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });

  test("scroll position resets on navigation", async ({ page, isMobile }) => {
    await page.goto(routes.research);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" as ScrollBehavior }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);

    if (isMobile) {
      await page.getByRole("button", { name: "Toggle menu" }).click();
      await page.getByRole("dialog").getByRole("link", { name: "CV" }).click();
    } else {
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "CV" })
        .click();
    }
    await expect(page).toHaveURL(/\/cv$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });

  test("skip-to-content link is reachable and focuses main", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard tab order");
    await page.goto(routes.home);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /Skip to main content/i });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect.poll(() =>
      page.evaluate(() => document.activeElement?.id),
    ).toBe("main-content");
  });

  test("404: unknown route renders the NotFound page", async ({ page }) => {
    await page.goto(routes.notFound);
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Page not found/i })).toBeVisible();
    await page.getByRole("link", { name: /Back to home/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("404 on a deep nested path also works", async ({ page }) => {
    await page.goto("/research/nope/deep");
    await expect(page.getByText("404")).toBeVisible();
  });

  test("back/forward navigation restores pages correctly", async ({ page }) => {
    await page.goto(routes.home);
    await page.goto(routes.research);
    await page.goto(routes.cv);
    await page.goBack();
    await expect(page).toHaveURL(/\/research$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/research$/);
  });

  test("no horizontal overflow at 320px width", async ({ page, isMobile }) => {
    test.skip(isMobile, "run width sweep on desktop project");
    await page.setViewportSize({ width: 320, height: 800 });
    for (const path of [routes.home, routes.research, routes.cv, routes.contact]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(1);
    }
  });

  test("ultrawide viewport keeps content centered/capped", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop project only");
    await page.setViewportSize({ width: 2560, height: 1080 });
    await page.goto(routes.home);
    await expect(page.locator("#main-content")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("core interactions still function with reduced motion", async ({ page }) => {
    await page.goto(routes.cv);
    // Scope to a CV section header (the hidden mobile menu toggle also carries
    // aria-expanded, so `.first()` alone could grab the wrong element).
    const section = page.locator("button[aria-expanded]").filter({ hasText: "Current Position" });
    await section.click();
    await expect(section).toHaveAttribute("aria-expanded", "false");
  });
});
