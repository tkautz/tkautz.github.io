import { test, expect } from "../fixtures/test-fixtures";
import { routes, expectedTitles } from "../fixtures/selectors";

test.describe("SEO / metadata", () => {
  const cases = [
    { path: routes.home, title: expectedTitles.home, canonical: "https://timkautz.org/" },
    { path: routes.research, title: expectedTitles.research, canonical: "https://timkautz.org/research" },
    { path: routes.cv, title: expectedTitles.cv, canonical: "https://timkautz.org/cv" },
    { path: routes.contact, title: expectedTitles.contact, canonical: "https://timkautz.org/contact" },
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
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", c.canonical);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", c.canonical);
      await expect(page.locator('meta[property="og:title"]').first()).toHaveCount(1);
    });
  }

  test("JSON-LD structured data is present on home and research", async ({ page }) => {
    await page.goto(routes.home);
    const structuredData = page.locator('script[type="application/ld+json"]');
    // Helmet adds metadata after React renders; wait for it before inspecting it.
    await expect(structuredData).toHaveCount(2);
    for (const json of await structuredData.allTextContents()) {
      expect(JSON.parse(json).url).toBe("https://timkautz.org/");
    }
    await page.goto(routes.research);
    await expect(structuredData).toHaveCount(1);
  });

  test("title reverts when navigating back to home (Helmet cleanup)", async ({ page }) => {
    await page.goto(routes.research);
    await expect(page).toHaveTitle(expectedTitles.research);
    await page.goto(routes.home);
    await expect(page).toHaveTitle(expectedTitles.home);
  });
});
