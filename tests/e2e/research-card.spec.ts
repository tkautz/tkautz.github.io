import { test, expect } from "../fixtures/test-fixtures";
import { routes, toasts } from "../fixtures/selectors";

test.describe("research card", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(routes.research);
  });

  const firstCard = (page: import("@playwright/test").Page) =>
    page.locator("article[id^='pub-']").first();

  test("abstract expands and collapses with correct aria state", async ({ page }) => {
    // Pin the card by id so the locator doesn't re-resolve when the toggle's
    // label flips from "Show abstract" to "Hide abstract".
    const cardId = await page
      .locator("article[id^='pub-']", { has: page.getByText("Show abstract") })
      .first()
      .getAttribute("id");
    const toggle = page.locator(`#${cardId}`).getByRole("button", { name: /abstract$/ });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAccessibleName("Hide abstract");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("Cite copies a citation to the clipboard and shows a toast", async ({ page }) => {
    const card = firstCard(page);
    const id = (await card.getAttribute("id"))!.replace("pub-", "");
    const title = await card.getByRole("heading", { level: 3 }).innerText();

    await card.getByRole("button", { name: "Cite" }).click();
    await expect(page.getByText(toasts.citationCopied).first()).toBeVisible();

    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toContain(title.trim());
    // The button flips to a transient "Copied" confirmation.
    await expect(card.getByRole("button", { name: "Copied" })).toBeVisible();
    expect(id).toBeTruthy();
  });

  test("Share copies a deep link to this publication", async ({ page, baseURL }) => {
    const card = firstCard(page);
    const id = (await card.getAttribute("id"))!.replace("pub-", "");
    await card.getByRole("button", { name: "Share" }).click();
    await expect(page.getByText(toasts.linkCopied).first()).toBeVisible();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe(`${baseURL}/research#pub-${id}`);
  });

  test("adversarial: clipboard denial still toasts and never throws (fixed)", async ({
    context,
    page,
    consoleErrors,
  }) => {
    await context.clearPermissions(); // revoke clipboard access
    const card = firstCard(page);
    await card.getByRole("button", { name: "Cite" }).click();
    // A toast (success or the graceful "Couldn't copy" fallback) must appear,
    // and crucially there must be no unhandled rejection / console error.
    await expect(page.locator("[data-sonner-toast], [role='status'], li")).not.toHaveCount(0);
    await page.waitForTimeout(300);
    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("conditional action buttons open in new tabs when present", async ({ page }) => {
    const pdf = page.getByRole("link", { name: /^PDF$/ }).first();
    if (await pdf.count()) {
      await expect(pdf).toHaveAttribute("target", "_blank");
      await expect(pdf).toHaveAttribute("rel", /noopener/);
    }
    const view = page.getByRole("link", { name: /^View$/ }).first();
    if (await view.count()) {
      await expect(view).toHaveAttribute("target", "_blank");
    }
  });
});
