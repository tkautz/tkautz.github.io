import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedResearch } from "@/components/home/FeaturedResearch";
import { PersonStructuredData, WebsiteStructuredData } from "@/components/seo/StructuredData";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Tim Kautz | Senior Researcher at Mathematica</title>
        <meta
          name="description"
          content="Tim Kautz is a Senior Researcher at Mathematica, specializing in noncognitive skills, education economics, and employment program evaluation."
        />
        {/* Open Graph */}
        <meta property="og:title" content="Tim Kautz | Senior Researcher at Mathematica" />
        <meta property="og:description" content="Tim Kautz is a Senior Researcher at Mathematica, specializing in noncognitive skills, education economics, and employment program evaluation." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/headshot-2.jpg" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tim Kautz | Senior Researcher at Mathematica" />
        <meta name="twitter:description" content="Tim Kautz is a Senior Researcher at Mathematica, specializing in noncognitive skills, education economics, and employment program evaluation." />
        <meta name="twitter:image" content="/images/headshot-2.jpg" />
      </Helmet>
      <PersonStructuredData />
      <WebsiteStructuredData />
      <Layout>
        <HeroSection />
        <AboutSection />
        <FeaturedResearch />
      </Layout>
    </>
  );
}
