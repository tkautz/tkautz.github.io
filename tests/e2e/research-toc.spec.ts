import { test, expect } from "../fixtures/test-fixtures";
import { routes } from "../fixtures/selectors";

test.describe("research table of contents", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.research);
  });

  test("desktop sticky TOC jumps to a section and scroll-spy activates it", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "sticky sidebar is desktop (lg) only");
    const toc = page.locator("aside nav");
    await expect(toc).toBeVisible();

    // Jump to the Working Papers section (typically near the bottom).
    const entry = toc.getByRole("button", { name: /Working Papers/ });
    if (!(await entry.count())) test.skip(true, "no working-paper section present");
    await entry.click();

    await expect(page.locator("#section-working-paper")).toBeInViewport({ timeout: 5000 });
    // Exactly one TOC entry should be active (bg-primary) once scrolling settles.
    await expect
      .poll(() => page.locator("aside nav button.bg-primary").count(), { timeout: 5000 })
      .toBe(1);
  });

  test("mobile TOC dropdown selects a section and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "dropdown TOC is mobile only");
    const trigger = page.getByRole("button", { name: /Jump to:/ });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    const item = menu.getByRole("menuitem").first();
    const sectionLabel = (await item.innerText()).split("(")[0].trim();
    await item.click();

    await expect(menu).toBeHidden();
    // The trigger now reflects the chosen section.
    await expect(trigger).toContainText(sectionLabel);
  });
});
