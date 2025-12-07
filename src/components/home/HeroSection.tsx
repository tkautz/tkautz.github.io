import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary font-medium mb-3"
            >
              Senior Researcher at Mathematica
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            >
              Tim Kautz
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 text-muted-foreground mb-8 leading-relaxed"
            >
              <p>
                I am a Senior Researcher (Economist and Data Scientist) at{" "}
                <a href="https://www.mathematica.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Mathematica
                </a>{" "}
                with extensive experience in causal inference and advanced statistical modeling. 
                I design experiments, analyze complex datasets, communicate findings to broad audiences, and lead teams.
              </p>
              <p>
                I study approaches to measuring non-cognitive skills like perseverance and emotional control, 
                and evaluate interventions designed to improve these skills.
              </p>
              <p>
                I'm affiliated with the{" "}
                <a href="https://bcfg.wharton.upenn.edu/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Behavior Change for Good Initiative
                </a>{" "}
                at the University of Pennsylvania, the{" "}
                <a href="https://iesr.jnu.edu.cn/Home/main.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Institute for Economic and Social Research
                </a>{" "}
                at Jinan University, and the{" "}
                <a href="https://hceconomics.uchicago.edu/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Human Capital and Economic Opportunity Global Working Group
                </a>{" "}
                at the University of Chicago.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="group min-h-[48px]">
                <Link to="/research">
                  View My Research
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-[48px]">
                <a href="/documents/TimKautz_CV.pdf" target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  Download CV
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 md:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl transform rotate-6"></div>
            <img
              src="/images/headshot-2.jpg"
              alt="Portrait of Tim Kautz"
              loading="eager"
              className="relative w-64 sm:w-80 rounded-2xl shadow-xl"
            />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
