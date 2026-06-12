# UX Stress-Test Report — tkautz.github.io

- **Date:** 2026-06-12
- **Base commit:** `5e54410` (branch `claude/website-ux-stress-test-8qmazl`)
- **Target:** local production build (`npm run build` + `vite preview`, `http://localhost:4173`)
- **Tooling:** Playwright `@playwright/test` 1.56 + `@axe-core/playwright` (WCAG 2a/2aa)
- **Browsers exercised:** Chromium (desktop, 1280×720) and Chromium mobile emulation
  (Pixel 7, 412×915). _Firefox/WebKit not covered — their browser binaries cannot be
  downloaded in this environment (the `cdn.playwright.dev` egress is blocked)._
- **Suite size:** 82 specs × 2 projects → **149 passing, 0 failing** (15 project-specific skips).

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| High     | 1     | Fixed |
| Medium   | 4     | 3 fixed, 1 deferred (×2 rules) |
| Low      | 2     | Fixed |
| Info     | 1     | Deferred (env-limited) |

Exploratory + scripted adversarial testing hammered every interactive feature
(theme, mobile drawer, search/filters, research cards, clipboard, hash deep-links,
CV accordion, contact form, scroll behaviors, SEO, a11y). The app held up well:
no crashes, no XSS execution, no unhandled rejections after fixes, and no layout
overflow at 320px. The findings below are the issues uncovered; clear/low-risk
ones were fixed on this branch and locked in with regression specs.

---

## Findings

### [HIGH] Mobile navigation drawer was not an accessible modal — _Fixed_
- **Area:** Header / mobile nav · **Env:** mobile-chrome 412px, both themes
- **Repro:** Open the hamburger drawer → press `Tab` repeatedly / press `Escape`.
- **Expected:** Escape closes it; focus is trapped inside while open; focus returns
  to the toggle on close; assistive tech announces a modal dialog.
- **Actual:** The drawer was a bare `<nav>` (`aria-label` only) — no `role="dialog"`,
  no `aria-modal`, no Escape handler, no focus trap, no focus restoration. Keyboard
  focus could leak to the page behind the backdrop, and screen-reader users were not
  told a modal had opened.
- **Fix:** `src/components/layout/Header.tsx` — added `role="dialog"` + `aria-modal`,
  `aria-haspopup="dialog"` on the toggle, an Escape-to-close + Tab focus-trap effect,
  focus move into the panel on open, and focus return to the toggle on close.
- **Regression specs:** `tests/e2e/header-nav.spec.ts` (Escape closes + restores focus,
  focus moves into drawer, scroll-lock never sticks under rapid spam) and the
  mobile-drawer axe scan in `tests/a11y/accessibility.spec.ts`.

### [MEDIUM] Clipboard copy could throw an unhandled rejection — _Fixed_
- **Area:** ResearchCard (Cite / Share) · **Env:** any browser denying clipboard
- **Repro:** In a context without clipboard permission, click **Cite** or **Share**.
- **Expected:** Graceful messaging, no console error.
- **Actual:** `navigator.clipboard.writeText(...)` was fire-and-forget; a denied or
  unavailable Clipboard API rejected the promise with nothing to catch it.
- **Fix:** `src/components/research/ResearchCard.tsx` — wrapped both handlers in a
  `copyToClipboard` helper with `try/catch`; on failure a destructive “Couldn't copy”
  toast is shown instead of crashing.
- **Regression spec:** `tests/e2e/research-card.spec.ts` → "clipboard denial still
  toasts and never throws".

### [MEDIUM] Year-filter Select had no accessible name (axe `button-name`) — _Fixed_
- **Area:** Research filters · **Env:** /research, both themes
- **Actual:** The Radix `Select` trigger (`role="combobox"`) exposed no accessible
  name to axe → WCAG `button-name` violation.
- **Fix:** `src/pages/Research.tsx` — added `aria-label="Filter by year"` to the
  `SelectTrigger`.
- **Regression spec:** axe scans in `tests/a11y/accessibility.spec.ts` (research,
  light + dark) now pass.

### [LOW] Abstract toggle lacked expanded-state semantics — _Fixed_
- **Area:** ResearchCard · **Fix:** added `aria-expanded` + `aria-controls` to the
  Show/Hide-abstract button and an `id` on the abstract panel
  (`src/components/research/ResearchCard.tsx`).
