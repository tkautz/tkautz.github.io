#!/usr/bin/env python3
"""Fetch the total citation count from Google Scholar and update
src/data/scholar.json.

Fails safe by design: on any fetch problem, parse failure, or implausible
value (non-positive, or more than 50% different from the last known value),
the JSON is left untouched and the script exits 0, so the site keeps showing
the last known good number.
"""

import json
import re
import sys
from datetime import date
from pathlib import Path

import requests

PROFILE_URL = "https://scholar.google.com/citations?user=lf96MecAAAAJ&hl=en"
JSON_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "scholar.json"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


def fetch_count() -> int | None:
    try:
        resp = requests.get(PROFILE_URL, headers=HEADERS, timeout=30)
    except requests.RequestException as exc:
        print(f"Fetch failed: {exc}")
        return None
    if resp.status_code != 200:
        print(f"Fetch failed: HTTP {resp.status_code}")
        return None
    # Total citations is the first stats cell on the profile page:
    # <td class="gsc_rsb_std">12345</td>
    match = re.search(r'class="gsc_rsb_std">([\d,]+)<', resp.text)
    if not match:
        print("Could not find a citation count in the page")
        return None
    try:
        return int(match.group(1).replace(",", ""))
    except ValueError:
        print(f"Non-numeric citation value: {match.group(1)!r}")
        return None


def read_previous() -> int | None:
    if not JSON_PATH.exists():
        return None
    try:
        value = json.loads(JSON_PATH.read_text()).get("citations")
    except (json.JSONDecodeError, OSError):
        return None
    return value if isinstance(value, int) and value > 0 else None


def main() -> int:
    new_count = fetch_count()
    if new_count is None or new_count <= 0:
        print("No plausible citation count fetched; leaving scholar.json untouched")
        return 0

    previous = read_previous()
    if previous is not None:
        if abs(new_count - previous) / previous > 0.5:
            print(
                f"Implausible change {previous} -> {new_count}; "
                "leaving scholar.json untouched"
            )
            return 0
        if new_count == previous:
            print(f"Citation count unchanged ({previous}); nothing to do")
            return 0

    JSON_PATH.write_text(
        json.dumps(
            {"citations": new_count, "fetchedAt": date.today().isoformat()},
            indent=2,
        )
        + "\n"
    )
    print(f"Updated scholar.json: {previous} -> {new_count}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
