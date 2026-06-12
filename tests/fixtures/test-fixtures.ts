import { test as base, expect, type Page, type Route } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { formsubmitGlob } from "./selectors";

/**
 * Records every request that reached the (mocked) formsubmit endpoint so specs
 * can assert the payload and the request count (e.g. double-submit guard).
 */
export type FormSubmitRecorder = {
  requests: Array<Record<string, unknown>>;
  /** Configure the mock response for subsequent submits. */
  setMode: (mode: "ok" | "error" | "offline") => void;
};

type Fixtures = {
  formSubmit: FormSubmitRecorder;
  makeAxe: (page: Page) => AxeBuilder;
  consoleErrors: string[];
};

export const test = base.extend<Fixtures>({
  /**
   * formsubmit.co is mocked for EVERY test by default (belt-and-suspenders so a
   * real email can never be sent from CI). Tests tune the response via setMode.
   */
  formSubmit: async ({ context }, use) => {
    const recorder: FormSubmitRecorder = {
      requests: [],
      setMode: (m) => {
        mode = m;
      },
    };
    let mode: "ok" | "error" | "offline" = "ok";

    await context.route(formsubmitGlob, async (route: Route) => {
      try {
        recorder.requests.push(route.request().postDataJSON());
      } catch {
        recorder.requests.push({});
      }
      if (mode === "offline") return route.abort("failed");
      await route.fulfill({
        status: mode === "ok" ? 200 : 500,
        contentType: "application/json",
        body: JSON.stringify({ success: mode === "ok" ? "true" : "false" }),
      });
    });

    await use(recorder);
  },

  /**
   * Collects genuine JavaScript errors for "no crash" assertions. Network /
   * resource-load failures (e.g. the Google Fonts CDN being unreachable in this
   * sandbox) are intentionally ignored — they are environment noise, not app bugs.
   */
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    const isResourceNoise = (t: string) =>
      /Failed to load resource|ERR_CERT|net::ERR|favicon|fonts\.g(oogleapis|static)/i.test(t);
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isResourceNoise(msg.text())) errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));
    await use(errors);
  },

  makeAxe: async ({}, use) => {
    await use((page: Page) =>
      new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]),
    );
  },
});

export { expect };
