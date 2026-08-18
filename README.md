# The Tree of Writing

An interactive atlas of **164 documented writing systems**. The project traces proposed genealogies from the earliest independent inventions through later alphabets, abugidas, syllabaries, logographies, and modern community-led scripts. It is a static React application built as four linked manuscript plates.

| Plate | Purpose |
|---|---|
| **Plate I — Radial Genealogy** | A zoomable radial tree; lineage certainty, date filtering, search, and node-level detail. |
| **Plate II — Specimen Sheet** | A poster-like gallery of 148 Unicode-renderable examples, arrangeable by descent, date, or typology. |
| **Plate III — Essay** | A companion account of independent invention, descent, orthographic structure, material history, and undeciphered systems. |
| **Plate IV — Geographic Origins** | A searchable historical atlas locating 160 scripts at a documented site, regional centroid, or broad cultural zone, with four deliberately withheld where a single point would overstate the evidence. Dense points expand on zoom; a ten-route register distinguishes documented transmission, qualified proposals, and cultural adaptation. |

## Explore and cite

Every script can be linked directly from either Plate I or Plate II:

```text
/writing/?script=devanagari
/writing/specimens?script=georgian
/writing/origins?script=cuneiform
/writing/?script=devanagari&inventory=1
```

Live: [datapoems.io/writing/](https://datapoems.io/writing/) (canonical), and the same build at `/writing/` on [lukesteuber.com](https://lukesteuber.com/writing/), [world-languages.com](https://world-languages.com/writing/) and [diachronica.com](https://diachronica.com/writing/). Local `pnpm dev` still serves these paths at the site root.

The first two open the appropriate script leaf. The `inventory=1` modifier expands its Unicode character inventory. The link icon at the head of a script leaf copies that URL.

The **Download poster PDF** action on Plate II creates a client-side broadside PDF. It rasterises the already-rendered type specimens rather than trying to substitute text fonts in a PDF layer; this preserves specialist Unicode specimens consistently.

## Data and specimen policy

The corpus is in `client/src/data/`. Each script records its historical relationships, date range, typology, direction, regions, languages, sources, sample, endonym, and display font hint.

Specimens follow a strict order of evidence. First choice is the script writing its own name; where no autonym exists, an attested word or canonical letter series stands in; and a script that cannot be rendered honestly says so on the sheet rather than carrying a fabricated glyph.

`gen_inventories.py` produces `client/src/data/inventories.ts` from Unicode’s `Scripts.txt`, `UnicodeData.txt`, and `PropertyValueAliases.txt`. It includes only assigned codepoints, groups them by character role, and lazy-loads the data only when a reader opens a character inventory.

`client/src/data/origins.ts` contains the Plate IV geographic record. A coordinate means **historical development or first secure attestation**, not modern territory or the full geographic extent of use. `site`, `region`, and `broad` make the level of geographical claim explicit; `withheld` is used where an origin cannot responsibly be collapsed into one point. See `research/geographic-origin-policy.md` for the evidence policy and the sources that frame it.

`client/src/data/routes.ts` holds the deliberately small historical corridor register. Lines on Plate IV are **not borders, migration tracks, or universal explanations**. Their solid, dashed, and dotted styles respectively indicate attested transmission, a qualified proposal, and cultural adaptation; each route opens a note and a source link. See `research/transmission-route-policy.md` for the claims, dating, and source basis.

## Development

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
```

Production `vite` `base` is `/writing/` (`VITE_BASE_PATH`). Override with `VITE_BASE_PATH=/` for a root-hosted build.

## Deploy

On drummer the checkout is `/home/coolhand/projects/orthography`. Caddy serves `dist/public` at `/writing/` on datapoems.io, lukesteuber.com, world-languages.com and diachronica.com through one shared `writing_spa` snippet in `~/admin/Caddyfile`; the Sign-Language Atlas (`lukeslp/sign-language-atlas`) sits beside it at `/sign/` on the same four hosts. Rebuild and publish with:

```bash
~/bin/deploy-writing.sh
```

A systemd timer (`writing-deploy.timer`) fast-forwards `main` and rebuilds when origin moves. It will not overwrite a dirty tree. `client/public/media/radial-card.jpg` is a 2400x1260 render of Plate I; the world-languages.com index uses it as the tile for this atlas.

`scripts/test-poster-download.mjs` is an end-to-end Chromium test for the Plate II PDF. It confirms that the download is a valid PDF without adding test output to the repository.

## Verification notes

- **Corpus validation:** `python3 /home/ubuntu/validate_corpus.py`
- **Specimen coverage:** `node scripts/specimen-coverage.mjs`
- **Poster acceptance test:** `node scripts/test-poster-download.mjs`
- **Origin-coordinate completeness:** `node --import tsx scripts/validate-origin-research.mjs`
- **Origin data generation:** `node --import tsx scripts/generate-origin-data.mjs`
- **Cluster and route interaction acceptance test:** `node scripts/test-origin-map.mjs`

## Sources and limits

Each record links its primary source; the working history keeps the external research notes. Genealogical edges deliberately distinguish attested descent, probable descent, disputed descent, and stimulus diffusion. The atlas does not present uncertain relationships as settled fact.

The app uses the Scriptorium Vellum visual language: vellum ground, iron-gall ink hierarchy, disciplined rubric vermilion, and a Cormorant / EB Garamond / JetBrains Mono typographic system.
