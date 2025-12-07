import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Download, ChevronDown, GraduationCap, Briefcase, Award, BookOpen, Users, Mic, Code, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface CVSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

const cvSections: CVSection[] = [
  {
    id: "position",
    title: "Current Position",
    icon: Briefcase,
    content: (
      <div className="space-y-4">
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div>
              <h3 className="font-medium text-foreground">Senior Researcher</h3>
              <p className="text-sm text-primary">
                <a href="https://www.mathematica.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Mathematica
                </a>, Princeton, NJ
              </p>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sep. 2015 – Present</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "affiliations",
    title: "Affiliations",
    icon: Users,
    content: (
      <div className="space-y-4">
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="flex items-start gap-3">
              <img src="/images/logos/upenn.png" alt="" className="w-5 h-5 mt-0.5 object-contain" />
              <div>
                <h3 className="font-medium text-foreground">Senior Fellow</h3>
                <p className="text-sm text-primary">
                  <a href="https://bcfg.wharton.upenn.edu/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Behavior Change for Good Initiative
                  </a>, University of Pennsylvania
                </p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Aug. 2019 – Present</span>
          </div>
        </div>
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="flex items-start gap-3">
              <img src="/images/logos/jinan.png" alt="" className="w-5 h-5 mt-0.5 object-contain" />
              <div>
                <h3 className="font-medium text-foreground">Adjunct Professor</h3>
                <p className="text-sm text-primary">
                  <a href="https://iesr.jnu.edu.cn/Home/main.htm" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Institute for Economic and Social Research
                  </a>, Jinan University
                </p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sep. 2016 – Present</span>
          </div>
        </div>
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="flex items-start gap-3">
              <img src="/images/logos/uchicago.png" alt="" className="w-5 h-5 mt-0.5 object-contain" />
              <div>
                <h3 className="font-medium text-foreground">Network Leader</h3>
                <p className="text-sm text-primary">
                  <a href="https://hceconomics.uchicago.edu/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Human Capital and Economic Opportunity Global Working Group
                  </a>, University of Chicago
                </p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Jun. 2015 – Present</span>
          </div>
        </div>
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="flex items-start gap-3">
              <img src="/images/logos/iza.png" alt="" className="w-5 h-5 mt-0.5 object-contain" />
              <div>
                <h3 className="font-medium text-foreground">Senior Visiting Fellow</h3>
                <p className="text-sm text-primary">
                  <a href="https://www.iza.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    IZA – Institute of Labor Economics
                  </a> (formerly briq), Bonn, Germany
                </p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Apr. 2019</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "education",
    title: "Education",
    icon: GraduationCap,
    content: (
      <div className="space-y-4">
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="flex items-start gap-3">
              <img src="/images/logos/uchicago.png" alt="" className="w-5 h-5 mt-0.5 object-contain" />
              <div>
                <h3 className="font-medium text-foreground">Ph.D. Economics</h3>
                <p className="text-sm text-primary">University of Chicago</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Jun. 2015</span>
          </div>
        </div>
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="flex items-start gap-3">
              <img src="/images/logos/uchicago.png" alt="" className="w-5 h-5 mt-0.5 object-contain" />
              <div>
                <h3 className="font-medium text-foreground">M.A. Economics</h3>
                <p className="text-sm text-primary">University of Chicago</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Jun. 2012</span>
          </div>
        </div>
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="flex items-start gap-3">
              <img src="/images/logos/stanford.ico" alt="" className="w-5 h-5 mt-0.5 object-contain" />
              <div>
                <h3 className="font-medium text-foreground">B.A. Economics (with Honors)</h3>
                <p className="text-sm text-primary">Stanford University</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Jun. 2008</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "previous",
    title: "Previous Positions",
    icon: History,
    content: (
      <div className="space-y-4">
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div>
              <h3 className="font-medium text-foreground">Research Assistant</h3>
              <p className="text-sm text-primary italic">Center for the Economics of Human Development, Chicago, IL</p>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Jun. 2010 – Jun. 2015</span>
          </div>
        </div>
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div>
              <h3 className="font-medium text-foreground">Quantitative Research Analyst</h3>
              <p className="text-sm text-primary italic">Acumen LLC, Burlingame, CA</p>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Jan. 2008 – Aug. 2008</span>
          </div>
        </div>
        <div className="relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors">
          <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div>
              <h3 className="font-medium text-foreground">Research Assistant</h3>
              <p className="text-sm text-primary italic">Center for Health Policy, Stanford, CA</p>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Jan. 2006 – Jun. 2008</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "awards",
    title: "Funding, Fellowships & Awards",
    icon: Award,
    content: (
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
          <span>Spencer Foundation Grant (Co-PI), "Advancing the Measurement of Non-Cognitive Skills" ($480k)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
          <span>ECMC Foundation Grant (Co-PI), "Evaluation of Chicago's OneGoal Program" ($100k)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
          <span>Milgrom Foundation Successful Pathways Initiative Grant (PI), "Evaluation of Chicago's OneGoal Program" ($50k)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
          <span>Esther and T.W. Schultz Endowment Fellowship, University of Chicago</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
          <span>Social Sciences Fellowship, University of Chicago</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
          <span>NSF Graduate Fellowship</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
          <span>Young Investigator Award, Conference on Retroviruses and Opportunistic Infections (2009)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
          <span>Anna Laura Meyers Award for an Outstanding Economics Honors Thesis, Stanford University</span>
        </li>
      </ul>
    ),
  },
  {
    id: "service",
    title: "Professional Service",
    icon: BookOpen,
    content: (
      <div className="space-y-4 text-sm">
        <div>
          <p className="font-medium text-foreground mb-2">Referee:</p>
          <p className="text-muted-foreground italic">
            American Economic Journal: Economic Policy, Education Finance and Policy, Forum for Health Economics and Policy, 
            Journal of Applied Econometrics, Journal of Economic Behavior and Organization, Journal of Health Economics, 
            Journal of Human Capital, Journal of Labor Economics, Journal of Policy Analysis and Management, Journal of Political Economy, 
            Labour Economics, Learning and Individual Differences, Oxford Bulletin of Economics and Statistics, 
            Proceedings of the National Academy of Sciences, SAGE Open, Science
          </p>
        </div>
        <div>
          <p className="font-medium text-foreground mb-2">Member:</p>
          <p className="text-muted-foreground">
            Council of Distinguished Scientists, National Commission on Social, Emotional, and Academic Development
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "skills",
    title: "Skills",
    icon: Code,
    content: (
      <div className="grid sm:grid-cols-3 gap-6 text-sm">
        <div>
          <h4 className="font-medium text-foreground mb-2">Computer Skills</h4>
          <p className="text-muted-foreground">Stata, Python, R, Git, Mplus, MatLab, Mathematica, LaTeX</p>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-2">Languages</h4>
          <p className="text-muted-foreground">Spanish (intermediate), Swahili (very basic)</p>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-2">Interests</h4>
          <p className="text-muted-foreground">Photography, Hiking</p>
        </div>
      </div>
    ),
  },
  {
    id: "presentations",
    title: "Selected Presentations",
    icon: Mic,
    content: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p><strong className="text-foreground">2023:</strong> Association for Public Policy Analysis & Management Conference</p>
        <p><strong className="text-foreground">2022:</strong> Research and Evaluation Conference on Self-Sufficiency</p>
        <p><strong className="text-foreground">2020:</strong> APPAM Conference, Society for Research on Educational Effectiveness</p>
        <p><strong className="text-foreground">2019:</strong> NCES STATS-DC Data Conference, briq Bonn University</p>
        <p><strong className="text-foreground">2017:</strong> Society of Labor Economics, University of Chicago, Jinan University, APPAM</p>
        <p><strong className="text-foreground">2016:</strong> University of Oxford (RISE Annual Conference)</p>
        <p><strong className="text-foreground">2015:</strong> UVA Batten School, Columbia Teachers College, Stanford, SUNY Binghamton</p>
        <p><strong className="text-foreground">2014:</strong> American Economic Association Annual Meeting, World Bank</p>
      </div>
    ),
  },
];

function CollapsibleSection({ section, index }: { section: CVSection; index: number }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ScrollReveal delay={index * 0.05}>
      <div className="border border-border/50 rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors min-h-[64px]"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <section.icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground text-left">
              {section.title}
            </h2>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5">
                {section.content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollReveal>
  );
}

export default function CV() {
  return (
    <>
      <Helmet>
        <title>Curriculum Vitae | Tim Kautz</title>
        <meta
          name="description"
          content="View Tim Kautz's curriculum vitae, including education at Stanford and University of Chicago, employment at Mathematica, publications, and professional service."
        />
        {/* Open Graph */}
        <meta property="og:title" content="Curriculum Vitae | Tim Kautz" />
        <meta property="og:description" content="View Tim Kautz's curriculum vitae, including education at Stanford and University of Chicago, employment at Mathematica, publications, and professional service." />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Curriculum Vitae | Tim Kautz" />
        <meta name="twitter:description" content="View Tim Kautz's curriculum vitae, including education at Stanford and University of Chicago, employment at Mathematica, publications, and professional service." />
      </Helmet>
      <Layout>
        <section className="section-padding">
          <div className="container-narrow">
            {/* Header */}
            <ScrollReveal className="text-center mb-12">
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Curriculum Vitae
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Education, experience, and professional background
              </p>
              <Button asChild size="lg" className="group min-h-[48px]">
                <a href="/documents/TimKautz_CV.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Full CV (PDF)
                </a>
              </Button>
            </ScrollReveal>

            {/* Quick Navigation */}
            <ScrollReveal delay={0.1} className="flex flex-wrap justify-center gap-2 mb-10">
              {cvSections.slice(0, 4).map((section) => (
                <Button
                  key={section.id}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="min-h-[40px]"
                >
                  <section.icon className="h-3.5 w-3.5 mr-1.5" />
                  {section.title.split(",")[0]}
                </Button>
              ))}
            </ScrollReveal>

            {/* CV Sections */}
            <div className="space-y-4">
              {cvSections.map((section, index) => (
                <div key={section.id} id={section.id}>
                  <CollapsibleSection section={section} index={index} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
