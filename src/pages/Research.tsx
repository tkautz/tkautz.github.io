import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, ChevronDown, Calendar } from "lucide-react";
import { ScholarIcon } from "@/components/icons/site-icons";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ResearchCard } from "@/components/research/ResearchCard";
import { publications, Publication } from "@/data/publications";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { PublicationsStructuredData } from "@/components/seo/StructuredData";
import { SCHOLAR_URL, useScholarCitation } from "@/lib/scholar";
import { cn } from "@/lib/utils";
import { matchesPublication, publicationTopics, topics, Topic } from "@/lib/publications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PublicationType = Publication["type"] | "all";

const typeLabels: Record<Publication["type"], string> = {
  journal: "Journal Articles",
  "working-paper": "Working Papers",
  "book-chapter": "Book Chapters",
  "edited-volume": "Edited Volumes",
  report: "Policy Reports",
};

const typeOrder: Publication["type"][] = ["journal", "book-chapter", "edited-volume", "report", "working-paper"];

// Get unique years from publications
const uniqueYears = [...new Set(publications.map((pub) => pub.year))].sort((a, b) => b - a);

export default function Research() {
  const { label: scholarLabel } = useScholarCitation();
  const [params, setParams] = useSearchParams();
  const searchQuery = params.get("q") ?? "";
  const selectedType = typeOrder.includes(params.get("type") as Publication["type"]) ? params.get("type") : "all";
  const selectedYear = uniqueYears.some(year => String(year) === params.get("year")) ? params.get("year") : "all";
  const selectedTopic = Object.keys(topics).includes(params.get("topic") ?? "") ? params.get("topic") as Topic : "all";
  const setFilter = (key: string, value: string) => {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (!value || value === "all") next.delete(key); else next.set(key, value);
      return next;
    }, { replace: key === "q" });
  };
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const jumpTarget = useRef<HTMLElement | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const location = useLocation();

  // React Router doesn't scroll to #hash targets (e.g. /research#pub-xyz from
  // featured cards), so handle it after the entry animations have started.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const scrollTimeout = setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.focus({ preventScroll: true });
        element.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
        setHighlightedId(id);
      }
    }, 150);
    const highlightTimeout = setTimeout(() => setHighlightedId(null), 2500);
    return () => {
      clearTimeout(scrollTimeout);
      clearTimeout(highlightTimeout);
    };
  }, [location.hash]);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesSearch = matchesPublication(pub, searchQuery);

      const matchesType = selectedType === "all" || pub.type === selectedType;
      const matchesYear = selectedYear === "all" || pub.year.toString() === selectedYear;

      const matchesTopic = selectedTopic === "all" || publicationTopics(pub).includes(selectedTopic);
      return matchesSearch && matchesType && matchesYear && matchesTopic;
    });
  }, [searchQuery, selectedType, selectedYear, selectedTopic]);

  // Group publications by type
  const groupedPublications = useMemo(() => {
    const groups: Record<string, typeof filteredPublications> = {};
    
    typeOrder.forEach((type) => {
      // Newest first; the sort is stable, so the manual ordering in
      // publications.ts still breaks ties within a year.
      const pubs = filteredPublications
        .filter((pub) => pub.type === type)
        .sort((a, b) => b.year - a.year);
      if (pubs.length > 0) {
        groups[type] = pubs;
      }
    });
    
    return groups;
  }, [filteredPublications]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.keys(groupedPublications);
      for (const section of sections) {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom > 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [groupedPublications]);

  const scrollToSection = (type: string) => {
    const element = document.getElementById(`section-${type}`);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      element.focus({ preventScroll: true });
      if (mobileNavOpen) jumpTarget.current = element;
      window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
    setMobileNavOpen(false);
  };

  const typeFilters: { value: PublicationType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "journal", label: "Journal Articles" },
    { value: "working-paper", label: "Working Papers" },
    { value: "book-chapter", label: "Book Chapters" },
    { value: "edited-volume", label: "Edited Volumes" },
    { value: "report", label: "Policy Reports" },
  ];

  const hasActiveFilters = searchQuery !== "" || selectedType !== "all" || selectedYear !== "all" || selectedTopic !== "all";

  return (
    <>
      <Helmet>
        <title>Research & Publications | Tim Kautz</title>
        <meta
          name="description"
          content="Browse Tim Kautz's research publications on noncognitive skills, education economics, and employment program evaluation."
        />
        {/* Open Graph */}
        <meta property="og:title" content="Research & Publications | Tim Kautz" />
        <meta property="og:description" content="Browse Tim Kautz's research publications on noncognitive skills, education economics, and employment program evaluation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://timkautz.org/research/" />
        <link rel="canonical" href="https://timkautz.org/research/" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Research & Publications | Tim Kautz" />
        <meta name="twitter:description" content="Browse Tim Kautz's research publications on noncognitive skills, education economics, and employment program evaluation." />
      </Helmet>
      <PublicationsStructuredData />
      <Layout>
        <section className="section-padding bg-muted/30">
          <div className="container-wide">
            {/* Header */}
            <ScrollReveal className="text-center mb-12">
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Research
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                Research on which skills matter, how to measure them, and how
                schools and employment programs can develop them.
              </p>
              <a
                href={SCHOLAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <ScholarIcon className="h-4 w-4" />
                {scholarLabel}
              </a>
            </ScrollReveal>

            {/* Filters */}
            <ScrollReveal delay={0.1} className="mb-10 space-y-4">
              {/* Search and Year Filter Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_13rem_9rem] gap-3 max-w-3xl mx-auto">
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInput}
                    type="search"
                    placeholder="Search publications..."
                    aria-label="Search publications"
                    value={searchQuery}
                    onChange={(e) => setFilter("q", e.target.value)}
                    className="pl-10 min-h-[44px]"
                  />
                </div>
                <Select value={selectedTopic} onValueChange={value => setFilter("topic", value)}>
                  <SelectTrigger className="w-full min-h-[44px]" aria-label="Filter by topic">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {Object.entries(topics).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={value => setFilter("year", value)}>
                  <SelectTrigger className="w-full min-h-[44px]" aria-label="Filter by year">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-2">
                {typeFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={selectedType === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("type", filter.value)}
                    aria-pressed={selectedType === filter.value}
                    className="transition-all min-h-[44px] h-auto max-w-full whitespace-normal py-2"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </ScrollReveal>

            <div className="text-sm text-muted-foreground mb-6 text-center">
              <p role="status" aria-live="polite" aria-atomic="true">Showing {filteredPublications.length} of {publications.length} publications</p>
              {hasActiveFilters && <Button variant="ghost" onClick={() => { setParams({}); searchInput.current?.focus(); }} className="min-h-[44px] mt-2">Clear filters</Button>}
            </div>

            {/* Mobile TOC Dropdown */}
            <div className="lg:hidden mb-6">
              <DropdownMenu open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between min-h-[44px] h-auto whitespace-normal py-2">
                    <span className="flex flex-wrap items-center gap-2 text-left">
                      <span className="text-muted-foreground text-sm">Jump to:</span>
                      <span>
                        {activeSection ? typeLabels[activeSection as Publication["type"]] : "Select section"}
                      </span>
                    </span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", mobileNavOpen && "rotate-180")} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-md" onCloseAutoFocus={event => {
                  if (jumpTarget.current) {
                    event.preventDefault();
                    jumpTarget.current.focus({ preventScroll: true });
                    jumpTarget.current = null;
                  }
                }}>
                  {Object.keys(groupedPublications).map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => scrollToSection(type)}
                      aria-current={activeSection === type ? "true" : undefined}
                      className={cn(
                        "flex justify-between cursor-pointer",
                        activeSection === type 
                          ? "bg-primary text-primary-foreground font-medium" 
                          : "hover:bg-muted"
                      )}
                    >
                      {typeLabels[type as Publication["type"]]}
                      <span className={cn(
                        "text-xs",
                        activeSection === type ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        ({groupedPublications[type].length})
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Main content with TOC sidebar */}
            <div className="flex gap-8 max-w-6xl mx-auto">
              {/* Sticky TOC Sidebar - hidden on mobile */}
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <nav className="sticky top-24 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    On this page
                  </p>
                  {Object.keys(groupedPublications).map((type) => (
                    <button
                      key={type}
                      onClick={() => scrollToSection(type)}
                      aria-current={activeSection === type ? "true" : undefined}
                      className={cn(
                        "block w-full text-left text-sm py-2 px-3 rounded-md transition-all",
                        activeSection === type
                          ? "bg-primary text-primary-foreground font-medium shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {typeLabels[type as Publication["type"]]}
                      <span className={cn(
                        "ml-2 text-xs",
                        activeSection === type ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        ({groupedPublications[type].length})
                      </span>
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Publications List - Grouped by Type */}
              <div className="flex-1 min-w-0 space-y-12">
                {Object.entries(groupedPublications).map(([type, pubs]) => (
                  <section key={type} id={`section-${type}`} tabIndex={-1} className="scroll-mt-24">
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                      {typeLabels[type as Publication["type"]]}
                    </h2>
                    <motion.div layout className="flex flex-col gap-6">
                      <AnimatePresence mode="popLayout">
                        {pubs.map((pub, index) => (
                          <motion.div
                            key={pub.id}
                            layout
                            initial={false}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                          >
                            <ResearchCard
                              publication={pub}
                              highlighted={highlightedId === `pub-${pub.id}`}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </section>
                ))}
              </div>
            </div>

            {filteredPublications.length === 0 && (
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">
                  No publications found matching your criteria.
                </p>
              </motion.div>
            )}
          </div>
        </section>
        <ScrollToTop />
      </Layout>
    </>
  );
}
