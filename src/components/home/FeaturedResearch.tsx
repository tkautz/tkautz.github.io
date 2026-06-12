import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publications } from "@/data/publications";
import { FeaturedResearchCard } from "./FeaturedResearchCard";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/ui/scroll-reveal";

export function FeaturedResearch() {
  const featuredPubs = publications.filter((pub) => pub.featured).slice(0, 4);

  return (
    <section className="bg-muted/50">
      <div className="container-wide section-padding">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Featured Research
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Selected publications on skills development, education, and employment.
              </p>
            </div>
            <Button asChild variant="outline" className="self-start sm:self-auto h-11 px-5">
              <Link to="/research">
                View all publications
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        {/* Cards grid - horizontal on desktop, stacked on mobile */}
        <StaggerChildren 
          className="grid grid-cols-1 md:grid-cols-2 gap-6" 
          staggerDelay={0.1}
        >
          {featuredPubs.map((pub) => (
            <StaggerItem key={pub.id}>
              <FeaturedResearchCard publication={pub} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
