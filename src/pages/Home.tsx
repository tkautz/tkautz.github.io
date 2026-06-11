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
        <title>Tim Kautz | Economist & Education Researcher</title>
        <meta
          name="description"
          content="Tim Kautz is an economist and Senior Researcher at Mathematica who studies noncognitive (social and emotional) skills — which skills matter, how to measure them, and how schools and programs can teach them."
        />
        {/* Open Graph */}
        <meta property="og:title" content="Tim Kautz | Economist & Education Researcher" />
        <meta property="og:description" content="Tim Kautz is an economist and Senior Researcher at Mathematica who studies noncognitive (social and emotional) skills — which skills matter, how to measure them, and how schools and programs can teach them." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tkautz.github.io/" />
        <meta property="og:image" content="https://tkautz.github.io/images/headshot-2.jpg" />
        <link rel="canonical" href="https://tkautz.github.io/" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tim Kautz | Economist & Education Researcher" />
        <meta name="twitter:description" content="Tim Kautz is an economist and Senior Researcher at Mathematica who studies noncognitive (social and emotional) skills — which skills matter, how to measure them, and how schools and programs can teach them." />
        <meta name="twitter:image" content="https://tkautz.github.io/images/headshot-2.jpg" />
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
