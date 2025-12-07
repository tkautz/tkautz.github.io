import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Publication, publicationTypes } from "@/data/publications";
import { cn } from "@/lib/utils";

interface FeaturedResearchCardProps {
  publication: Publication;
}

// Journal cover image mappings
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

function getJournalImage(journal?: string): string | null {
  if (!journal) return null;
  for (const [key, url] of Object.entries(journalImages)) {
    if (journal.includes(key)) return url;
  }
  return null;
}

function renderAuthors(authors: string) {
  const parts = authors.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function FeaturedResearchCard({ publication }: FeaturedResearchCardProps) {
  const typeInfo = publicationTypes[publication.type];
  const journalImage = getJournalImage(publication.journal);

  return (
    <article className="group bg-card rounded-xl border border-border/50 p-6 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-border">
      <div className="flex gap-4 flex-1">
        {/* Journal Cover Image */}
        {journalImage && (
          <div className="hidden sm:block flex-shrink-0">
            <img
              src={journalImage}
              alt={`Cover of ${publication.title}`}
              loading="lazy"
              decoding="async"
              className="w-16 h-22 object-cover rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full", typeInfo.color)}>
              {typeInfo.label}
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
              {publication.year}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-foreground mb-2 leading-snug line-clamp-2">
            {publication.title}
          </h3>

          {/* Authors */}
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
            {renderAuthors(publication.authors)}
          </p>

          {/* Journal */}
          {publication.journal && (
            <p className="text-sm text-primary font-medium italic line-clamp-1">
              {publication.journal}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1 min-h-4" />

          {/* Learn More Link */}
          <Link
            to={`/research#pub-${publication.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mt-4 pt-4 border-t border-border/50"
          >
            Learn more
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
