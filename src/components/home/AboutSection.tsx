import { BookOpen, Users, TrendingUp, Award } from "lucide-react";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/ui/scroll-reveal";

const highlights = [
  {
    icon: BookOpen,
    title: "Noncognitive Skills",
    description: "Measuring and fostering character skills, self-regulation, and their role in life outcomes.",
  },
  {
    icon: Users,
    title: "Employment Programs",
    description: "Evaluating interventions that improve employment outcomes for disadvantaged populations.",
  },
  {
    icon: TrendingUp,
    title: "Quantitative Methods",
    description: "Applying rigorous econometric and statistical methods to policy-relevant research questions.",
  },
  {
    icon: Award,
    title: "Policy Impact",
    description: "Translating research findings into actionable insights for policymakers and practitioners.",
  },
];

export function AboutSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Research Focus
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My research aims to understand the skills and interventions that 
            help individuals succeed in education, employment, and life.
          </p>
        </ScrollReveal>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <StaggerItem key={item.title}>
              <div className="group p-6 bg-card rounded-xl border border-border/50 card-hover h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
