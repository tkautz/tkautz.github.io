import { ComponentType, Suspense, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

export interface SitePages {
  Home: ComponentType; Research: ComponentType; CV: ComponentType;
  Contact: ComponentType; Publication: ComponentType; NotFound: ComponentType;
}

function NavigationFocus() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current !== pathname && !hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      // Wait for a lazy route to commit before focusing its heading.
      const focus = () => {
        const heading = document.querySelector<HTMLElement>("main h1");
        if (!heading) return false;
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        return true;
      };
      const observer = new MutationObserver(() => { if (focus()) observer.disconnect(); });
      if (!focus()) observer.observe(document.getElementById("root")!, { childList: true, subtree: true });
      previousPath.current = pathname;
      return () => observer.disconnect();
    }
    previousPath.current = pathname;
  }, [pathname, hash]);
  return null;
}

export function Site({ pages: { Home, Research, CV, Contact, Publication, NotFound } }: { pages: SitePages }) {
  return <MotionConfig reducedMotion="user"><TooltipProvider>
    <Toaster />
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" role="status">Loading…</div>}>
      <NavigationFocus />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<Research />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/publications/:id" element={<Publication />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </TooltipProvider></MotionConfig>;
}
