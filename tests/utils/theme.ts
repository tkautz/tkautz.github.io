import { type Page } from "@playwright/test";

/** True when the <html> element currently has the `dark` class. */
export async function isDark(page: Page): Promise<boolean> {
  return page.evaluate(() => document.documentElement.classList.contains("dark"));
}

/** Read the persisted theme value, or null. */
export async function storedTheme(page: Page): Promise<string | null> {
  return page.evaluate(() => localStorage.getItem("theme"));
}

/** Seed localStorage before the app boots (runs on every navigation). */
export async function seedTheme(page: Page, value: string): Promise<void> {
  await page.addInitScript((v) => {
    localStorage.setItem("theme", v as string);
  }, value);
}
