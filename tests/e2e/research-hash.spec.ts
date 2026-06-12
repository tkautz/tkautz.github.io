import { test, expect } from "../fixtures/test-fixtures";
import { routes, featuredPubIds } from "../fixtures/selectors";

test.describe("research hash deep-linking", () => {
  test("scrolls to the target card and highlights it transiently", async ({ page }) => {
    const id = `pub-${featuredPubIds[0]}`;
    await page.goto(`/research#${id}`);
    const card = page.locator(`#${id}`);
    await expect(card).toBeInViewport({ timeout: 5000 });
    // Highlight ring appears...
    await expect.poll(() => card.getAttribute("class")).toMatch(/ring-2/);
    // ...and is removed after ~2.5s.
    await expect.poll(() => card.getAttribute("class"), { timeout: 5000 }).not.toMatch(/ring-2/);
  });

  test("adversarial: nonexistent hash is a no-op (no crash, no stuck highlight)", async ({
    page,
    consoleErrors,
  }) => {
    await page.goto("/research#pub-this-does-not-exist");
    await expect(page.getByRole("heading", { level: 1, name: "Research" })).toBeVisible();
    expect(await page.locator(".ring-2").count()).toBe(0);
    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("empty hash does nothing", async ({ page, consoleErrors }) => {
    await page.goto(`${routes.research}#`);
    await expect(page.getByRole("heading", { level: 1, name: "Research" })).toBeVisible();
    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("back/forward navigation does not leave a stuck highlight", async ({ page }) => {
    const id = `pub-${featuredPubIds[1]}`;
    await page.goto(routes.research);
    await page.goto(`/research#${id}`);
    await expect(page.locator(`#${id}`)).toBeInViewport();
    await page.goBack();
    await page.goForward();
    // Eventually no lingering highlight remains.
    await expect.poll(() => page.locator(".ring-2").count(), { timeout: 6000 }).toBe(0);
  });
});
