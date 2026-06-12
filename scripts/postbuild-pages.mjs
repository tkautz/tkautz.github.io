// GitHub Pages serves static files only: without these copies, a direct
// visit to /research, /cv, or /contact returns GitHub's default 404
// instead of the app (BrowserRouter routes exist only client-side).
// Each route gets a real index.html (HTTP 200), and 404.html catches
// everything else so unknown URLs still load the app's NotFound page.
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const dist = path.resolve(import.meta.dirname, "../dist");
const index = path.join(dist, "index.html");

const routes = ["research", "cv", "contact"];

copyFileSync(index, path.join(dist, "404.html"));
for (const route of routes) {
  const dir = path.join(dist, route);
  mkdirSync(dir, { recursive: true });
  copyFileSync(index, path.join(dir, "index.html"));
}

console.log(`postbuild: wrote 404.html and ${routes.map((r) => `${r}/index.html`).join(", ")}`);
