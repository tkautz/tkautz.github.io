"""Check lossless Scholar distribution copies. Requires PyMuPDF; originals are read-only."""
import hashlib
import json
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent


def main():
    manifest = json.loads((ROOT / "src/data/scholar-pdfs.json").read_text(encoding="utf-8"))
    for uid, entry in manifest.items():
        original = ROOT / "public" / entry["originalUrl"].lstrip("/")
        copy = ROOT / "public" / entry["optimizedUrl"].lstrip("/")
        assert hashlib.sha256(original.read_bytes()).hexdigest() == entry["originalSha256"], uid
        assert hashlib.sha256(copy.read_bytes()).hexdigest() == entry["optimizedSha256"], uid
        assert copy.stat().st_size == entry["optimizedBytes"] < 5_000_000, uid
        with fitz.open(original) as before, fitz.open(copy) as after:
            assert len(before) == len(after) == entry["pages"], uid
            for page_number, (a, b) in enumerate(zip(before, after), 1):
                assert a.get_text() == b.get_text(), (uid, page_number, "text changed")
                assert a.get_pixmap().samples == b.get_pixmap().samples, (uid, page_number, "render changed")
        print(f"{uid}: {entry['pages']} pages retain identical text and rendered pixels; {entry['optimizedBytes']:,} bytes")


if __name__ == "__main__":
    main()
