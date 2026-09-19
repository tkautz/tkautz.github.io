import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { Site } from "./Site";
import Home from "./pages/Home";
import Research from "./pages/Research";
import CV from "./pages/CV";
import Contact from "./pages/Contact";
import Publication from "./pages/Publication";
import NotFound from "./pages/NotFound";
export { publications } from "./data/publications";
export { publicationPath, publicationPdfPath, SITE_URL } from "./lib/publications";

export function render(url: string) {
  const context = {} as { helmet: HelmetServerState };
  const body = renderToString(<HelmetProvider context={context}>
    <StaticRouter location={url}><Site pages={{ Home, Research, CV, Contact, Publication, NotFound }} /></StaticRouter>
  </HelmetProvider>);
  const { helmet } = context;
  return { body, head: helmet.title.toString() + helmet.meta.toString() + helmet.link.toString() + helmet.script.toString() };
}
