// Custom icons shared across pages (CV sections, Scholar links, contact
// methods). Same language as the home focus icons: 24px grid, 1.75px round
// strokes, navy line work with a single amber (--accent) highlight.

type SiteIconProps = React.SVGProps<SVGSVGElement>;

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Google Scholar / Education: mortarboard with an amber tassel. */
export function ScholarIcon(props: SiteIconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M12 4.5 2.5 9l9.5 4.5L21.5 9 12 4.5Z" />
      <path d="M6.5 11.5v3.8c0 1.5 2.46 2.7 5.5 2.7s5.5-1.2 5.5-2.7v-3.8" />
      <path d="M21.5 9v5" className="text-accent" />
      <circle cx="21.5" cy="15.9" r="1.1" fill="currentColor" stroke="none" className="text-accent" />
    </svg>
  );
}

/** Current Position: ID badge with an amber clip. */
export function PositionIcon(props: SiteIconProps) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="5.5" y="6" width="13" height="14.5" rx="1.75" />
      <circle cx="12" cy="11.75" r="2.25" />
      <path d="M8.5 17.5c.7-1.55 1.9-2.35 3.5-2.35s2.8.8 3.5 2.35" />
      <rect x="10" y="3.5" width="4" height="4" rx="1" className="text-accent" />
    </svg>
  );
}

/** Affiliations: a network of institutions around an amber home node. */
export function AffiliationsIcon(props: SiteIconProps) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="12" cy="12" r="2.5" className="text-accent" />
      <circle cx="4.75" cy="5.75" r="1.9" />
      <circle cx="19.25" cy="5.75" r="1.9" />
      <circle cx="12" cy="20" r="1.9" />
      <path d="M6.3 7.2 10 9.9M17.7 7.2 14 9.9M12 14.5v3.6" />
    </svg>
  );
}

/** Previous Positions: a career timeline, milestones leading to an amber now. */
export function TimelineIcon(props: SiteIconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M2.75 12h16.5" />
      <path d="m16.75 8.25 3.75 3.75-3.75 3.75" />
      <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.9" fill="currentColor" stroke="none" className="text-accent" />
    </svg>
  );
}

/** Funding, Fellowships & Awards: a medal with an amber star. */
export function AwardsIcon(props: SiteIconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M7.75 3.5h8.5" />
      <path d="M7.75 3.5 10.4 9.4M16.25 3.5 13.6 9.4" />
      <circle cx="12" cy="14.5" r="5.25" />
      <path
        d="M12 11.6l.71 1.93 2.05.07-1.62 1.27.56 1.98L12 15.7l-1.7 1.15.56-1.98-1.62-1.27 2.05-.07Z"
        fill="currentColor"
        stroke="none"
        className="text-accent"
      />
    </svg>
  );
}

/** Professional Service: reviewing a manuscript with an amber pen. */
export function ServiceIcon(props: SiteIconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M12.5 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6.5" />
      <path d="M7 8h7M7 11.5h7M7 15h4" />
      <path d="M20.5 13.75 15.1 19.15" className="text-accent" />
      <path
        d="m13 21.25.7-2.6 1.9 1.9-2.6.7Z"
        fill="currentColor"
        stroke="none"
        className="text-accent"
      />
    </svg>
  );
}

/** Skills: a terminal with an amber cursor (Stata, R, and friends). */
export function SkillsIcon(props: SiteIconProps) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 8.5h18" />
      <path d="m7.5 11.75 2.75 2.25-2.75 2.25" />
      <path d="M13.25 16.25h3.25" strokeWidth="2" className="text-accent" />
    </svg>
  );
}

/** Selected Presentations: an easel chart with an amber headline bar. */
export function PresentationsIcon(props: SiteIconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M3 4.25h18" />
      <path d="M4.75 4.25V14a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2V4.25" />
      <path d="m8.25 20.75 3.75-4.75 3.75 4.75" />
      <path d="M8.5 12.5V10.25M12 12.5V8.75" />
      <path d="M15.5 12.5V7.25" strokeWidth="2" className="text-accent" />
    </svg>
  );
}

/** Email: an envelope with an amber flap. */
export function MailIcon(props: SiteIconProps) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="2.75" y="5" width="18.5" height="14" rx="2" />
      <path d="m2.75 7.5 8.07 5.38a2 2 0 0 0 2.36 0l8.07-5.38" className="text-accent" />
    </svg>
  );
}

/** Location: a map pin centered on an amber point. */
export function MapPinIcon(props: SiteIconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M19.5 10c0 4.9-7.5 11.5-7.5 11.5S4.5 14.9 4.5 10a7.5 7.5 0 0 1 15 0Z" />
      <circle cx="12" cy="10" r="2.25" className="text-accent" />
    </svg>
  );
}
