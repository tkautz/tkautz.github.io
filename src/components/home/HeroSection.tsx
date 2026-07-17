import { Link } from "react-router-dom";
import { ArrowRight, FileText, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toWebP } from "@/lib/image-utils";
import { SCHOLAR_URL, scholarLabel } from "@/lib/scholar";

const affiliations = [
  {
    name: "Behavior Change for Good",
    url: "https://bcfg.wharton.upenn.edu/",
    org: "UPenn",
    // .png (with .webp source) rather than the 42 KB upenn.svg — it renders at 16px
    logo: "/images/logos/upenn.png",
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

// Rendered twice (mobile and desktop) so the photo can sit high on the page on
// phones while keeping the side-by-side desktop layout. Same URL, so the
// browser only downloads the image once.
function Headshot({ variant }: { variant: "mobile" | "desktop" }) {
  const isMobile = variant === "mobile";
  return (
    <div className={isMobile ? "w-full max-w-sm" : undefined}>
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
          className={
            isMobile
              ? "w-full aspect-[4/5] object-cover object-top rounded-xl shadow-md ring-1 ring-border/40"
              : "w-40 sm:w-48 md:w-56 lg:w-64 rounded-xl shadow-md ring-1 ring-border/40"
          }
        />
      </picture>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative bg-muted/40">
      {/* Faint dot-grid "data" texture, fading out toward the bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(hsl(var(--foreground)/0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      />
      <div className="relative container-wide section-padding">
        {/* Single subtle fade; the rest of the page renders still. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid sm:grid-cols-[1fr_auto] gap-6 sm:gap-8 items-center"
        >
          {/* Text Content */}
          <div className="space-y-6">
            {/* Name and tagline */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                Tim Kautz
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-medium">
                Economist and Senior Researcher at{" "}
                <a
                  href="https://www.mathematica.org/"
                  className="text-primary underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mathematica
                </a>
              </p>
            </div>

            {/* Mobile photo: high on the page, wide */}
            <div className="sm:hidden flex justify-center pt-2">
              <Headshot variant="mobile" />
            </div>

            {/* Bio paragraphs */}
            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed max-w-2xl">
              <p>
                I study social and emotional skills, sometimes called noncognitive skills.
                These are skills like perseverance and self-control that help people succeed
                in education, employment, and life. My work looks at which skills matter,
                how to measure them, and how schools and programs can improve them.
              </p>
              <p>
                I have worked on these questions for more than a decade. I design experiments,
                build new measures, and analyze administrative data. Much of my job is leading
                research teams and making findings useful for policymakers and practitioners.
              </p>
              <p>
                The next big question I want to tackle is how AI changes this picture: which
                skills matter most for young people when AI can handle more of the routine
                cognitive work, how to measure those skills, and whether AI tools can actually
                help develop them.
              </p>
            </div>

            {/* Affiliation badges */}
            <div className="space-y-3">
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
                      className="px-3 py-1.5 text-sm bg-card hover:bg-secondary hover:border-primary/30 transition-colors duration-200 cursor-pointer flex items-center gap-2"
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
            </div>

            {/* CTA Buttons */}
            <div className="pt-2">
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 px-6 text-base">
                  <Link to="/research">
                    View My Research
                    <ArrowRight className="ml-2 h-4 w-4" />
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
                href={SCHOLAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <GraduationCap className="h-4 w-4" />
                {scholarLabel()}
              </a>
            </div>
          </div>

          {/* Profile Image (desktop) */}
          <div className="hidden sm:flex justify-center">
            <Headshot variant="desktop" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
