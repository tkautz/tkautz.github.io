import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Home } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Tim Kautz</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Layout>
        <section className="section-padding bg-muted/30">
          <div className="container-narrow flex min-h-[50vh] flex-col items-center justify-center text-center">
            <p className="font-display text-6xl sm:text-7xl font-bold text-foreground mb-4">
              404
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
              Page not found
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              The page you're looking for doesn't exist or may have moved.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button asChild size="lg" className="h-12 px-6">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to home
                </Link>
              </Button>
              <Link
                to="/research"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Browse my research
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default NotFound;
