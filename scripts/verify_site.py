"""Validate the built static site, metadata, links and unchanged PDF copies."""
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
ORIGIN = "https://timkautz.org"


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.tags = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def attrs(self, tag, **match):
        return [attrs for name, attrs in self.tags if name == tag and all(attrs.get(k) == v for k, v in match.items())]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    ids = re.findall(r'\bid: "([^"]+)"', (ROOT / "src/data/publications.ts").read_text(encoding="utf-8"))
    expected = {"/", "/research/", "/cv/", "/contact/", *(f"/publications/{uid}/" for uid in ids)}
    assert len(ids) == len(set(ids)), "Duplicate publication IDs"
    scholar_pdfs = json.loads((ROOT / "src/data/scholar-pdfs.json").read_text(encoding="utf-8"))
    assert set(scholar_pdfs) <= set(ids), "Unknown Scholar PDF publication"
    urls = [node.text for node in ElementTree.parse(DIST / "sitemap.xml").iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    assert len(urls) == len(set(urls)) and set(urls) == {ORIGIN + path for path in expected}, "Sitemap mismatch"
    pdf_count = 0
    for route in sorted(expected):
        file = DIST / route.lstrip("/") / "index.html"
        source = file.read_text(encoding="utf-8")
        page = Page(source)
        assert len(page.attrs("h1")) == len(page.attrs("title")) == 1, file
        assert len(page.attrs("meta", name="description")) == 1, file
        assert page.attrs("link", rel="canonical") == [{"data-rh": "true", "rel": "canonical", "href": ORIGIN + route}], file
        assert page.attrs("meta", property="og:url")[0]["content"] == ORIGIN + route, file
        assert not page.attrs("meta", name="robots"), file
        for script in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', source, re.S):
            json.loads(script)
        for tag, attrs in page.tags:
            value = attrs.get("href") if tag in ("a", "link") else attrs.get("src") if tag in ("img", "script") else None
            if value and value.startswith("/"):
                target = DIST / unquote(urlsplit(value).path).lstrip("/")
                if target.is_dir():
                    target /= "index.html"
                assert target.is_file(), f"Broken local link {value} on {route}"
        for meta in page.attrs("meta", name="citation_pdf_url"):
            copied = DIST / urlsplit(meta["content"]).path.lstrip("/")
            assert copied.parent == file.parent, "Scholar PDF must share the abstract's directory"
            legacy_url = next(a["href"] for a in page.attrs("a") if a.get("href", "").startswith("/documents/"))
            relative = unquote(legacy_url).lstrip("/")
            assert sha(DIST / relative) == sha(ROOT / "public" / relative), legacy_url
            uid = route.strip("/").split("/")[-1]
            optimized = scholar_pdfs.get(uid)
            if optimized:
                assert legacy_url == optimized["originalUrl"], uid
                assert sha(ROOT / "public" / relative) == optimized["originalSha256"], uid
                optimized_file = ROOT / "public" / optimized["optimizedUrl"].lstrip("/")
                assert sha(copied) == sha(optimized_file) == optimized["optimizedSha256"], uid
            else:
                assert sha(copied) == sha(ROOT / "public" / relative), legacy_url
            assert copied.stat().st_size < 5_000_000, f"Scholar PDF exceeds 5 MB: {uid}"
            pdf_count += 1
    assert 'content="noindex"' in (DIST / "404.html").read_text(encoding="utf-8"), "404 must be noindex"
    print(f"Verified {len(expected)} pages, sitemap, links, JSON-LD, {pdf_count} Scholar PDFs under 5 MB and unchanged original PDFs.")


if __name__ == "__main__":
    main()
