import { test, expect } from "../fixtures/test-fixtures";
import { publications } from "../../src/data/publications";
import { publicationAuthors, publicationPath, publicationUrl } from "../../src/lib/publications";
import { freshCitationCount } from "../../src/lib/scholar-freshness";
import { publicationDescription } from "../../src/lib/publication-abstracts";

test("Scholar pages include complete source abstracts and distinguish summaries", async ({ page }) => {
  await page.goto("/publications/kautz-etal-2010/");
  await expect(page.getByRole("heading", { name: "Abstract", exact: true })).toBeVisible();
  await expect(page.locator("article")).toContainText("benefits for elderly people in Africa.");
  await page.goto("/publications/milkman-etal-2021/");
  await expect(page.locator("article")).toContainText("Only 8% of interventions");
  await expect(page.locator("article")).toContainText("evidentiary value of behavioural science.");
  await page.goto("/publications/kautz-cole-2017/");
  await expect(page.getByRole("heading", { name: "Summary", exact: true })).toBeVisible();
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(schema.abstract).toBeUndefined();
});

test("every publication is complete and correctly identified without JavaScript", async ({ browser, baseURL }) => {
  test.setTimeout(90_000);
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  await context.route(/https:\/\//, route => route.abort());
  const page = await context.newPage();
  for (const pub of publications) {
    const response = await page.goto(publicationPath(pub));
    expect(response?.status(), pub.id).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(pub.title);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", publicationUrl(pub));
    await expect(page.locator('meta[name="citation_title"]')).toHaveAttribute("content", pub.title);
    const authors = await page.locator(`meta[name="${pub.type === "edited-volume" ? "citation_editor" : "citation_author"}"]`).evaluateAll(nodes => nodes.map(node => node.getAttribute("content")));
    expect(authors).toEqual(publicationAuthors(pub));
    await expect(page.locator('meta[name="citation_journal_title"]')).toHaveCount(pub.type === "journal" ? 1 : 0);
    const description = publicationDescription(pub);
    if (description) await expect(page.getByText(description, { exact: true })).toBeVisible();
    if (pub.pdfUrl) await expect(page.getByRole("link", { name: "PDF", exact: true })).toHaveAttribute("href", pub.pdfUrl);
  }
  await context.close();
});

test("main pages contain route-specific content without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  await context.route(/https:\/\//, route => route.abort());
  const page = await context.newPage();
  for (const [path, heading] of [["/", "Tim Kautz"], ["/research/", "Research"], ["/cv/", "Curriculum Vitae"], ["/contact/", "Get in Touch"]]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  }
  await context.close();
});

test("publication navigation hydrates cleanly, updates metadata and moves focus", async ({ page, consoleErrors }) => {
  await page.goto("/research/");
  await page.getByRole("heading", { level: 3 }).first().getByRole("link").click();
  await expect(page).toHaveURL(/\/publications\/kautz-zanoni-2024\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('meta[name="citation_author"]')).toHaveCount(2);
  await page.getByRole("link", { name: "All publications" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Research");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.locator('meta[name="citation_title"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://timkautz.org/research/");
  expect(consoleErrors).toEqual([]);
});

test("topic and abstract search survive reload, history and clear", async ({ page, consoleErrors }) => {
  await page.goto("/research/");
  const search = page.getByRole("searchbox", { name: "Search publications" });
  await search.fill("college enrollment");
  await expect(page.locator("#pub-kautz-zanoni-2024")).toBeVisible();
  await search.fill("SEL");
  await expect(page.locator("#pub-kautz-etal-2021-survey")).toBeVisible();
  await page.getByRole("combobox", { name: "Filter by topic" }).click();
  await page.getByRole("option", { name: "Education", exact: true }).click();
  await expect(page).toHaveURL(/topic=education/);
  await page.reload();
  await expect(search).toHaveValue("SEL");
  await expect(page.getByRole("combobox", { name: "Filter by topic" })).toHaveText("Education");
  await page.goBack();
  await expect(page.getByRole("combobox", { name: "Filter by topic" })).toHaveText("All Topics");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");
  await expect(page.getByRole("status").filter({ hasText: "Showing" })).toHaveText("Showing 39 of 39 publications");
  expect(consoleErrors).toEqual([]);
});

test("long abstracts fit at 320px and double text size", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/research/");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  const card = page.locator("#pub-heckman-jagelka-kautz-2021");
  const abstract = card.locator("#abstract-heckman-jagelka-kautz-2021");
  await expect(abstract).toBeHidden();
  await card.getByRole("button", { name: "Show abstract" }).click();
  await expect(abstract).toBeVisible();
  expect(await abstract.evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
  const overflow = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth - innerWidth,
    elements: [...document.querySelectorAll("body *")].filter(el => el.getBoundingClientRect().right > innerWidth + 1)
      .slice(0, 12).map(el => `${el.tagName}.${el.className}`),
  }));
  expect(overflow.width, JSON.stringify(overflow.elements)).toBeLessThanOrEqual(1);
});

