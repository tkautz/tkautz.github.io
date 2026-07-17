import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/ui/scroll-reveal";
import {
  WhichSkillsIcon,
  MeasureSkillsIcon,
  DevelopSkillsIcon,
  EvidenceIcon,
} from "@/components/home/focus-icons";

const highlights = [
  {
    icon: WhichSkillsIcon,
    title: "Which Skills Matter",
    description: "Showing how skills like perseverance and self-control shape success in school, at work, and in life, sometimes as much as test scores do.",
  },
  {
    icon: MeasureSkillsIcon,
    title: "Measuring Skills",
    description: "Building practical ways to measure these skills, and showing where common tools like student surveys can go wrong.",
  },
  {
    icon: DevelopSkillsIcon,
    title: "Developing Skills",
    description: "Testing whether programs in schools and job training actually build these skills.",
  },
  {
    icon: EvidenceIcon,
    title: "Evidence for Practice",
    description: "Working with school districts and government agencies to put this evidence into practice.",
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
            Success in school and work depends on more than test scores. My research
            asks three questions about social and emotional skills: Which ones matter?
            How can we measure them well? And how can schools and programs help people
            build them? Increasingly, I am asking how AI reshapes all three.
          </p>
        </ScrollReveal>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <StaggerItem key={item.title}>
              <div className="group relative overflow-hidden p-6 bg-card rounded-xl border border-border/50 card-hover h-full">
                {/* Amber rule that draws in on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Forward-looking callout, deliberately distinct from the cards above */}
        <div className="mt-8 rounded-xl border border-border/60 border-l-4 border-l-accent bg-accent/5 p-6 sm:p-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Where this is heading
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            AI is changing which skills matter for young people, and it is breaking some
            of the ways we measure those skills. New tools promise to teach skills with AI
            as well. Whether any of this actually helps kids is still an open question —
            and one worth getting right.
          </p>
        </div>
      </div>
    </section>
  );
}
