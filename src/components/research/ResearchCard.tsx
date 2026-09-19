import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, BookOpen } from "lucide-react";
import { Publication, publicationTypes } from "@/data/publications";
import { cn } from "@/lib/utils";
import { Authors } from "./Authors";
import { PublicationActions } from "./PublicationActions";
import { publicationPath } from "@/lib/publications";
import { toWebP } from "@/lib/image-utils";
import { publicationDescription, verifiedAbstract } from "@/lib/publication-abstracts";

interface ResearchCardProps {
  publication: Publication;
  highlighted?: boolean;
}

// Journal cover image mappings - using downloaded covers where available, fallbacks for others
const journalImages: Record<string, string> = {
  "Journal of Human Capital": "/images/journals/journal-human-capital.png",
  "Economics Letters": "/images/journals/economics-letters.jpg",
  "Scientific Reports": "/images/journals/scientific-reports.jpg",
  "Proceedings of the National Academy of Sciences": "/images/journals/pnas.png",
  "Journal of the American Statistical Association": "/images/journals/jasa.png",
  "Nature": "/images/journals/nature.jpg",
  "Educational Researcher": "/images/journals/educational-researcher.png",
  "Journal of Economics & Management Strategy": "/images/journals/jems.png",
  "Journal of Research on Educational Effectiveness": "/images/journals/jree.png",
  "Labour Economics": "/images/journals/labour-economics.jpg",
  "British Medical Journal": "/images/journals/bmj.png",
};

// Function to get cover image - prioritizes publication.coverImage, then journal mapping
function getCoverImage(publication: Publication): string | null {
  if (publication.coverImage) return publication.coverImage;
  if (!publication.journal) return null;
  for (const [key, url] of Object.entries(journalImages)) {
    if (publication.journal.includes(key)) return url;
  }
  return null;
}

// Native lazy loading also leaves a usable image in the generated HTML.
function CoverImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  return <div className="w-16 h-[88px] sm:w-20 sm:h-28 rounded-lg shadow-sm bg-muted overflow-hidden flex-shrink-0">
    {hasError ? <BookOpen className="h-6 w-6 m-auto text-muted-foreground" /> : <picture>
      <source srcSet={toWebP(src)} type="image/webp" />
      <img src={src} alt={alt} width={80} height={112} loading="lazy" decoding="async"
        onError={() => setHasError(true)} className="w-full h-full object-cover" />
    </picture>}
  </div>;
}

export function ResearchCard({ publication, highlighted = false }: ResearchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const typeInfo = publicationTypes[publication.type];
  const coverImage = getCoverImage(publication);
  const bodyText = publicationDescription(publication);
  const abstract = verifiedAbstract(publication);
  const textLabel = abstract ? "abstract" : "summary";

  return (
    <article
      id={`pub-${publication.id}`}
      tabIndex={-1}
      className={cn(
        "bg-card rounded-xl border border-border/50 p-6 card-hover h-full flex flex-col scroll-mt-24",
        highlighted && "ring-2 ring-primary/40"
      )}
    >
      <div className="flex flex-wrap gap-4">
        {/* Cover Image - with optimized lazy loading */}
        {coverImage && (
          <CoverImage src={coverImage} alt={publication.journal ? `${publication.journal} cover` : ""} />
        )}

        <div className="flex-1 min-w-[min(100%,10rem)]">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full", typeInfo.color)}>
              {typeInfo.label}
            </span>
            <span className="text-xs font-medium text-muted-foreground self-center">
              {publication.year}
            </span>
          </div>

          <h3 className="font-display text-lg font-semibold text-foreground mb-2 leading-snug">
            <Link to={publicationPath(publication)} className="hover:text-primary underline decoration-transparent hover:decoration-current underline-offset-4">{publication.title}</Link>
          </h3>

          <p className="text-sm text-muted-foreground mb-3">
            <Authors text={publication.authors} />
          </p>

          {publication.journal && (
            <p className="text-sm italic text-foreground/75 mb-3">
              {publication.journal}
            </p>
          )}

          {/* Keyword Tags */}
          {publication.keywords && publication.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1">
              {publication.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary/80 text-secondary-foreground/90"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1" />

      {publication.inBrief && (
        <p className="text-sm text-muted-foreground mb-3">
          <span className="font-medium text-foreground/80">In brief: </span>
          {publication.inBrief}
        </p>
      )}

      {bodyText && (
        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex min-h-[44px] items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={isExpanded}
            aria-controls={`abstract-${publication.id}`}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
            {isExpanded ? `Hide ${textLabel}` : `Show ${textLabel}`}
          </button>
          <div
            id={`abstract-${publication.id}`}
            hidden={!isExpanded}
            className="mt-3"
          >
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
              {bodyText}
            </p>
            {abstract?.sourceNote && <p className="text-sm text-muted-foreground mt-2">{abstract.sourceNote}</p>}
          </div>
        </div>
      )}

      <PublicationActions publication={publication} />
    </article>
  );
}
