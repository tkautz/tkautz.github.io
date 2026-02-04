import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Check initial dark mode preference
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark") ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-lg border-b border-border/50",
        isScrolled
          ? "bg-background/90 shadow-sm py-3"
          : "bg-background/70 py-4"
      )}
      role="banner"
    >
      <div className="container-wide flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-xl sm:text-2xl font-semibold text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          aria-label="Tim Kautz - Home"
        >
          Tim Kautz
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors link-underline pb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
                location.pathname === link.href
                  ? "text-primary link-underline-active"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={location.pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="min-h-[44px] min-w-[44px]"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                <motion.div
                  key="sun"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Dark Mode Toggle - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="min-h-[44px] min-w-[44px]"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="min-h-[44px] min-w-[44px]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm md:hidden z-40"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ top: "0" }}
            />
            
            {/* Slide-in Menu */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-background border-l border-border shadow-2xl md:hidden z-50"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col h-full">
                {/* Close button */}
                <div className="flex justify-end p-4 border-b border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-[44px] min-w-[44px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Nav links */}
                <div className="flex-1 py-6 px-4 flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        to={link.href}
                        className={cn(
                          "block text-lg font-medium py-3 px-4 rounded-lg transition-colors min-h-[48px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          location.pathname === link.href
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        aria-current={location.pathname === link.href ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
