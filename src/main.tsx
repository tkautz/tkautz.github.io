import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
// Query parameters change the catalog at runtime; its static HTML is unfiltered.
// Unknown URLs on Pages use 404.html, whereas Vite preview falls back to Home.
const renderedPath = document.documentElement.dataset.renderedPath;
const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
if (root.hasChildNodes() && renderedPath === currentPath && !window.location.search) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
