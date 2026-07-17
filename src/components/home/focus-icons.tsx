// Custom icons for the Research Focus cards. Drawn to sit alongside lucide
// icons (24px grid, 1.75px round strokes) but specific to each research
// question: navy line work with a single amber (--accent) highlight.

interface FocusIconProps {
  className?: string;
}

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Which Skills Matter: scatter plot with a fitted line; the amber point is the skill that matters. */
export function WhichSkillsIcon({ className }: FocusIconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M3.5 3.5v17h17" />
      <path d="M6.5 16.5 20 7" strokeDasharray="0.1 3" />
      <circle cx="8.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="12.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="5.5" r="1.75" fill="currentColor" stroke="none" className="text-accent" />
    </svg>
  );
}

/** Measuring Skills: a ruler reading off the height of a bar; the amber tick is the measurement. */
export function MeasureSkillsIcon({ className }: FocusIconProps) {
  return (
    <svg {...svgProps} className={className}>
      <rect x="3.5" y="3" width="5" height="18" rx="1" />
      <path d="M3.5 7h2.5M3.5 11h2.5M3.5 15h2.5M3.5 19h2.5" />
      <rect x="14" y="9" width="6.5" height="12" rx="1" />
      <path d="M11 21V9" strokeDasharray="0.1 3" />
      <path d="M9.5 9H14" strokeWidth="2" className="text-accent" />
    </svg>
  );
}

/** Developing Skills: a seedling growing at the top of an upward staircase; the amber leaf is new growth. */
export function DevelopSkillsIcon({ className }: FocusIconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M3 21h5v-4h5v-4h5v-4h3" />
      <path d="M18.5 9V5.5" />
      <path d="M18.5 7c-2.4 0-3.4-1.4-3.6-3.3 2.4 0 3.4 1.4 3.6 3.3Z" />
      <path
        d="M18.5 5.5c0-1.9 1-3.2 3.3-3.2-.2 1.9-1.1 3.2-3.3 3.2Z"
        fill="currentColor"
        className="text-accent"
      />
    </svg>
  );
}

/** Evidence for Practice: a research report with an amber seal of approval. */
export function EvidenceIcon({ className }: FocusIconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M15 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6" />
      <path d="M7 8h7M7 11.5h7M7 15h4" />
      <circle cx="17" cy="17" r="4" className="text-accent" />
      <path d="m15.4 17 1.2 1.2 2-2.2" className="text-accent" />
    </svg>
  );
}
