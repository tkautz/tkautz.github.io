import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // Focus on the main content for screen readers
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Scroll to top of page"
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
