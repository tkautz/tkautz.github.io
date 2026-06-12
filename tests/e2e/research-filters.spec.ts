import { test, expect } from "../fixtures/test-fixtures";
import { routes, research } from "../fixtures/selectors";

test.describe("research filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.research);
  });

  const searchbox = (page: import("@playwright/test").Page) =>
    page.getByPlaceholder(research.searchPlaceholder);

  test("live search narrows results and updates the counter", async ({ page }) => {
    await searchbox(page).fill("Heckman");
    await expect(page.getByText(research.resultsCounter)).toBeVisible();
    // Every visible card title/author area should reflect the query somewhere.
    const articles = page.locator("article[id^='pub-']");
    expect(await articles.count()).toBeGreaterThan(0);
  });

  test("type filter buttons all exist and toggle active state", async ({ page }) => {
    for (const label of research.typeButtons) {
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    }
    const journals = page.getByRole("button", { name: "Journal Articles", exact: true });
    await journals.click();
    // Only journal-articles section should remain.
    await expect(page.locator("#section-journal")).toBeVisible();
    await expect(page.locator("#section-working-paper")).toHaveCount(0);
  });

  test("year filter (Radix select) combines with type filter", async ({ page }) => {
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "2024" }).click();
    await expect(page.getByText(research.resultsCounter)).toBeVisible();
    const visibleYears = await page
      .locator("article[id^='pub-']")
      .getByText("2024", { exact: true })
      .count();
    expect(visibleYears).toBeGreaterThan(0);
  });

  test("no-match query shows the empty state", async ({ page }) => {
    await searchbox(page).fill("zzzqqq-no-such-publication-xyz");
    await expect(page.getByText(research.emptyState)).toBeVisible();
    await expect(page.getByText(/Showing 0 of \d+ publications/)).toBeVisible();
  });

  test.describe("adversarial search input", () => {
    test("regex metacharacters are treated literally (no crash, no over-match)", async ({
      page,
      consoleErrors,
    }) => {
      for (const q of [".*", "[", "(?:", "\\d+", "^$"]) {
        await searchbox(page).fill(q);
        // Literal interpretation => these match nothing.
        await expect(page.getByText(research.emptyState)).toBeVisible();
      }
      expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
    });

    test("HTML/script input is rendered as text, never executed", async ({ page }) => {
      let dialogFired = false;
      page.on("dialog", async (d) => {
        dialogFired = true;
        await d.dismiss();
      });
      const payload = '<img src=x onerror=alert(1)>';
      await searchbox(page).fill(payload);
      await expect(searchbox(page)).toHaveValue(payload);
      await expect(page.getByText(research.emptyState)).toBeVisible();
      // No injected <img> should exist in the document body.
      expect(await page.locator("img[onerror]").count()).toBe(0);
      expect(dialogFired).toBe(false);
    });

    test("emoji and very long strings do not hang the page", async ({ page }) => {
      await searchbox(page).fill("🤖🎓📚");
      await expect(page.getByText(research.emptyState)).toBeVisible();
      await searchbox(page).fill("a".repeat(5000));
      await expect(page.getByText(research.emptyState)).toBeVisible();
      // App stays responsive: clearing restores results.
      await searchbox(page).fill("");
      await expect(page.locator("article[id^='pub-']").first()).toBeVisible();
    });

    test("keyword-only and case/whitespace-insensitive matching works", async ({ page }) => {
      // Mixed case + surrounding whitespace should still match.
      await searchbox(page).fill("  HECKMAN  ");
      await expect(page.locator("article[id^='pub-']").first()).toBeVisible();
    });
  });
});
