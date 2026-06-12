import { ReactNode } from "react";

// These wrappers previously animated content into view on scroll. The site now
// renders content immediately; they remain as plain containers so existing
// call sites keep working, and the unused animation props are accepted but
// ignored.

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  return <div className={className}>{children}</div>;
}

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerChildren({ children, className = "" }: StaggerChildrenProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
