import { useEffect, useState } from "react";
import scholarData from "../data/scholar.json";
import { freshCitationCount } from "./scholar-freshness";

export const SCHOLAR_URL = "https://scholar.google.com/citations?user=lf96MecAAAAJ&hl=en";

export function useScholarCitation() {
  // Static HTML uses the durable profile link. Recheck in the browser so a
  // blocked updater cannot leave an old count visible indefinitely.
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const refresh = () => setCount(freshCitationCount(scholarData));
    refresh();
    const timer = window.setInterval(refresh, 60 * 60 * 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, []);
  const text = count === null ? null : `${count.toLocaleString("en-US")} citations`;
  return { text, label: text ? `Google Scholar (${text})` : "Google Scholar" };
}
