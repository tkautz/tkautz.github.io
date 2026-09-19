import { lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Site } from "./Site";
import Home from "./pages/Home";

// Lazy-load non-critical pages for faster initial page load
const Research = lazy(() => import("./pages/Research"));
const CV = lazy(() => import("./pages/CV"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Publication = lazy(() => import("./pages/Publication"));

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <Site pages={{ Home, Research, CV, Contact, Publication, NotFound }} />
    </BrowserRouter>
  </HelmetProvider>
);

export default App;
