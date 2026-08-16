# The Tree of Writing

An interactive atlas of **164 documented writing systems**. The project traces proposed genealogies from the earliest independent inventions through later alphabets, abugidas, syllabaries, logographies, and modern community-led scripts. It is a static React application built as three linked manuscript plates.

| Plate | Purpose |
|---|---|
| **Plate I — Radial Genealogy** | A zoomable radial tree; lineage certainty, date filtering, search, and node-level detail. |
| **Plate II — Specimen Sheet** | A poster-like gallery of 148 Unicode-renderable examples, arrangeable by descent, date, or typology. |
| **Plate III — Essay** | A companion account of independent invention, descent, orthographic structure, material history, and undeciphered systems. |

## Explore and cite

Every script can be linked directly from either Plate I or Plate II:

```text
/?script=devanagari
/specimens?script=georgian
/?script=devanagari&inventory=1
```

The first two open the appropriate script leaf. The `inventory=1` modifier expands its Unicode character inventory. The link icon at the head of a script leaf copies that URL.

The **Download poster PDF** action on Plate II creates a client-side broadside PDF. It rasterises the already-rendered type specimens rather than trying to substitute text fonts in a PDF layer; this preserves specialist Unicode specimens consistently.

## Data and specimen policy

The corpus is in `client/src/data/`. Each script records its historical relationships, date range, typology, direction, regions, languages, sources, sample, endonym, and display font hint.

Specimens follow a strict order of evidence. The script writing its own name is preferred; an attested word or canonical letter series is used where an autonym is unavailable; a script that cannot be represented honestly is explicitly marked rather than given a fabricated glyph.

`gen_inventories.py` produces `client/src/data/inventories.ts` from Unicode’s `Scripts.txt`, `UnicodeData.txt`, and `PropertyValueAliases.txt`. It includes only assigned codepoints, groups them by character role, and lazy-loads the data only when a reader opens a character inventory.

## Development

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
```

`scripts/test-poster-download.mjs` is an end-to-end Chromium test for the Plate II PDF. It confirms that the download is a valid PDF without adding test output to the repository.

## Verification notes

- **Corpus validation:** `python3 /home/ubuntu/validate_corpus.py`
- **Specimen coverage:** `node scripts/specimen-coverage.mjs`
- **Poster acceptance test:** `node scripts/test-poster-download.mjs`

## Sources and limits

Each individual record includes a primary source link; external research notes are retained in the working history. Genealogical edges deliberately distinguish attested descent, probable descent, disputed descent, and stimulus diffusion. The atlas does not present uncertain relationships as settled fact.

The app uses the Scriptorium Vellum visual language: vellum ground, iron-gall ink hierarchy, disciplined rubric vermilion, and a Cormorant / EB Garamond / JetBrains Mono typographic system.
