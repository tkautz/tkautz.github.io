import abstracts from "@/data/publication-abstracts.json" with { type: "json" };
import type { Publication } from "@/data/publications";

interface VerifiedAbstract {
  text: string;
  sourcePdf: string;
  sourcePage: number;
  sourceNote?: string;
}

// Keep the original catalog data intact. These complete abstracts are transcribed
// from the linked PDFs; records without a verified abstract retain their summary.
export function verifiedAbstract(pub: Publication): VerifiedAbstract | undefined {
  return (abstracts as Record<string, VerifiedAbstract>)[pub.id];
}

export function publicationDescription(pub: Publication): string | undefined {
  return verifiedAbstract(pub)?.text ?? pub.abstract;
}
