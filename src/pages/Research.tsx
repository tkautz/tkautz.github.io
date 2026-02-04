import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Search, ChevronDown, Calendar, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ResearchCard } from "@/components/research/ResearchCard";
import { publications, Publication } from "@/data/publications";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { PublicationsStructuredData } from "@/components/seo/StructuredData";
import { cn } from "@/lib/utils";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<PublicationType>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        pub.title.toLowerCase().includes(query) ||
        pub.authors.toLowerCase().includes(query) ||
        pub.journal?.toLowerCase().includes(query) ||
        pub.keywords?.some(k => k.toLowerCase().includes(query));

      const matchesType = selectedType === "all" || pub.type === selectedType;
      const matchesYear = selectedYear === "all" || pub.year.toString() === selectedYear;

      return matchesSearch && matchesType && matchesYear;
    });
  }, [searchQuery, selectedType, selectedYear]);

  // Group publications by type
  const groupedPublications = useMemo(() => {
    const groups: Record<string, typeof filteredPublications> = {};
    
    typeOrder.forEach((type) => {
      const pubs = filteredPublications.filter((pub) => pub.type === type);
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
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMobileNavOpen(false);
  };

  const typeFilters: { value: PublicationType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "journal", label: "Journal Articles" },
    { value: "working-paper", label: "Working Papers" },
    { value: "book-chapter", label: "Book Chapters" },
    { value: "report", label: "Reports" },
  ];

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
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Research & Publications | Tim Kautz" />
        <meta name="twitter:description" content="Browse Tim Kautz's research publications on noncognitive skills, education economics, and employment program evaluation." />
      </Helmet>
      <PublicationsStructuredData />
      <Layout>
        <section className="section-padding">
          <div className="container-wide">
            {/* Header */}
            <ScrollReveal className="text-center mb-12">
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Research
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                A collection of my research on skills development, education,
                employment programs, and quantitative methods.
              </p>
              <a
                href="https://scholar.google.com/citations?user=lf96MecAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <GraduationCap className="h-4 w-4" />
                View my Google Scholar profile for citation metrics
              </a>
            </ScrollReveal>

            {/* Filters */}
            <ScrollReveal delay={0.1} className="mb-10 space-y-4">
              {/* Search and Year Filter Row */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search publications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 min-h-[44px]"
                  />
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full sm:w-36 min-h-[44px]">
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
                    onClick={() => setSelectedType(filter.value)}
                    className="transition-all min-h-[40px]"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </ScrollReveal>

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Showing {filteredPublications.length} of {publications.length} publications
            </p>

            {/* Mobile TOC Dropdown */}
            <div className="lg:hidden mb-6">
              <DropdownMenu open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between min-h-[44px]">
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">Jump to:</span>
                      <span>
                        {activeSection ? typeLabels[activeSection as Publication["type"]] : "Select section"}
                      </span>
                    </span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", mobileNavOpen && "rotate-180")} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-md">
                  {Object.keys(groupedPublications).map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => scrollToSection(type)}
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
                        activeSection === type ? "text-primary-foreground/80" : "opacity-60"
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
                  <section key={type} id={`section-${type}`}>
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                      {typeLabels[type as Publication["type"]]}
                    </h2>
                    <motion.div layout className="flex flex-col gap-6">
                      <AnimatePresence mode="popLayout">
                        {pubs.map((pub, index) => (
                          <motion.div
                            key={pub.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                          >
                            <ResearchCard publication={pub} />
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
                initial={{ opacity: 0 }}
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
