import { test, expect } from "../fixtures/test-fixtures";
import { routes } from "../fixtures/selectors";

test.describe("footer", () => {
  test("social links have safe external attributes", async ({ page }) => {
    await page.goto(routes.home);
    const social = page.getByRole("navigation", { name: "Social links" });

    const linkedin = social.getByRole("link", { name: /LinkedIn/i });
    await expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/in/tkautz");
    await expect(linkedin).toHaveAttribute("target", "_blank");
    await expect(linkedin).toHaveAttribute("rel", /noopener/);

    await expect(social.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      /^mailto:/,
    );
  });

  test("footer nav routes within the SPA", async ({ page }) => {
    await page.goto(routes.home);
    await page
      .getByRole("navigation", { name: "Footer navigation" })
      .getByRole("link", { name: "CV" })
      .click();
    await expect(page).toHaveURL(/\/cv$/);
  });

  test("copyright shows the current year dynamically", async ({ page }) => {
    await page.goto(routes.home);
    const year = new Date().getFullYear().toString();
    await expect(page.getByText(new RegExp(`©\\s*${year}\\s*Tim Kautz`))).toBeVisible();
  });

  test("tooltip appears on hover (desktop)", async ({ page, isMobile }) => {
    test.skip(isMobile, "hover tooltips are a pointer interaction");
    await page.goto(routes.home);
    const linkedin = page
      .getByRole("navigation", { name: "Social links" })
      .getByRole("link", { name: /LinkedIn/i });
    await linkedin.hover();
    await expect(page.getByRole("tooltip", { name: /LinkedIn/i })).toBeVisible();
  });
});
