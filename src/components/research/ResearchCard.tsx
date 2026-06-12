import { useState, useRef, useEffect } from "react";
import { ChevronDown, Download, Copy, Check, ExternalLink, BookOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Publication, publicationTypes } from "@/data/publications";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { toWebP } from "@/lib/image-utils";

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

// Optimized image component with intersection observer for lazy loading
function CoverImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // Start loading 300px before visible for smoother scrolling
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className="w-16 h-[88px] sm:w-20 sm:h-28 rounded-lg shadow-sm bg-muted overflow-hidden flex-shrink-0"
    >
      {isInView && !hasError && (
        <picture>
          <source srcSet={toWebP(src)} type="image/webp" />
          <img
            src={src}
            alt={alt}
            width={80}
            height={112}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </picture>
      )}
      {hasError && (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <BookOpen className="h-6 w-6 opacity-40" />
        </div>
      )}
    </div>
  );
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

export function ResearchCard({ publication, highlighted = false }: ResearchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const typeInfo = publicationTypes[publication.type];
  const coverImage = getCoverImage(publication);

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

  const handleShareLink = () => {
    const url = `${window.location.origin}/research#pub-${publication.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "A direct link to this publication has been copied.",
    });
  };

  return (
    <article
      id={`pub-${publication.id}`}
      className={cn(
        "bg-card rounded-xl border border-border/50 p-6 card-hover h-full flex flex-col scroll-mt-24",
        highlighted && "ring-2 ring-primary/40"
      )}
    >
      <div className="flex gap-4">
        {/* Cover Image - with optimized lazy loading */}
        {coverImage && (
          <CoverImage src={coverImage} alt={publication.journal ? `${publication.journal} cover` : ""} />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full", typeInfo.color)}>
              {typeInfo.label}
            </span>
            <span className="text-xs font-medium text-muted-foreground self-center">
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
        <Button variant="ghost" size="sm" onClick={handleShareLink} className="min-h-[36px]">
          <Share2 className="h-3.5 w-3.5 mr-1.5" />
          Share
        </Button>
      </div>
    </article>
  );
}
