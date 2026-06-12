import { Link } from "react-router-dom";
import { ArrowRight, FileText, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toWebP } from "@/lib/image-utils";

const affiliations = [
  {
    name: "Behavior Change for Good",
    url: "https://bcfg.wharton.upenn.edu/",
    org: "UPenn",
    logo: "/images/logos/upenn.svg",
  },
  {
    name: "Institute for Economic and Social Research",
    url: "https://iesr.jnu.edu.cn/Home/main.htm",
    org: "Jinan University",
    logo: "/images/logos/jinan.svg",
  },
  {
    name: "Human Capital and Economic Opportunity",
    url: "https://hceconomics.uchicago.edu/",
    org: "UChicago",
    logo: "/images/logos/uchicago.png",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted via-secondary/30 to-background">
      {/* Subtle decorative element */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.05),_transparent_50%)]" />
      
      <div className="container-wide section-padding relative">
        <div className="grid sm:grid-cols-[1fr_auto] gap-6 sm:gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            {/* Name - prominent serif styling */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight"
            >
              Tim Kautz
            </motion.h1>

            {/* Bio paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-5 text-muted-foreground text-lg leading-relaxed max-w-2xl"
            >
              <p>
                I am an economist and Senior Researcher at{" "}
                <a
                  href="https://www.mathematica.org/"
                  className="text-primary font-medium hover:underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mathematica
                </a>
                . I study noncognitive skills, like perseverance and self-control, that help
                people succeed in education, employment, and life. My work looks at which skills
                matter, how to measure them, and how schools and programs can improve them.
              </p>
              <p>
                I have worked on these questions for more than a decade, designing experiments,
                building new measures, and analyzing administrative data. Much of my job involves
                leading research teams and making findings useful for policymakers and practitioners.
                More recently, I have become interested in how new technologies, including AI, are
                changing the skills young people need and how schools can teach them.
              </p>
            </motion.div>

            {/* Affiliation badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Affiliations
              </p>
              <div className="flex flex-wrap gap-2">
                {affiliations.map((affiliation) => (
                  <a
                    key={affiliation.name}
                    href={affiliation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Badge 
                      variant="outline" 
                      className="px-3 py-1.5 text-sm bg-card hover:bg-secondary hover:border-primary/30 transition-all duration-200 cursor-pointer flex items-center gap-2"
                    >
                      {/* Logos are decorative: the institution name follows as text */}
                      {affiliation.logo.endsWith(".svg") ? (
                        <img
                          src={affiliation.logo}
                          alt=""
                          aria-hidden="true"
                          width={16}
                          height={16}
                          loading="lazy"
                          decoding="async"
                          className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <picture>
                          <source srcSet={toWebP(affiliation.logo)} type="image/webp" />
                          <img
                            src={affiliation.logo}
                            alt=""
                            aria-hidden="true"
                            width={16}
                            height={16}
                            loading="lazy"
                            decoding="async"
                            className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </picture>
                      )}
                      <span className="text-foreground group-hover:text-primary transition-colors">
                        {affiliation.org}
                      </span>
                    </Badge>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2"
            >
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="group h-12 px-6 text-base">
                  <Link to="/research">
                    View My Research
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
                  <a href="/documents/TimKautz_CV.pdf" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    Download CV
                  </a>
                </Button>
              </div>
              <a
                href="https://scholar.google.com/citations?user=lf96MecAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <GraduationCap className="h-4 w-4" />
                View my Google Scholar profile
              </a>
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Decorative background blur */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 rounded-2xl blur-xl" />
              <picture>
                <source srcSet="/images/headshot-2.webp" type="image/webp" />
                <img
                  src="/images/headshot-2.jpg"
                  alt="Portrait of Tim Kautz"
                  width={256}
                  height={384}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="relative w-40 sm:w-48 md:w-56 lg:w-64 rounded-xl shadow-lg ring-1 ring-border/40"
                />
              </picture>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
