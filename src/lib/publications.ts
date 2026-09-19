import { Publication } from "@/data/publications";

export const SITE_URL = "https://timkautz.org";
export const publicationPath = (pub: Publication) => `/publications/${pub.id}/`;
export const publicationUrl = (pub: Publication) => `${SITE_URL}${publicationPath(pub)}`;
// Build-generated copy beside the abstract page, as required by Scholar.
// Existing /documents/ URLs remain available and unchanged.
export const publicationPdfPath = (pub: Publication) => `${publicationPath(pub)}paper.pdf`;

export const topics = {
  skills: "Skill measurement",
  education: "Education",
  employment: "Employment",
  methods: "Evaluation methods",
  health: "Health",
} as const;
export type Topic = keyof typeof topics;

// Short catalog labels only. Publication text stays in the original records.
const topicKeywords: Record<Topic, string[]> = {
  skills: ["noncognitive skills", "measurement", "personality", "character skills", "self-regulation", "social and emotional learning"],
  education: ["education", "child development", "achievement tests", "GED", "school climate", "school leadership", "professional development", "remote schooling"],
  employment: ["employment", "employment coaching", "labor economics", "TANF", "SSI"],
  methods: ["statistical methods", "research design", "causal inference", "sensitivity analysis", "Bayesian methods", "survey methods", "reference bias", "field experiment"],
  health: ["health", "mental health", "disability", "Medicare"],
};

export function publicationTopics(pub: Publication): Topic[] {
  return (Object.keys(topics) as Topic[]).filter(topic =>
    pub.keywords?.some(keyword => topicKeywords[topic].includes(keyword)),
  );
}

const abbreviations: Record<string, string> = {
  sel: "social and emotional learning",
  rct: "randomized controlled trial",
  rcts: "randomized controlled trial",
  tanf: "temporary assistance for needy families",
  ssi: "supplemental security income",
  ged: "general educational development",
};
const normalize = (value: string) => value.toLowerCase().normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").replace(/[-–—]/g, " ");

export function matchesPublication(pub: Publication, query: string): boolean {
  const text = normalize([pub.title, pub.authors, pub.journal, pub.abstract, pub.inBrief,
    ...(pub.keywords ?? []), ...publicationTopics(pub).map(topic => topics[topic])].join(" "));
  return normalize(query).trim().split(/\s+/).filter(Boolean).every(term => {
    if (abbreviations[term]) {
      // Match abbreviations as words: SEL must not match "self".
      return new RegExp(`\\b${term}\\b`).test(text) || text.includes(abbreviations[term]);
    }
    return text.includes(term);
  });
}

// The source uses "Surname, Given, Given Surname, and Given Surname".
// Handle two-author records and omit ellipses rather than inventing authors.
export function publicationAuthors(pub: Publication): string[] {
  const clean = pub.authors.replace(/\*\*/g, "").replace(/\s*\(Editors\)/, "")
    .replace(/\.\.\./g, "");
  const [surname, ...rest] = clean.split(/,\s*/);
  const names = rest.join(", ").split(/,\s*(?:and\s+)?|\s+and\s+/).map(x => x.trim()).filter(Boolean);
  return names.length ? [`${names[0]} ${surname}`, ...names.slice(1)] : [surname];
}

export function publicationCitation(pub: Publication): string {
  return `${pub.authors.replace(/\*\*/g, "")} (${pub.year}). "${pub.title}."${pub.journal ? ` ${pub.journal}.` : ""}`;
}
