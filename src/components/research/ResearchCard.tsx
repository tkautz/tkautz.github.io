import { useState } from "react";
import { ChevronDown, Download, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Publication, publicationTypes } from "@/data/publications";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ResearchCardProps {
  publication: Publication;
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

// Function to get journal image
function getJournalImage(journal?: string): string | null {
  if (!journal) return null;
  for (const [key, url] of Object.entries(journalImages)) {
    if (journal.includes(key)) return url;
  }
  return null;
}

// Function to render authors with bold Tim Kautz
function renderAuthors(authors: string) {
  // Replace **Tim Kautz** with bold span
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

export function ResearchCard({ publication }: ResearchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const typeInfo = publicationTypes[publication.type];
  const journalImage = getJournalImage(publication.journal);

  const handleCopyCitation = () => {
    const cleanAuthors = publication.authors.replace(/\*\*/g, "");
    const citation = `${cleanAuthors} (${publication.year}). "${publication.title}."${publication.journal ? ` ${publication.journal}.` : ""}`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    toast({
      title: "Citation copied!",
      description: "The citation has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="bg-card rounded-xl border border-border/50 p-6 card-hover h-full flex flex-col">
      <div className="flex gap-4">
        {/* Journal Cover Image */}
        {journalImage && (
          <div className="hidden sm:block flex-shrink-0">
            <img
              src={journalImage}
              alt={`Cover of ${publication.title}`}
              loading="lazy"
              decoding="async"
              className="w-20 h-28 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full", typeInfo.color)}>
              {typeInfo.label}
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
              {publication.year}
            </span>
          </div>

          <h3 className="font-display text-lg font-semibold text-foreground mb-2 leading-snug">
            {publication.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-3">
            {renderAuthors(publication.authors)}
          </p>

          {publication.journal && (
            <p className="text-sm text-primary font-medium mb-4 italic">
              {publication.journal}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1" />

      {publication.abstract && (
        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
            {isExpanded ? "Hide abstract" : "Show abstract"}
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              isExpanded ? "max-h-[500px] mt-3" : "max-h-0"
            )}
          >
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
              {publication.abstract}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
        {publication.pdfUrl && (
          <Button asChild variant="outline" size="sm" className="min-h-[36px]">
            <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              PDF
            </a>
          </Button>
        )}
        {publication.externalUrl && (
          <Button asChild variant="outline" size="sm" className="min-h-[36px]">
            <a href={publication.externalUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              View
            </a>
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={handleCopyCitation} className="min-h-[36px]">
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              Cite
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
