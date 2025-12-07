import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publications } from "@/data/publications";
import { ResearchCard } from "@/components/research/ResearchCard";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/ui/scroll-reveal";

export function FeaturedResearch() {
  const featuredPubs = publications.filter((pub) => pub.featured).slice(0, 4);

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Featured Research
              </h2>
              <p className="text-muted-foreground">
                Selected publications on skills, education, and employment
              </p>
            </div>
            <Button asChild variant="ghost" className="group self-start sm:self-auto min-h-[44px]">
              <Link to="/research">
                View all publications
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid md:grid-cols-2 gap-6" staggerDelay={0.15}>
          {featuredPubs.map((pub) => (
            <StaggerItem key={pub.id}>
              <ResearchCard publication={pub} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
