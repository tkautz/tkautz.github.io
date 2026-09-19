# Publication discovery and mobile release audit — 2026-09-19

## Approved scope and implementation

- Five short topic filters, alongside type/year; search includes existing abstracts, summaries, keywords and common abbreviations. Filter state is shareable and survives reload/history; Clear filters returns focus to search.
- Permanent pages for all 39 publication records, using the existing citation text and 36 available abstracts. Titles and featured links open these pages; Cite/Share remain available. Twelve journal DOI links were verified against the first page of each existing publication PDF.
- Vite builds full HTML for 43 public pages plus a noindex 404. Canonical and sharing URLs use the served trailing-slash URLs. The sitemap is generated from the same publication records. Article metadata uses complete known author names, omits abbreviation markers, and distinguishes editors from authors; nonjournal venues/status are not labeled as journals.
- Mobile homepage actions appear before the portrait. Abstracts expand to their full height and are hidden semantically when collapsed. CV and research jumps move focus and clear the fixed header. Route navigation focuses the new heading, trailing-slash routes show current navigation, and result counts are announced. Narrow layouts, larger text, notification contrast/dismiss naming and clipboard fallback were repaired.
- Weekly Scholar refreshes record successful verification even if the count is unchanged; failures preserve the previous data and now fail Actions. The browser shows counts only within 30 days of verification, otherwise a plain profile link. No paid service or blocking workaround was added.

The publication source, existing PDFs, biography, research-focus copy and four existing in-brief summaries were not edited. No events, news, new explanatory summaries, additional tracking, DNS changes, Pages setting changes or deployment-workflow changes were made.

## Validation

- Full local production browser suite: **175 passed, 15 expected device-specific skips**, covering desktop Chromium and Pixel 7 emulation.
- Follow-up publication regression suite: **24 passed**, including static-page hydration after the calendar year changes.
- All 39 publication pages and four main pages checked with JavaScript disabled. Titles, citation authors, venue metadata, canonical URLs and available abstracts were checked.
- Static integrity script passed: 43 sitemap entries; unique route metadata; valid JSON-LD; existing internal files/links; all 37 publication PDF copies byte-identical to their original source and legacy deployed path.
- Python updater regression tests: four tests passed, with fetch/parse failures, implausible values, unchanged counts, verification dates and total-count parsing. These tests are offline and never read/write the actual Scholar data file.
- TypeScript application/config checks passed. ESLint had no errors and two pre-existing Fast Refresh warnings in `badge.tsx` and `button.tsx`. Build retains the existing outdated Browserslist-data warning.
- Axe WCAG 2 A/AA checks passed on the five page templates in light/dark themes and the open mobile menu. The visible clipboard-failure state passed with only the two Radix focus proxies excluded after proving that a single native focus redirects into the notification. Playwright's double-focus helper initially produced a false positive; F8, Tab and Escape behavior was also verified. No accessibility rule was disabled globally.
- Regression tests cover a complete long abstract at 320px with 200% root text sizing, no horizontal overflow, CV heading clearance, menu target focus, Clear filters focus, mobile CTA tab/visual order, filter history and metadata cleanup after client navigation.
- Manual production-preview inspection at 390px (homepage), 640px (catalog), 320px (publication), and 1280px (desktop homepage). The tablet search field has its own full row. Browser error/warning log was empty in these inspected views.
- Three independent read-only reviews covered functional/responsive behavior, accessibility, and static SEO/release integrity. Material findings were fixed or reproduced and refuted.

## Maintenance and limits

`npm run build` produces the complete site with the existing Vite/React stack. The build-only server bundle stays outside `dist`. Existing `/documents/` PDFs and publication hashes continue working. Colocated `paper.pdf` copies support [Scholar's abstract/PDF directory guidance](https://scholar.google.com/intl/en/scholar/inclusion.html); originals are preserved. One existing PDF (`Deke_Wei_Kautz_2021_Asymdystopia.pdf`, 5,263,785 bytes) is above Scholar's documented 5 MB limit and has not been rewritten.

The new Check site pull-request workflow runs build/browser, type/lint, offline Scholar and static checks. It uploads the production artifact and browser report without deploying. The normal **Build and deploy Vite site** workflow continues deploying only after a merge/push to master.

Scholar has recently returned HTTP 403 to the existing scheduled updater. The fix makes this visible and prevents stale numbers from appearing current; it cannot guarantee Google's access or citation freshness. The original verification data was preserved. Search Console indexing, ranking changes, real assistive-technology behavior, Firefox/WebKit and real contact-form delivery were not tested. This report is not a legal accessibility certification.

Local review: run `npm run preview -- --port 4174`, then visit `http://localhost:4174/`. GitHub Pages does not supply a hosted branch preview; the pull request contains the downloadable build artifact after checks pass.
