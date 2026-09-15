# The Tree of Writing

An interactive atlas of **164 documented writing systems**. The project traces proposed genealogies from the earliest independent inventions through later alphabets, abugidas, syllabaries, logographies, and modern community-led scripts. It is a static React application built as four linked manuscript plates.

| Plate | Purpose |
|---|---|
| **Plate I: Radial Genealogy** | A zoomable radial tree; lineage certainty, date filtering, search, and node-level detail. |
| **Plate II: Specimen Sheet** | A poster-like gallery of 148 Unicode-renderable examples, arrangeable by descent, date, or typology. |
| **Plate III: Essay** | A companion account of independent invention, descent, orthographic structure, material history, and undeciphered systems. |
| **Plate IV: Geographic Origins** | A searchable historical atlas locating 160 scripts at a documented site, regional centroid, or broad cultural zone, with four deliberately withheld where a single point would overstate the evidence. Dense points expand on zoom; a ten-route register distinguishes documented transmission, qualified proposals, and cultural adaptation. |

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

`client/src/data/inventories.ts` was generated from Unicode’s `Scripts.txt`, `UnicodeData.txt`, and `PropertyValueAliases.txt`. It includes only assigned codepoints, groups them by character role, and loads the data only when a reader opens a character inventory.

`client/src/data/origins.ts` contains the Plate IV geographic record. A coordinate means **historical development or first secure attestation**, not modern territory or the full geographic extent of use. `site`, `region`, and `broad` make the level of geographical claim explicit; `withheld` is used where an origin cannot responsibly be collapsed into one point. See `research/geographic-origin-policy.md` for the evidence policy and the sources that frame it.

`client/src/data/routes.ts` holds the deliberately small historical corridor register. Lines on Plate IV are **not borders, migration tracks, or universal explanations**. Their solid, dashed, and dotted styles respectively indicate attested transmission, a qualified proposal, and cultural adaptation; each route opens a note and a source link. See `research/transmission-route-policy.md` for the claims, dating, and source basis.

## Development

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
```

The repository is a plain Vite + React app: `client/` is the Vite root, `client/src/data/` holds the corpus, and `scripts/` holds the generators and tests. Nothing runs on a server. `client/src/components/ui/` contains only the four interface primitives the plates use.

Production `vite` `base` is `/writing/` (`VITE_BASE_PATH`). Override with `VITE_BASE_PATH=/` for a root-hosted build.

## Host a build

`pnpm build` writes a static site to `dist/public/`. Serve that directory at
`/writing/`, with unknown page paths falling back to `index.html` so direct links
work. To host at the domain root, build with `VITE_BASE_PATH=/ pnpm build`.

`pnpm preview` serves the production build locally. It is a preview server,
not a production hosting service.

## Verification notes

- **Corpus type-check:** `pnpm check` (the corpus is TypeScript)
- **Specimen coverage:** `node scripts/specimen-coverage.mjs`
- **Origin-coordinate completeness:** `node --import tsx scripts/validate-origin-research.mjs`
- **Origin data generation:** `node --import tsx scripts/generate-origin-data.mjs`
- **Browser acceptance tests:** `node scripts/test-poster-download.mjs` (Plate II PDF) and `node scripts/test-origin-map.mjs` (Plate IV clusters and routes). Both take `ATLAS_URL` (origin plus base path, no trailing slash; default `http://localhost:3000` for `pnpm dev`) and `CHROMIUM_PATH` (default `/usr/bin/chromium`). Against a production build: `pnpm build && pnpm preview`, then `ATLAS_URL=http://127.0.0.1:4173/writing node scripts/test-poster-download.mjs`.

The poster export builds its broadside in an isolated iframe and copies only the Google Fonts stylesheets into it. The app's own sheet uses OKLCH tokens that html2canvas 1.4 cannot parse; in `vite dev` that sheet is inline, so the failure only ever showed in production builds.

## Sources and limits

Records include source links; the geographic and transmission policies explain how those sources support the map. Some references are secondary summaries. Genealogical edges deliberately distinguish attested descent, probable descent, disputed descent, and stimulus diffusion. Read those edge categories alongside each record's sources; they describe the current interpretation, which may need revision.

The default theme pairs a vellum-colored background with dark ink and red accents. Typefaces include Cormorant, EB Garamond, and JetBrains Mono.

## Midnight gallery plate

`?theme=midnight` opens the dark blue treatment used by World Languages;
`?theme=vellum` keeps the manuscript treatment. The corner theme control switches
between them. `?bare=1&theme=midnight` removes the surrounding interface while
using the same radial renderer. Capture this at 2400×1260, JPEG quality 92, for
`client/public/media/radial-card-midnight.jpg`. The original vellum card remains.

## License and attribution

Original application code is [MIT licensed](LICENSE), copyright Luke Steuber.
Unicode data, bundled fonts, and other third-party materials retain their own
terms. See [THIRD_PARTY.md](THIRD_PARTY.md) for sources and asset
provenance. A source citation does not grant permission to redistribute its
text or images.
