// Render the same React pages at build time. GitHub Pages needs no Node server.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
process.env.NODE_ENV = "production";
const { render, publications, publicationPath, publicationPdfPath, SITE_URL } = await import("../node_modules/.cache/site-ssr/entry-server.js");

const dist = path.resolve(import.meta.dirname, "../dist");
const template = readFileSync(path.join(dist, "index.html"), "utf8")
  .replace(/<title>[^<]*<\/title>/, "")
  .replace(/<meta name="description"[^>]*>/, "");
const routes = ["/", "/research/", "/cv/", "/contact/", ...publications.map(publicationPath)];
if (new Set(routes).size !== routes.length) throw new Error("Duplicate page paths");
for (const route of [...routes, "/404.html"]) {
  const { head, body } = render(route);
  const html = template.replace('<html lang="en">', `<html lang="en" data-build-year="${new Date().getFullYear()}" data-rendered-path="${route.replace(/\/$/, "") || "/"}">`)
    .replace("</head>", `${head}</head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
  const file = path.join(dist, route === "/404.html" ? "404.html" : `${route.slice(1)}index.html`);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html);
}
for (const pub of publications) {
  if (pub.pdfUrl) copyFileSync(path.join(dist, decodeURI(pub.pdfUrl)), path.join(dist, publicationPdfPath(pub)));
}
writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${SITE_URL}${route}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`postbuild: rendered ${routes.length} pages, 404.html, publication PDF copies, and sitemap.xml`);
