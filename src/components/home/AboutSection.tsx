import { BookOpen, Users, TrendingUp, Award } from "lucide-react";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/ui/scroll-reveal";

const highlights = [
  {
    icon: BookOpen,
    title: "Which Skills Matter",
    description: "Documenting how noncognitive skills — perseverance, self-control, social skills — shape education, employment, health, and other life outcomes.",
  },
  {
    icon: TrendingUp,
    title: "Measuring Skills",
    description: "Comparing self-reports, teacher reports, and administrative data — and documenting pitfalls like reference bias — to measure skills credibly at scale.",
  },
  {
    icon: Users,
    title: "Developing Skills",
    description: "Testing whether schools and programs can teach these skills, with randomized trials and quasi-experiments from Chicago classrooms to federal employment programs.",
  },
  {
    icon: Award,
    title: "Evidence for Practice",
    description: "Helping districts, states, and federal agencies measure skills and act on evidence, including social and emotional learning surveys.",
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
            For more than a decade, my research has pursued three connected questions:
            Which skills matter for success in school, work, and life? How can we
            measure them credibly? And how can schools and programs help people
            develop them?
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
