import scholarData from "@/data/scholar.json";

export const SCHOLAR_URL = "https://scholar.google.com/citations?user=lf96MecAAAAJ&hl=en";

function citationCount(): number | null {
  const count = (scholarData as { citations?: unknown }).citations;
  if (typeof count === "number" && Number.isFinite(count) && count > 0) {
    return Math.round(count);
  }
  return null;
}

// "Google Scholar (11,358 citations)" when a sane count is available, else
// plain "Google Scholar". scholar.json is refreshed weekly by
// .github/workflows/update-citations.yml.
export function scholarLabel(): string {
  const count = citationCount();
  return count === null
    ? "Google Scholar"
    : `Google Scholar (${count.toLocaleString("en-US")} citations)`;
}

// Just the count portion, for places that already show a "Google Scholar" label.
export function scholarCitationText(): string | null {
  const count = citationCount();
  return count === null ? null : `${count.toLocaleString("en-US")} citations`;
}
