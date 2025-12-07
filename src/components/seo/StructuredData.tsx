import { Helmet } from "react-helmet-async";
import { publications } from "@/data/publications";

interface PersonStructuredDataProps {
  name?: string;
  jobTitle?: string;
  organization?: string;
  email?: string;
  url?: string;
  sameAs?: string[];
  image?: string;
}

export function PersonStructuredData({
  name = "Tim Kautz",
  jobTitle = "Senior Researcher",
  organization = "Mathematica",
  email = "tkautz@mathematica-mpr.com",
  url = "https://timkautz.com",
  sameAs = [
    "https://www.linkedin.com/in/tkautz",
    "https://scholar.google.com/citations?user=lf96MecAAAAJ&hl=en",
  ],
  image = "/images/headshot-2.jpg",
}: PersonStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    worksFor: {
      "@type": "Organization",
      name: organization,
    },
    email,
    url,
    sameAs,
    image,
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Stanford University",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "University of Chicago",
      },
    ],
    knowsAbout: [
      "Noncognitive Skills",
      "Education Economics",
      "Employment Programs",
      "Program Evaluation",
      "Quantitative Methods",
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

export function PublicationsStructuredData() {
  const journalArticles = publications.filter((pub) => pub.type === "journal");
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Research Publications by Tim Kautz",
    description: "Academic publications on noncognitive skills, education economics, and employment program evaluation.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: journalArticles.slice(0, 10).map((pub, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "ScholarlyArticle",
          headline: pub.title,
          author: pub.authors.replace(/\*\*/g, "").split(", ").map((author) => ({
            "@type": "Person",
            name: author.trim(),
          })),
          datePublished: pub.year.toString(),
          isPartOf: pub.journal ? {
            "@type": "Periodical",
            name: pub.journal.split(",")[0],
          } : undefined,
          description: pub.abstract,
        },
      })),
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tim Kautz",
    url: "https://timkautz.com",
    description: "Professional website of Tim Kautz, Senior Researcher at Mathematica specializing in noncognitive skills and education economics.",
    author: {
      "@type": "Person",
      name: "Tim Kautz",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
