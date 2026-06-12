import { test, expect } from "../fixtures/test-fixtures";
import { routes } from "../fixtures/selectors";

test.describe("header navigation", () => {
  test.describe("desktop", () => {
    test.skip(({ isMobile }) => isMobile, "desktop nav only");

    test("nav links route and mark the active page", async ({ page }) => {
      await page.goto(routes.home);
      const nav = page.getByRole("navigation", { name: "Main navigation" });

      await nav.getByRole("link", { name: "Research" }).click();
      await expect(page).toHaveURL(/\/research$/);
      await expect(nav.getByRole("link", { name: "Research" })).toHaveAttribute(
        "aria-current",
        "page",
      );

      await nav.getByRole("link", { name: "CV" }).click();
      await expect(page).toHaveURL(/\/cv$/);
      await expect(nav.getByRole("link", { name: "Research" })).not.toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    test("header gains scrolled state after scrolling", async ({ page }) => {
      await page.goto(routes.home);
      const header = page.getByRole("banner");
      await expect(header).not.toHaveClass(/shadow-sm/);
      // Make the page tall enough to scroll, then scroll past the 20px threshold.
      await page.mouse.wheel(0, 200);
      await expect(header).toHaveClass(/shadow-sm/);
    });
  });

  test.describe("mobile drawer", () => {
    test.skip(({ isMobile }) => !isMobile, "mobile menu only");

    test("opens, locks body scroll, and closes via link (route change)", async ({ page }) => {
      await page.goto(routes.home);
      await page.getByRole("button", { name: "Toggle menu" }).click();

      const drawer = page.getByRole("dialog", { name: "Mobile navigation" });
      await expect(drawer).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");

      await drawer.getByRole("link", { name: "Contact" }).click();
      await expect(page).toHaveURL(/\/contact$/);
      await expect(drawer).toBeHidden();
      await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
    });

    test("backdrop click closes the drawer", async ({ page }) => {
      await page.goto(routes.home);
      await page.getByRole("button", { name: "Toggle menu" }).click();
      const drawer = page.getByRole("dialog", { name: "Mobile navigation" });
      await expect(drawer).toBeVisible();
      // Backdrop covers the left side of the screen (drawer is 288px on the right).
      await page.mouse.click(20, 300);
      await expect(drawer).toBeHidden();
    });

    test("Escape closes the drawer and restores focus to the toggle (fixed)", async ({ page }) => {
      await page.goto(routes.home);
      const toggle = page.getByRole("button", { name: "Toggle menu" });
      await toggle.click();
      const drawer = page.getByRole("dialog", { name: "Mobile navigation" });
      await expect(drawer).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(drawer).toBeHidden();
      await expect(toggle).toBeFocused();
    });

    test("focus moves into the drawer on open (fixed)", async ({ page }) => {
      await page.goto(routes.home);
      await page.getByRole("button", { name: "Toggle menu" }).click();
      const drawer = page.getByRole("dialog", { name: "Mobile navigation" });
      await expect(drawer).toBeVisible();
      // Some element inside the drawer should hold focus.
      await expect
        .poll(() => page.evaluate(() => {
          const dlg = document.querySelector('[role="dialog"]');
          return !!dlg && dlg.contains(document.activeElement);
        }))
        .toBe(true);
    });

    test("adversarial: rapid open/close spam never leaves body scroll-locked", async ({ page }) => {
      await page.goto(routes.home);
      const toggle = page.getByRole("button", { name: "Toggle menu" });
      for (let i = 0; i < 12; i++) {
        await toggle.click({ force: true });
      }
      // Whatever the final state, settle it closed and assert no stuck lock.
      if (await page.getByRole("dialog", { name: "Mobile navigation" }).isVisible()) {
        await page.keyboard.press("Escape");
      }
      await expect
        .poll(() => page.evaluate(() => document.body.style.overflow))
        .toBe("");
    });
  });
});
