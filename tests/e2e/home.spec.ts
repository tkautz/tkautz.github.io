import { test, expect } from "../fixtures/test-fixtures";
import { routes, featuredPubIds } from "../fixtures/selectors";

test.describe("home page", () => {
  test("primary CTA routes to research", async ({ page }) => {
    await page.goto(routes.home);
    await page.getByRole("link", { name: /View My Research/i }).click();
    await expect(page).toHaveURL(/\/research\/?$/);
  });

  test("Download CV opens the PDF in a new tab", async ({ page }) => {
    await page.goto(routes.home);
    const cvLink = page.getByRole("link", { name: /Download CV/i }).first();
    await expect(cvLink).toHaveAttribute("href", /\/documents\/TimKautz_CV\.pdf$/);
    await expect(cvLink).toHaveAttribute("target", "_blank");
  });

  test("featured cards deep-link to existing publications", async ({ page }) => {
    await page.goto(routes.home);
    const hrefs = await page
      .getByRole("link", { name: /.*/ })
      .evaluateAll((els) =>
        els
          .map((e) => (e as HTMLAnchorElement).getAttribute("href") ?? "")
          .filter((h) => h.startsWith("/publications/")),
      );
    expect(hrefs.length).toBeGreaterThan(0);

    // Each featured title/action resolves to a permanent publication page.
    for (const href of new Set(hrefs)) {
      await page.goto(href);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator('meta[name="citation_title"]')).toHaveCount(1);
    }
  });

  test("the known featured ids all render on /research", async ({ page }) => {
    await page.goto(routes.research);
    for (const id of featuredPubIds) {
      await expect(page.locator(`#pub-${id}`)).toHaveCount(1);
    }
  });
});
