import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Authors } from "@/components/research/Authors";
import { PublicationActions } from "@/components/research/PublicationActions";
import { publications, publicationTypes } from "@/data/publications";
import { publicationAuthors, publicationUrl, publicationPdfPath, SITE_URL } from "@/lib/publications";
import NotFound from "./NotFound";
import { publicationDois } from "@/data/publication-dois";

export default function Publication() {
  const { id } = useParams();
  const pub = publications.find(item => item.id === id);
  if (!pub) return <NotFound />;
  const url = publicationUrl(pub);
  const authors = publicationAuthors(pub);
  const doi = publicationDois[pub.id];
  const description = pub.abstract ?? `${pub.title}. ${pub.authors.replace(/\*\*/g, "")}. ${pub.year}.${pub.journal ? ` ${pub.journal}.` : ""}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": pub.type === "edited-volume" ? "Book" : pub.type === "report" ? "Report" : "ScholarlyArticle",
    name: pub.title, headline: pub.title, url,
    [pub.type === "edited-volume" ? "editor" : "author"]: authors.map(name => ({ "@type": "Person", name })),
    datePublished: String(pub.year), abstract: pub.abstract,
    ...(doi ? { sameAs: `https://doi.org/${doi}`, identifier: { "@type": "PropertyValue", propertyID: "DOI", value: doi } } : {}),
    ...(pub.pdfUrl ? { encoding: { "@type": "MediaObject", encodingFormat: "application/pdf", contentUrl: `${SITE_URL}${publicationPdfPath(pub)}` } } : {}),
  };
  return <>
    <Helmet>
      <title>{pub.title} | Tim Kautz</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={pub.title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pub.title} />
      <meta name="twitter:description" content={description} />
      <meta name="citation_title" content={pub.title} />
      {authors.map(name => <meta key={name} name={pub.type === "edited-volume" ? "citation_editor" : "citation_author"} content={name} />)}
      <meta name="citation_publication_date" content={String(pub.year)} />
      {doi && <meta name="citation_doi" content={doi} />}
      {pub.type === "journal" && pub.journal && <meta name="citation_journal_title" content={pub.journal.split(",")[0]} />}
      {pub.pdfUrl && <meta name="citation_pdf_url" content={`${SITE_URL}${publicationPdfPath(pub)}`} />}
      <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
    </Helmet>
    <Layout>
      <section className="section-padding bg-muted/30">
        <article className="container-wide max-w-4xl">
          <Link to="/research/" className="inline-flex items-center gap-2 text-sm text-primary underline underline-offset-4 mb-8"><ArrowLeft className="h-4 w-4" />All publications</Link>
          <p className="text-sm text-muted-foreground mb-4">{publicationTypes[pub.type].label} · {pub.year}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">{pub.title}</h1>
          <p className="text-muted-foreground mb-4"><Authors text={pub.authors} /></p>
          {pub.journal && <p className="italic text-foreground/75 mb-8">{pub.journal}</p>}
          {pub.abstract && <section aria-labelledby="abstract-heading" className="mb-8">
            <h2 id="abstract-heading" className="font-display text-2xl font-semibold mb-4">Abstract</h2>
            <p className="text-muted-foreground leading-relaxed">{pub.abstract}</p>
          </section>}
          <PublicationActions publication={pub} />
        </article>
      </section>
    </Layout>
  </>;
}
