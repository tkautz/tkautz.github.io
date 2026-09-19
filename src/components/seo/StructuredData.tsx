import { Helmet } from "react-helmet-async";
import { publications } from "@/data/publications";
import { publicationUrl } from "@/lib/publications";

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
  url = "https://timkautz.org/",
  sameAs = [
    "https://www.linkedin.com/in/tkautz",
    "https://scholar.google.com/citations?user=lf96MecAAAAJ&hl=en",
  ],
  image = "https://timkautz.org/images/headshot-2.jpg",
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
      "Social and Emotional Learning",
      "Skill Measurement",
      "Education Economics",
      "Education Policy",
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
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Research Publications by Tim Kautz",
    url: "https://timkautz.org/research/",
    description: "Academic publications on noncognitive skills, education economics, and employment program evaluation.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: publications.map((pub, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: publicationUrl(pub),
        name: pub.title,
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
    url: "https://timkautz.org/",
    description: "Professional website of Tim Kautz, an economist and Senior Researcher at Mathematica who studies social and emotional (noncognitive) skills: which skills matter, how to measure them, and how to improve them.",
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
