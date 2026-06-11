# tkautz.github.io

Academic profile website for Tim Kautz — Senior Researcher at Mathematica. The site presents research publications, a curriculum vitae, and contact information.

Built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui.

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

Pushes to `master` are deployed automatically to GitHub Pages via the workflow in `.github/workflows/deploy-pages.yml`.

## Content

- Publications are maintained in `src/data/publications.ts`.
- PDFs of papers live in `documents/`.
- Journal covers, book covers, and logos live in `public/images/`.
