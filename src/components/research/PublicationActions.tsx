import { useState } from "react";
import { Check, Copy, Download, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Publication } from "@/data/publications";
import { publicationCitation, publicationUrl } from "@/lib/publications";
import { useToast } from "@/hooks/use-toast";
import { publicationDois } from "@/data/publication-dois";

export function PublicationActions({ publication }: { publication: Publication }) {
  const [copied, setCopied] = useState(false);
  const [manualCopy, setManualCopy] = useState("");
  const { toast } = useToast();
  const doi = publicationDois[publication.id];
  async function copy(text: string, citation: boolean) {
    try {
      await navigator.clipboard.writeText(text);
      setManualCopy("");
      if (citation) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      toast({ title: citation ? "Citation copied!" : "Link copied!", description: citation
        ? "The citation has been copied to your clipboard." : "A direct link to this publication has been copied." });
    } catch {
      setManualCopy(text);
      toast({ title: "Couldn't copy", description: "Select and copy the text below the publication buttons.", variant: "destructive" });
    }
  }
  return <>
    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
      {publication.pdfUrl && <Button asChild variant="outline" size="sm" className="min-h-[44px] h-auto max-w-full whitespace-normal py-2">
        <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer"><Download className="h-3.5 w-3.5 mr-1.5" />PDF</a>
      </Button>}
      {publication.externalUrl && <Button asChild variant="outline" size="sm" className="min-h-[44px] h-auto max-w-full whitespace-normal py-2">
        <a href={publication.externalUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1.5" />View</a>
      </Button>}
      {doi && <Button asChild variant="outline" size="sm" className="min-h-[44px] h-auto max-w-full whitespace-normal py-2">
        <a href={`https://doi.org/${doi}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1.5" />Publisher</a>
      </Button>}
      <Button variant="ghost" size="sm" onClick={() => copy(publicationCitation(publication), true)} className="min-h-[44px] h-auto max-w-full whitespace-normal py-2">
        {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}{copied ? "Copied" : "Cite"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => copy(publicationUrl(publication), false)} className="min-h-[44px] h-auto max-w-full whitespace-normal py-2">
        <Share2 className="h-3.5 w-3.5 mr-1.5" />Share
      </Button>
    </div>
    {manualCopy && <label className="block mt-3 text-sm">Copy manually
      <textarea readOnly value={manualCopy} onFocus={event => event.target.select()} className="mt-1 w-full rounded border border-border bg-background p-3 text-base" rows={4} />
    </label>}
  </>;
}
