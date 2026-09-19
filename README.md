# tkautz.github.io

Academic profile website for Tim Kautz — Senior Researcher at Mathematica. The site presents research publications, a curriculum vitae, and contact information.

Built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui.

Public site: [https://timkautz.org](https://timkautz.org). The GitHub repository remains `tkautz/tkautz.github.io`.

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Deployment

Pushes to `master` are deployed automatically to GitHub Pages via the **Build and deploy Vite site** workflow in `.github/workflows/deploy-pages.yml`.

GitHub Pages is configured to serve `timkautz.org`. The production build renders complete HTML for `/`, `/research/`, `/cv/`, `/contact/`, and every `/publications/<id>/` page, plus a noindex 404 page. React hydrates the existing HTML and supplies interactive controls. Old directory URLs and `/research#pub-<id>` links remain supported. Canonical URLs, sharing metadata, structured data, and robots use `https://timkautz.org`.

`src/entry-server.tsx` renders the same page components used in the browser. The temporary server bundle stays in `node_modules/.cache/site-ssr/`; only `dist/` is deployed. `scripts/postbuild-pages.mjs` generates `dist/sitemap.xml` from the publication records, replacing the legacy four-page sitemap copied from `public/`. No server is needed on GitHub Pages.

This repository uses a custom Actions deployment, so GitHub Pages does not require a `CNAME` file. DNS and the Pages custom-domain and HTTPS settings are managed outside the repository; the URL migration does not change them.

## Content

- Publications are maintained in `src/data/publications.ts`.
- Published PDFs live in `public/documents/`; do not edit the originals. The build keeps those URLs and makes `paper.pdf` copies beside publication pages for Google Scholar's same-directory metadata requirement. The one oversized Asymdystopia paper uses a losslessly compressed copy from `public/scholar-pdfs/`, declared with original/output hashes in `src/data/scholar-pdfs.json`. All other copies remain byte-identical, and every Scholar copy must be below 5 MB.
- Complete author-written abstracts transcribed from 15 linked PDFs are in `src/data/publication-abstracts.json`, with source PDF/page provenance. The original catalog is preserved. Records without a verified complete abstract retain their existing text, labeled Summary rather than Abstract. The linked 2019 working-paper version of the 2021 personality chapter is explicitly identified.
- Journal covers, book covers, and logos live in `public/images/`.
- Publication pages and sitemap entries are generated automatically from the existing records. Topic labels and search abbreviations are in `src/lib/publications.ts`; DOI links verified from the existing journal PDFs are in `src/data/publication-dois.ts`. No new publication summaries are generated.

## Google Scholar count

The existing weekly **Update citation count** workflow refreshes the count and its verification date, even when the count is unchanged. A blocked, malformed, or implausible response fails the job and preserves the previous data. It does not bypass Google's blocking or use a paid service. Counts older than 30 days disappear from the browser, leaving the Google Scholar profile link; a successful refresh restores them. Static HTML always contains the durable profile link. The browser rechecks freshness on load, hourly, and when the tab becomes visible.

## Verification

```sh
npm run lint
npx tsc --noEmit -p tsconfig.app.json
npx tsc --noEmit -p tsconfig.node.json
python -m unittest discover -s scripts -p test_update_citations.py
npx playwright install chromium
npm test
python scripts/verify_site.py
```

Python tests need `requests` and never contact Scholar or modify the live data file. Browser tests use desktop Chromium and Pixel 7 emulation; contact submissions are mocked. The **Check site** pull-request workflow runs these checks and supplies a downloadable production build and browser report. It does not deploy or change Pages settings.
