"""Offline regression tests; never read or write the real Scholar data file."""
import json
import unittest
from datetime import date
from unittest.mock import Mock, patch

import requests
import update_citations as updater


class CitationUpdateTests(unittest.TestCase):
    def run_update(self, count):
        path = Mock()
        path.exists.return_value = True
        path.read_text.return_value = json.dumps({"citations": 10000, "fetchedAt": "2026-08-03"})
        with patch.object(updater, "JSON_PATH", path), patch.object(updater, "fetch_count", return_value=count):
            result = updater.main()
        return result, path

    def test_failed_or_implausible_fetch_preserves_file_and_fails(self):
        for count in (None, 0, -1, 15001, 4999):
            with self.subTest(count=count):
                result, path = self.run_update(count)
                self.assertEqual(result, 1)
                path.write_text.assert_not_called()

    def test_unchanged_and_changed_counts_refresh_verification_date(self):
        for count in (10000, 10001):
            with self.subTest(count=count):
                result, path = self.run_update(count)
                self.assertEqual(result, 0)
                value = json.loads(path.write_text.call_args.args[0])
                self.assertEqual(value, {"citations": count, "fetchedAt": date.today().isoformat()})

    def test_network_failures_and_malformed_html(self):
        cases = [Mock(status_code=403, text="Blocked"), Mock(status_code=200, text="Challenge")]
        for response in cases:
            with patch.object(updater.requests, "get", return_value=response):
                self.assertIsNone(updater.fetch_count())
        with patch.object(updater.requests, "get", side_effect=requests.Timeout):
            self.assertIsNone(updater.fetch_count())

    def test_total_count_is_first_stats_cell(self):
        response = Mock(status_code=200, text='<td class="gsc_rsb_std">10,002</td><td class="gsc_rsb_std">500</td>')
        with patch.object(updater.requests, "get", return_value=response):
            self.assertEqual(updater.fetch_count(), 10002)


if __name__ == "__main__":
    unittest.main()
