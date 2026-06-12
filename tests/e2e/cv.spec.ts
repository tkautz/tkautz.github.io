import { test, expect, type Page } from "../fixtures/test-fixtures";
import { routes } from "../fixtures/selectors";

// Section headers carry aria-expanded; quick-nav buttons do not. Use that to
// disambiguate the two buttons that share an accessible name (e.g. "Education").
const header = (page: Page, name: string | RegExp) =>
  page.locator("button[aria-expanded]").filter({ hasText: name });
const quickNav = (page: Page, name: string | RegExp) =>
  page.locator("button:not([aria-expanded])").filter({ hasText: name });

test.describe("CV page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.cv);
  });

  test("all sections default to open with aria-expanded=true", async ({ page }) => {
    // Auto-retrying assertion so we don't read before the lazy CV chunk renders.
    await expect(page.locator('button[aria-expanded="true"]')).toHaveCount(8);
  });

  test("a section collapses and re-expands, flipping aria-expanded", async ({ page }) => {
    const section = header(page, "Current Position");
    await expect(section).toHaveAttribute("aria-expanded", "true");
    await section.click();
    await expect(section).toHaveAttribute("aria-expanded", "false");
    await section.click();
    await expect(section).toHaveAttribute("aria-expanded", "true");
  });

  test("quick-nav scrolls to the target section", async ({ page }) => {
    await quickNav(page, "Education").click();
    await expect(page.locator("#education")).toBeInViewport({ timeout: 5000 });
  });

  test("Download CV button points at the PDF in a new tab", async ({ page }) => {
    const dl = page.getByRole("link", { name: /Download Full CV/i });
    await expect(dl).toHaveAttribute("href", /\/documents\/TimKautz_CV\.pdf$/);
    await expect(dl).toHaveAttribute("target", "_blank");
  });

  test("adversarial: quick-nav still works when the target is collapsed", async ({ page }) => {
    await header(page, "Education").click();
    await expect(header(page, "Education")).toHaveAttribute("aria-expanded", "false");
    await quickNav(page, "Education").click();
    await expect(page.locator("#education")).toBeInViewport({ timeout: 5000 });
  });

  test("keyboard: a section toggles via Enter", async ({ page, isMobile }) => {
    test.skip(isMobile, "physical keyboard interaction");
    const section = header(page, "Skills");
    await section.focus();
    await page.keyboard.press("Enter");
    await expect(section).toHaveAttribute("aria-expanded", "false");
  });
});
