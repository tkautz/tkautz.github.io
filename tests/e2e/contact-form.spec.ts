import { test, expect, type Page } from "../fixtures/test-fixtures";
import { routes, toasts, formsubmitGlob } from "../fixtures/selectors";

// "Email" also appears as a social link aria-label ("Send me an email"), so
// scope every field lookup to the <form> to avoid strict-mode collisions.
const field = (page: Page, label: string) =>
  page.locator("form").getByLabel(label, { exact: true });

async function fillForm(
  page: Page,
  data: { name?: string; email?: string; subject?: string; message?: string } = {},
) {
  await field(page, "Name").fill(data.name ?? "Ada Lovelace");
  await field(page, "Email").fill(data.email ?? "ada@example.com");
  await field(page, "Subject").fill(data.subject ?? "Collaboration");
  await field(page, "Message").fill(data.message ?? "Hello, let's work together.");
}

test.describe("contact form (network mocked)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.contact);
  });

  test("required validation blocks an empty submit (no request fired)", async ({
    page,
    formSubmit,
  }) => {
    await page.getByRole("button", { name: /Send Message/i }).click();
    // Native required validation must prevent any network call.
    expect(formSubmit.requests).toHaveLength(0);
    await expect(field(page, "Name")).toBeVisible(); // still on the form
  });

  test("invalid email is rejected by the email input", async ({ page, formSubmit }) => {
    await fillForm(page, { email: "not-an-email" });
    await page.getByRole("button", { name: /Send Message/i }).click();
    const valid = await field(page, "Email").evaluate(
      (el) => (el as HTMLInputElement).checkValidity(),
    );
    expect(valid).toBe(false);
    expect(formSubmit.requests).toHaveLength(0);
  });

  test("happy path: submits the right payload and shows the success state", async ({
    page,
    formSubmit,
  }) => {
    formSubmit.setMode("ok");
    await fillForm(page);
    await page.getByRole("button", { name: /Send Message/i }).click();

    await expect(page.getByRole("heading", { name: /Message Sent/i })).toBeVisible();
    await expect(page.getByText(toasts.messageSent).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Send Another Message/i })).toBeVisible();

    expect(formSubmit.requests).toHaveLength(1);
    expect(formSubmit.requests[0]).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@example.com",
      _subject: "Collaboration",
      message: "Hello, let's work together.",
    });

    // Reset returns to a blank form.
    await page.getByRole("button", { name: /Send Another Message/i }).click();
    await expect(field(page, "Name")).toHaveValue("");
  });

  test("server error surfaces a destructive toast and keeps the form", async ({
    page,
    formSubmit,
  }) => {
    formSubmit.setMode("error");
    await fillForm(page);
    await page.getByRole("button", { name: /Send Message/i }).click();
    await expect(page.getByText(toasts.error).first()).toBeVisible();
    await expect(field(page, "Name")).toBeVisible();
    // Button is re-enabled (isSubmitting cleared).
    await expect(page.getByRole("button", { name: /Send Message/i })).toBeEnabled();
  });

  test("offline / aborted request surfaces an error", async ({ page, formSubmit }) => {
    formSubmit.setMode("offline");
    await fillForm(page);
    await page.getByRole("button", { name: /Send Message/i }).click();
    await expect(page.getByText(toasts.error).first()).toBeVisible();
  });

  test("adversarial: XSS-ish field values are sent verbatim, never rendered as HTML", async ({
    page,
    formSubmit,
  }) => {
    const payload = '<script>alert(1)</script>';
    formSubmit.setMode("ok");
    await fillForm(page, { name: payload, message: payload });
    await page.getByRole("button", { name: /Send Message/i }).click();
    await expect(page.getByRole("heading", { name: /Message Sent/i })).toBeVisible();
    expect(formSubmit.requests[0].name).toBe(payload);
    // No script element was injected into the DOM.
    expect(await page.locator("script:has-text('alert(1)')").count()).toBe(0);
  });

  test("adversarial: double-submit fires only one request", async ({ page }) => {
    // Gate the response so the request stays in-flight (button disabled) while we
    // attempt a second click — a deterministic way to prove the guard holds.
    let count = 0;
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    await page.route(formsubmitGlob, async (route) => {
      count += 1;
      await gate;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: "true" }),
      });
    });

    await fillForm(page);
    await page.getByRole("button", { name: /Send Message/i }).click();
    // While submitting, the button relabels to "Sending..." and is disabled.
    const sending = page.getByRole("button", { name: /Sending/i });
    await expect(sending).toBeDisabled(); // guard engaged
    await sending.click({ force: true }).catch(() => {}); // ignored
    release();

    await expect(page.getByRole("heading", { name: /Message Sent/i })).toBeVisible();
    expect(count).toBe(1);
  });
});
