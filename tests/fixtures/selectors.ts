/**
 * Central selector inventory. The app ships no `data-testid`s, so we drive it
 * through accessible roles / names wherever possible and keep the handful of
 * CSS fallbacks here so specs stay readable and there is one place to update.
 */

export const routes = {
  home: "/",
  research: "/research",
  cv: "/cv",
  contact: "/contact",
  notFound: "/this-route-does-not-exist",
} as const;

export const expectedTitles = {
  home: /Tim Kautz \| Economist/i,
  research: /Research & Publications \| Tim Kautz/i,
  cv: /Curriculum Vitae \| Tim Kautz/i,
  contact: /Contact \| Tim Kautz/i,
} as const;

/** IDs that featured Home cards deep-link to (data-integrity anchors). */
export const featuredPubIds = [
  "kautz-zanoni-2024",
  "feng-etal-2022",
  "milkman-etal-2021",
  "heckman-etal-2014-book",
] as const;

export const research = {
  searchPlaceholder: "Search publications...",
  emptyState: "No publications found matching your criteria.",
  resultsCounter: /Showing \d+ of \d+ publications/,
  typeButtons: [
    "All",
    "Journal Articles",
    "Working Papers",
    "Book Chapters",
    "Edited Volumes",
    "Reports",
  ],
} as const;

export const toasts = {
  citationCopied: /Citation copied!/i,
  linkCopied: /Link copied!/i,
  messageSent: /Message sent!/i,
  error: /^Error$/i,
} as const;

export const formsubmitGlob = "**/formsubmit.co/**";
