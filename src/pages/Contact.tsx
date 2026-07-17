import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Mail, Linkedin, GraduationCap, MapPin, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/ui/scroll-reveal";
import { SCHOLAR_URL, scholarCitationText } from "@/lib/scholar";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "tkautz@mathematica-mpr.com",
    href: "mailto:tkautz@mathematica-mpr.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/tkautz",
    href: "https://www.linkedin.com/in/tkautz",
  },
  {
    icon: GraduationCap,
    label: "Google Scholar",
    value: scholarCitationText() ?? "View profile",
    href: SCHOLAR_URL,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Boulder, Colorado",
    href: null,
  },
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formsubmit.co/ajax/tkautz@mathematica-mpr.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          _subject: formData.get("subject"),
          message: formData.get("message"),
          // FormSubmit honeypot: hidden field bots fill in, causing the
          // submission to be silently discarded.
          _honey: formData.get("_honey"),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Message sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        form.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or email directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | Tim Kautz</title>
        <meta
          name="description"
          content="Get in touch with Tim Kautz for research collaborations, speaking engagements, or other inquiries."
        />
        {/* Open Graph */}
        <meta property="og:title" content="Contact Tim Kautz" />
        <meta property="og:description" content="Get in touch with Tim Kautz for research collaborations, speaking engagements, or other inquiries." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tkautz.github.io/contact" />
        <link rel="canonical" href="https://tkautz.github.io/contact" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Tim Kautz" />
        <meta name="twitter:description" content="Get in touch with Tim Kautz for research collaborations, speaking engagements, or other inquiries." />
      </Helmet>
      <Layout>
        <section className="section-padding bg-muted/30">
          <div className="container-narrow">
            {/* Header */}
            <ScrollReveal className="text-center mb-12">
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                I welcome inquiries about research collaborations, evaluation partnerships,
                speaking engagements, and other professional opportunities.
              </p>
            </ScrollReveal>

            <div className="grid lg:grid-cols-5 gap-10">
              {/* Contact Info Cards */}
              <StaggerChildren className="lg:col-span-2 space-y-4">
                {contactInfo.map((item) => (
                  <StaggerItem key={item.label}>
                    <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/50 card-hover min-h-[72px]">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium text-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>

              {/* Contact Form */}
              <ScrollReveal delay={0.2} className="lg:col-span-3">
                <div className="bg-card rounded-xl border border-border/50 p-6 sm:p-8">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. I'll respond as soon as possible.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline" className="min-h-[44px]">
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Honeypot field for spam bots; hidden from real users */}
                      <input
                        type="text"
                        name="_honey"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="hidden"
                      />
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your name"
                            required
                            className="min-h-[44px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="min-h-[44px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="What is this regarding?"
                          required
                          className="min-h-[44px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Your message..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full min-h-[48px]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
