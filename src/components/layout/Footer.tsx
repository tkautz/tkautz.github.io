import { Mail, Linkedin, GraduationCap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const socialLinks = [
  {
    href: "mailto:tkautz@mathematica-mpr.com",
    icon: Mail,
    label: "Email",
    tooltip: "Send me an email",
  },
  {
    href: "https://www.linkedin.com/in/tkautz",
    icon: Linkedin,
    label: "LinkedIn",
    tooltip: "Visit my LinkedIn profile",
  },
  {
    href: "https://scholar.google.com/citations?user=lf96MecAAAAJ&hl=en",
    icon: GraduationCap,
    label: "Google Scholar",
    tooltip: "View my Google Scholar profile",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12" role="contentinfo">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-xl font-semibold mb-2">
              Tim Kautz
            </h3>
            <p className="text-background/70 text-sm">
              Senior Researcher at Mathematica
            </p>
          </div>

          <TooltipProvider>
            <nav aria-label="Social links">
              <ul className="flex items-center gap-4">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link.tooltip}
                          className="p-3 rounded-full bg-background/20 text-background hover:bg-background/30 transition-colors inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                          aria-label={link.tooltip}
                        >
                          <link.icon className="h-5 w-5" aria-hidden="true" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-background text-foreground">
                        {link.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </nav>
          </TooltipProvider>
        </div>

        <div className="mt-8 pt-8 border-t border-background/20 text-center">
          <p className="text-background/60 text-sm">
            © {currentYear} Tim Kautz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
