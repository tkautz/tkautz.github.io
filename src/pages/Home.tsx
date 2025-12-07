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
