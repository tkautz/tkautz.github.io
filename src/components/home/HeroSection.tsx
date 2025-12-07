import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const affiliations = [
  {
    name: "Behavior Change for Good",
    url: "https://bcfg.wharton.upenn.edu/",
    org: "UPenn",
    logo: "/images/logos/upenn.png",
  },
  {
    name: "Institute for Economic and Social Research",
    url: "https://iesr.jnu.edu.cn/Home/main.htm",
    org: "Jinan University",
    logo: "/images/logos/jinan.png",
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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Role badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
                Senior Researcher at Mathematica
              </Badge>
            </motion.div>

            {/* Name - prominent serif styling */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight"
            >
              Tim Kautz
            </motion.h1>

            {/* Bio paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-5 text-muted-foreground text-lg leading-relaxed max-w-xl"
            >
              <p>
                I am a Senior Researcher (Economist and Data Scientist) at{" "}
                <a 
                  href="https://www.mathematica.org/" 
                  className="text-primary font-medium hover:underline underline-offset-4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Mathematica
                </a>{" "}
                with extensive experience in causal inference and advanced statistical modeling. 
                I design experiments, analyze complex datasets, communicate findings to broad audiences, and lead teams.
              </p>
              <p>
                I study approaches to measuring non-cognitive skills like perseverance and emotional control, 
                and evaluate interventions designed to improve these skills.
              </p>
            </motion.div>

            {/* Affiliation badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
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
                      <img 
                        src={affiliation.logo} 
                        alt="" 
                        className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                      />
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
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-2"
            >
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
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative background blur */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 rounded-3xl blur-2xl" />
              <img
                src="/images/headshot-2.jpg"
                alt="Portrait of Tim Kautz"
                loading="eager"
                className="relative w-72 sm:w-80 lg:w-96 rounded-2xl shadow-xl ring-1 ring-border/50"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