test("CV jump target clears the header and keeps focus", async ({ page }) => {
  await page.goto("/cv/");
  await page.getByRole("button", { name: "Education", exact: true }).first().click();
  await expect(page.locator("#education")).toBeFocused();
  await expect.poll(async () => {
    const target = await page.locator("#education h2").boundingBox();
    const header = await page.locator("header").boundingBox();
    return target!.y - (header!.y + header!.height);
  }).toBeGreaterThanOrEqual(0);
});

test("mobile research jump transfers focus after the menu closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/research/");
  await page.getByRole("button", { name: /Jump to:/ }).click();
  await page.getByRole("menuitem", { name: /Policy Reports/ }).click();
  await expect(page.locator("#section-report")).toBeFocused();
});

test("mobile primary actions precede portrait and affiliations in visual and tab order", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const cta = page.getByRole("link", { name: "View My Research" });
  const portrait = page.getByRole("img", { name: "Portrait of Tim Kautz" });
  expect((await cta.boundingBox())!.y).toBeLessThan(500);
  expect((await cta.boundingBox())!.y).toBeLessThan((await portrait.boundingBox())!.y);
  await page.getByRole("link", { name: "Mathematica", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(cta).toBeFocused();
});

test("clipboard failure offers a selectable fallback and accessible notification", async ({ page, makeAxe, consoleErrors }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) }, configurable: true });
  });
  await page.goto("/publications/kautz-zanoni-2024/");
  await page.getByRole("button", { name: "Cite", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Copy manually" })).toHaveValue(/Kautz, Tim/);
  await expect(page.getByRole("button", { name: "Dismiss notification" })).toBeVisible();
  // Radix's two hidden focus proxies redirect keyboard focus into the toast;
  // they are not controls. Prove that behavior before excluding these exact
  // proxy nodes from axe's static aria-hidden-focus check (no rule disabled).
  const proxySelector = 'span[aria-hidden="true"][tabindex="0"]:has(+ [data-toast-viewport]), [data-toast-viewport] + span[aria-hidden="true"][tabindex="0"]';
  const proxies = page.locator(proxySelector);
  await expect(proxies).toHaveCount(2);
  for (const proxy of await proxies.all()) {
    await page.getByRole("button", { name: "Cite", exact: true }).focus();
    // Locator.focus() calls native focus twice, unlike a keyboard entry. Its
    // second call deliberately exits Radix's viewport; use one real focus.
    await proxy.evaluate((element: HTMLElement) => element.focus());
    await expect.poll(() => page.locator("[data-toast-viewport]").evaluate(viewport => viewport.contains(document.activeElement))).toBe(true);
  }
  expect((await makeAxe(page).exclude(proxySelector).analyze()).violations).toEqual([]);
  await page.keyboard.press("F8");
  await expect(page.locator("[data-toast-viewport]")).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Dismiss notification" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Dismiss notification" })).toBeHidden();
  expect(consoleErrors).toEqual([]);
});

test("Scholar freshness boundary rejects stale, invalid and future verification", () => {
  const now = Date.parse("2026-09-19T00:00:00Z");
  expect(freshCitationCount({ citations: 9750, fetchedAt: "2026-08-20" }, now)).toBe(9750);
  for (const fetchedAt of ["2026-08-19", "2026-09-20", "2026-02-30", "bad", undefined]) {
    expect(freshCitationCount({ citations: 9750, fetchedAt }, now)).toBeNull();
  }
  for (const citations of [-1, 0, 1.5, "9750", NaN, Infinity]) {
    expect(freshCitationCount({ citations, fetchedAt: "2026-09-19" }, now)).toBeNull();
  }
});

test("static HTML remains safe after a calendar-year change", async ({ page, consoleErrors }) => {
  await page.clock.setFixedTime(new Date("2030-01-02T12:00:00Z"));
  await page.goto("/");
  await expect(page.locator("footer")).toContainText("2030");
  await expect(page.getByRole("link", { name: /Google Scholar.*citations/ })).toHaveCount(0);
  expect(consoleErrors).toEqual([]);
});

test("author metadata preserves complete names and excludes omission markers", () => {
  expect(publicationAuthors(publications.find(pub => pub.id === "kautz-zanoni-2024")!)).toEqual(["Tim Kautz", "Wladimir Zanoni"]);
  expect(publicationAuthors(publications.find(pub => pub.id === "feng-etal-2024")!)).toEqual(["Shuaizhang Feng", "Yu Gan", "Yujie Han", "Tim Kautz"]);
  for (const pub of publications) {
    const authors = publicationAuthors(pub);
    expect(authors).toContain("Tim Kautz");
    expect(authors.every(name => name.includes(" ") && !/[,*]|\.\.\.|Editors|^and\b/.test(name))).toBe(true);
  }
});
