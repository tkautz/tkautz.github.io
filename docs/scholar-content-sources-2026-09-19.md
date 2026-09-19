# Scholar content corrections

The original `src/data/publications.ts` and all original PDFs remain unchanged. A separate `publication-abstracts.json` supplement holds complete source abstracts, their PDF paths and one-based source-page numbers. The existing checked-in catalog is the before-state for each entry; removing a supplement entry restores the prior text.

## Abstract review

- All 12 journal records now have complete abstracts taken from their linked PDFs, including the previously missing BMJ abstract.
- Two chapter records and the 2017 Asymdystopia working paper also have complete abstracts from their linked PDFs. The 2021 personality chapter links to a 2019 working-paper PDF; that source version is explicitly labeled.
- Two journal abstracts were already complete apart from typography. Twelve existing abstracts needed substantive restoration; one was missing. Every extraction is limited to a single explicit publication/page/start/end range. No generated summaries were substituted for author text.
- PDF line wrapping, split words, ligatures and citation superscripts were normalized for HTML. Source wording and numerical findings were preserved.
- The remaining 22 existing descriptions are labeled **Summary**, without asserting that they are full author-written abstracts. The full PDFs remain accessible. A search of the first 12 PDF pages found no formal abstract heading for these records, but this is not proof that no abstract exists elsewhere.
- The edited volume has no author-written abstract or full PDF in the repository; its existing publisher link remains. No publisher blurb was invented as an abstract.
- The work in progress has no source abstract or PDF in the repository. An [SSRN paper by the same four authors](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5205760), dated April 4, 2025, uses the different title *Declines in GPA During Remote Schooling Are Steepest for the Most Vulnerable Students*. This is a likely updated version, but needs author confirmation before replacing the older record or assigning that version's abstract to it.

## PDF distribution copy

`public/scholar-pdfs/deke-wei-kautz-2021.pdf` is a lossless compressed copy of the original Asymdystopia article. It is **3,314,412 bytes**, down from **5,263,785 bytes**. All **35 pages** have identical extracted text and rendered pixels at the checked resolution. The copy's article page was also visually inspected.

The build places this smaller file at `/publications/deke-wei-kautz-2021/paper.pdf`, the same-directory URL used by `citation_pdf_url`. The original `/documents/` download remains unchanged. All other publication PDF copies remain byte-identical to their originals. The original/output SHA-256 hashes are recorded in `src/data/scholar-pdfs.json`, and `verify_site.py` checks them along with the 5 MB size limit.

To repeat the lossless check, install PyMuPDF if needed and run `python scripts/verify_scholar_pdfs.py`. To reproduce compression on a new copy, use PyMuPDF's `Document.save` with `garbage=4`, `deflate=True`, `deflate_images=True`, `deflate_fonts=True`, and `use_objstms=1`; never save over the original. Byte hashes may differ between library versions, so review any replacement and repeat the text/render comparisons before updating the manifest.

These changes support [Google Scholar's inclusion requirements](https://scholar.google.com/intl/en/scholar/inclusion.html). Inclusion and recrawl timing remain Google's decision.

## Validation

- Production build, application/configuration TypeScript checks, lint and 43-page static verification passed. Lint retains two pre-existing Fast Refresh warnings.
- Browser regression selection: 83 passed and one device-specific skip on the first run. Two assertions incorrectly assumed that a literal `[` could never occur in an abstract; the restored remote-schooling abstract contains `[ES]`. The corrected desktop/mobile regressions both passed. All 85 applicable selected tests are passing across those runs.
- All 39 publication pages were inspected by the regression suite with JavaScript disabled. Checks cover canonical/citation metadata, complete available text, links, navigation/hydration, research search/filter behavior, narrow layouts, and WCAG A/AA automated checks.
- All 15 abstract transcriptions match their source-page text after typography/line-break normalization. All 35 pages of the compressed PDF retain identical text and rendered pixels.
