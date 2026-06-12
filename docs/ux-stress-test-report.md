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
| Medium   | 4     | Fixed |
| Low      | 2     | Fixed |
| Info     | 1     | Deferred (env-limited) |

All functional and accessibility findings are fixed; the only open item is an
optional Lighthouse performance pass that can't run in this sandbox.

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

### [MEDIUM] Brand color contrast failed WCAG AA — _Fixed_
- **Area:** Affiliation links + publication type badges + TOC counts (Home, Research),
  both themes.
- **Detail (at rest):** The dark-mode primary `#5c85d6` measured **4.0–4.49:1** on dark
  card/badge backgrounds; one dark type badge (`bg-muted text-muted-foreground`) sat at
  **4.47:1**; the desktop TOC count used `opacity-60` (down to **2.74:1**); and the hero
  affiliation link was distinguished from body text by color only (`link-in-text-block`,
  ~1.18:1). All just under the AA thresholds.
- **Important nuance:** the *first* scan reported far more "failures" — those were
  **transient**, caught while research cards and the mobile drawer were mid fade/slide-in
  (blended colors). Re-scanning at rest (reduced motion / settled animation) isolated the
  real issues above. The a11y suite now scans with `reducedMotion: "reduce"` and waits for
  the drawer's slide to settle, so it measures real colors deterministically.
- **Fix:**
  - `src/index.css` — dark `--primary` `60% → 68%` lightness (and matching `--ring`);
    dark `--muted-foreground` `60% → 64%`.
  - `src/components/home/HeroSection.tsx` — inline affiliation link is now always
    underlined (not just on hover).
  - `src/pages/Research.tsx` — desktop TOC count uses `text-muted-foreground` instead of
    `opacity-60`.
- **Result:** axe `color-contrast` and `link-in-text-block` are **re-enabled and enforced**
  across all pages × both themes (plus the open mobile drawer) with zero violations.

---

## Deferred (reported, not changed)

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
