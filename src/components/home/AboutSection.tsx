import { BookOpen, Users, TrendingUp, Award } from "lucide-react";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/ui/scroll-reveal";

const highlights = [
  {
    icon: BookOpen,
    title: "Which Skills Matter",
    description: "Documenting how noncognitive skills like perseverance and self-control affect education, employment, health, and other life outcomes.",
  },
  {
    icon: TrendingUp,
    title: "Measuring Skills",
    description: "Developing and comparing skill measures based on self-reports, teacher reports, and administrative data, including research on problems like reference bias.",
  },
  {
    icon: Users,
    title: "Developing Skills",
    description: "Evaluating school and employment programs designed to improve these skills, using randomized trials and quasi-experimental methods.",
  },
  {
    icon: Award,
    title: "Evidence for Practice",
    description: "Helping school districts and government agencies measure skills and apply research evidence, including work on social and emotional learning surveys.",
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
            My research focuses on three related questions: Which skills matter for
            success in education, employment, and life? How can we measure them? And
            how can schools and programs help people develop them?
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