- **Regression spec:** `tests/e2e/research-card.spec.ts` (abstract aria state).

### [LOW] Search ignored surrounding whitespace — _Fixed_
- **Area:** Research search · **Repro:** Search `"  Heckman  "` → 0 results.
- **Fix:** `src/pages/Research.tsx` — `searchQuery.toLowerCase().trim()`.
- **Regression spec:** `tests/e2e/research-filters.spec.ts` (case/whitespace match).

---

## Deferred (reported, not changed)

### [MEDIUM] Brand primary color fails WCAG AA contrast — _Deferred (design decision)_
- **Area:** Links / accents on Home and Research, **both light and dark**.
- **Detail:** The primary blue `#5c85d6` measures **~4.49:1** on light backgrounds and
  as low as **4.0:1** for 12px text — just under the 4.5:1 AA threshold (axe
  `color-contrast`, ~36–44 nodes on /research). On Home, inline links are also
  distinguishable only by color (axe `link-in-text-block`).
- **Why deferred:** Darkening the primary token or underlining inline links is a
  site-wide brand/visual change, not a localized bug fix — it warrants an owner
  decision. **Recommendation:** nudge `--primary` darker (≈`#4a6fc0` or lower) until
  body-size text clears 4.5:1, and add an underline to inline text links.
- **Suite handling:** `tests/a11y/accessibility.spec.ts` disables exactly these two
  rules (`color-contrast`, `link-in-text-block`) via a documented `DEFERRED_RULES`
  list so the scan still enforces every other WCAG rule as a regression guard.
  Re-enable once the palette is adjusted.

### [INFO] Lighthouse performance pass not run — _Deferred (environment)_
- A one-shot Lighthouse audit was planned but not run: installing/launching it needs
  network egress that's restricted here. **Recommendation:** run `npx lighthouse`
  against the preview build locally; likely items are hero-image LCP and the
  render-blocking Google Fonts stylesheet.

---

## Verified working (no issues found)

- **Theme:** toggle ⇄ localStorage sync, persistence across reload with no light-flash
  (pre-paint inline script), `prefers-color-scheme` honored, explicit stored theme
  wins over OS, corrupt `localStorage.theme` doesn't crash, 20× toggle-spam stays in sync.
- **Search (adversarial):** regex metacharacters treated literally, `<img onerror>`/
  `<script>` rendered as text (no dialog, no injected node), emoji + 5,000-char input
  don't hang, keyword-only matches work.
- **Contact form:** mocked submit sends the exact `{name,email,_subject,message}`
  payload; required-field + email validation block empty/invalid submits with no
  network call; server-error and offline both surface a destructive toast and re-enable
  the form; XSS-ish values sent verbatim and never rendered as HTML; **double-submit
  fires only one request** (disabled-while-sending guard holds); success → reset works.
  _All traffic to `formsubmit.co` is intercepted — no real email can be sent._
- **Hash deep-linking:** `/research#pub-…` scrolls + transient highlight that clears;
  nonexistent/empty hash is a safe no-op; back/forward leaves no stuck highlight;
  every Home featured card resolves to a real publication id.
- **CV:** all 8 sections default open with correct `aria-expanded`; collapse/expand,
  quick-nav (even to collapsed sections), and keyboard (Enter) all work.
- **Research TOC:** desktop sticky sidebar scroll-spy marks exactly one active section;
  mobile dropdown selects + closes.
- **Global:** 404 renders for unknown + deep nested routes; scroll resets on navigation;
  scroll-to-top FAB appears past threshold and returns to top; skip-to-content link is
  keyboard-reachable and focuses `#main-content`; **no horizontal overflow at 320px**;
  content stays centered/capped at 2560px; reduced-motion interactions still function.
- **SEO:** correct `<title>`, description, canonical, OG/Twitter tags, and JSON-LD per
  route; Helmet titles revert correctly on back-navigation.

---

## How to run

```bash
npm run test:install   # one-time: fetch browser binaries (needs network)
npm run test           # full suite (chromium + mobile-chrome)
npm run test:a11y      # accessibility scans only
npm run test:report    # open the HTML report (traces/screenshots on failure)
```
