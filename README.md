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

GitHub Pages is configured to serve `timkautz.org`. The Vite app uses the domain root (`/`), and the production build preserves direct visits to `/research`, `/cv`, and `/contact` plus the custom 404 page. Canonical URLs, social metadata, structured data, `public/sitemap.xml`, and `public/robots.txt` use `https://timkautz.org`.

This repository uses a custom Actions deployment, so GitHub Pages does not require a `CNAME` file. DNS and the Pages custom-domain and HTTPS settings are managed outside the repository; the URL migration does not change them.

## Content

- Publications are maintained in `src/data/publications.ts`.
- PDFs of papers live in `documents/`.
- Journal covers, book covers, and logos live in `public/images/`.
