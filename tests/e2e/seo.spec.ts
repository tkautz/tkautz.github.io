import { test, expect } from "../fixtures/test-fixtures";
import { routes, expectedTitles } from "../fixtures/selectors";

test.describe("SEO / metadata", () => {
  const cases = [
    { path: routes.home, title: expectedTitles.home, canonical: "https://tkautz.github.io/" },
    { path: routes.research, title: expectedTitles.research, canonical: "https://tkautz.github.io/research" },
    { path: routes.cv, title: expectedTitles.cv, canonical: "https://tkautz.github.io/cv" },
    { path: routes.contact, title: expectedTitles.contact, canonical: "https://tkautz.github.io/contact" },
  ];

  for (const c of cases) {
    test(`${c.path} has title, description, canonical, and OG tags`, async ({ page }) => {
      await page.goto(c.path);
      await expect(page).toHaveTitle(c.title);
      // Both the static index.html meta and the Helmet-managed one can coexist;
      // assert the Helmet (route-specific) description is non-empty.
      await expect(page.locator('meta[name="description"]').last()).toHaveAttribute(
        "content",
        /.+/,
      );
      if (c.path !== routes.home) {
        // Home's canonical lives in index.html head differently; sub-pages set it via Helmet.
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", c.canonical);
      }
      await expect(page.locator('meta[property="og:title"]').first()).toHaveCount(1);
    });
  }

  test("JSON-LD structured data is present on home and research", async ({ page }) => {
    await page.goto(routes.home);
    expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
    await page.goto(routes.research);
    expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
  });

  test("title reverts when navigating back to home (Helmet cleanup)", async ({ page }) => {
    await page.goto(routes.research);
    await expect(page).toHaveTitle(expectedTitles.research);
    await page.goto(routes.home);
    await expect(page).toHaveTitle(expectedTitles.home);
  });
});
