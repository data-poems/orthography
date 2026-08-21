# Working notes: The Tree of Writing

## Corpus state (validated)
164 scripts plus a conceptual `root`. 26 scripts hang directly from root
(independent inventions and stimulus-diffusion creations). Run `pnpm check` to
validate the TypeScript corpus.

By family: brahmic 67, sinitic 19, aramaic 18, independent 13, semitic 10,
latin 9, greek 5, aegean 5, undeciphered 4, egyptian 4, mesoamerican 4,
cyrillic 4, mesopotamian 2, origins 1.
By status: living 66, extinct 48, historical 31, liturgical 14, revived 6.

Data files in `client/src/data/`: types.ts, index.ts (assembles + lookups),
scripts-ancient.ts, scripts-semitic.ts, scripts-european.ts, scripts-brahmic.ts,
scripts-sinitic.ts, scripts-independent.ts, scripts-expansion.ts, and
scripts-expansion-b.ts (Tocharian, Meitei Mayek, Modi, and Tai Tham).

## Component map
- `pages/Home.tsx` — shell: header, margin column, dendrogram, detail leaf
- `pages/About.tsx` — the long-form essay page
- `components/Dendrogram.tsx` — SVG radial dendrogram, d3-zoom, hover lineage
- `components/MarginColumn.tsx` — search, timeline scrub, filters, plate key
- `components/DetailLeaf.tsx` — right-hand detail panel
- `components/PlateCartouche.tsx` — titling block + four inventions key
- `components/HelpDialog.tsx` — how to read the chart
- `lib/tree-layout.ts` — angular allocation, bbox fitting, link paths

## Refinement round goals (current)
1. **Reduce chrome** — the margin column becomes an on-demand overlay; header
   strips to wordmark + essay; controls collapse into one minimal cluster.
2. **Mobile** — bottom sheet for detail, touch targets >= 44px, filters as a
   sheet, tuned pinch/pan, essay legible at 375px.
3. Corpus expansion: DONE (164 scripts).

## Counts to keep in sync when the corpus changes
`client/index.html` meta description, `PlateCartouche`, `MarginColumn` match
line, `About.tsx` prose and corpus table, `Home.tsx` header caption.

## Layout: why a plain radial dendrogram fails on this corpus

Measured shape of the genealogy (`node scripts/inspect-spans.mjs`):

```
depth histogram: 0:1  1:26  2:6  3:5  4:15  5:4  6:7  7:17  8:10  9:30  10:35  11:8  12:1
top fan-out:     root 26, aramaic 10, chinese-traditional 10, pallava 9, latin 8, kawi 7
deepest chain:   root → egyptian-hieroglyphs → hieratic → proto-sinaitic →
                 proto-canaanite → phoenician → aramaic → brahmi → gupta →
                 nagari → devanagari → canadian-syllabics → pollard-miao  (12 deep)
```

The corpus is **not bushy, it is a long thin chain that explodes at the end**.
Depths 2, 3 and 5 have only four to six nodes: essentially a single-file descent
through Egyptian → Hieratic → Proto-Sinaitic → Proto-Canaanite → Phoenician.
All the mass sits at depths 9 and 10 (65 of 164 scripts).

In a classic radial dendrogram, a child's angular sector is carved out of its
parent's. The whole Phoenician world therefore has to fit inside the sector
granted to one depth-1 node, so 74 scripts share whatever slice Egyptian got.
Sqrt weighting and angular floors cannot fix this — the constraint is structural.
Measured result: depth 2 and 3 nodes occupy only 14% of the rim, and by depth 10
the median sector is 0.033°, an arc of 0.3px.

**Decision:** the plate is rebuilt as a *tidy radial tree* where angle is
assigned by leaf ORDER rather than inherited sector, i.e. leaves are spread
evenly around the full circle and each internal node is placed at the mean angle
of its own descendants. Radius still encodes generation. This keeps every leaf
legible, fills the circle, and preserves the genealogy exactly.

### Layout iteration log (what was tried, what it looked like)

1. Proportional sectors + weave — one branch got 240°, rest a thin fan.
2. sqrt-weighted sectors at depth 1 only — quadrants measured even but render
   still collapsed; deep spans fell to 0.033° (0.3px arcs).
3. sqrt at all depths + angular floor — no better; the constraint is that a
   child's sector is carved from its parent's, so 74 scripts share Egyptian's.
4. **Tidy radial tree (current):** leaf-order angles, internal nodes at the mean
   of their children. Fixed the collapse.
5. Solitary inventions (22 childless depth-1 nodes) then formed a dense collar
   at the root. Tried: own ring at depth 1.6/1.8 (still cramped), pushed to the
   rim at depth 7 (drew long false spokes implying generations of transmission).
   **Current:** they stay at depth 1 but are weighted `SOLITARY_WEIGHT = 2.6`
   leaf-equivalents so each gets a legible slice of rim.
6. Fit centres on the ORIGIN, not the bbox — the root is at 0,0 and bbox
   centring pushed it off-centre whenever one side ran longer.

### Resolved

The key insight: **legibility on a radial plate is arc length, not angle.** At
ring I (132px) even an 8° slice is only ~18px of rim, so no amount of angular
weight could separate the 22 childless independent inventions.

Final approach for them: `origin: true`, placed on their own ring at `depth 5.8`
(~600px radius) where the same slice becomes ~120px and carries a name plus a
specimen. Their stem is drawn as a fine open dash (`2 7`, width 0.85, opacity
0.42) and the node gets a concentric hollow ring, so the long stroke reads as a
reach outward for legibility rather than generations of transmission.
`SOLITARY_WEIGHT = 2` — angle no longer has to do the work, so the descended
lineages keep the majority of the plate.

`labelFits` now measures at the radius where the label actually sits
(`n.radius + pad`), not at the node.

Ring radii: `RINGS = [0,132,236,332,424,512,596,678,758,836,912,986,1058]`,
fractional depths interpolate. Origin ring at depth `4.6`, plate rotation `-75°`,
top gap `7°`, solitary run split 50/50 to bracket the heavy branches.
Diagnostics: `node scripts/inspect-layout.mjs` (first-ring sectors, quadrant
balance) and `node scripts/inspect-spans.mjs` (per-depth min/median span).

## Mobile architecture

The phone is a separate render path in `Home.tsx` (early return on
`viewport === "phone"`), not a set of responsive tweaks:

- **Fixed header** with wordmark, live corpus count, essay link, and a
  first-class search field. Search is not hidden behind a sheet.
- **Two body modes, both kept mounted** so the chart keeps its zoom state:
  `ScriptIndex` (default) and the radial plate. A 164-node radial chart is not
  navigable by pinching on a 390px screen, so the index answers "what is here"
  and the plate answers "how is it related".
- `ScriptIndex` groups by family with sticky running heads, chronological within
  each group, and shows each script's specimen at 1.55rem — unencoded scripts get
  a ruled blank rather than a placeholder dot.
- **Bottom nav** holds the Index/Plate switch and the zoom controls, inside thumb
  reach. All touch targets are 44px (`.phone-btn`).
- The detail sheet carries a fixed **"Show in the plate"** foot action, which
  switches to plate mode and focuses the node.
- `MarginColumn` takes `hideSearch` on phone (header owns search) and `coarse`
  for enlarged targets and two-column chips.

## Specimen policy (round 3)

Audit (`node scripts/audit-specimens.mjs`) on 165 entries incl. the conceptual root:
135 had a `sample`, 30 had none; 65 had no `endonym`.

The user's requirement is that every script shows an example, ideally *the
orthography used to spell itself*. So the display rule is:

1. **Autonym first.** `endonym` — the script's own name written in itself — is the
   specimen wherever it exists. This is the honest answer to "show me this script":
   देवनागरी rather than a ka-kha-ga letter run.
2. **Letter run second.** Where no autonym is attested or the script had no name
   for itself (Brahmi, Linear B, Old Italic), the characteristic letter series or a
   real attested word stands in, labelled as such.
3. **Never fabricate.** Undeciphered scripts (Indus, Rongorongo, Voynich, Cretan
   hieroglyphs, Cypro-Minoan, Proto-Elamite) and unencoded ones (Khitan, Jurchen,
   Dongba, Afaka, shorthand) get real attested signs where Unicode has them, and
   otherwise an explicit "not encoded / undeciphered" note instead of a glyph.

`ScriptNode` therefore carries both `sample` (letter run / attested text) and
`endonym` (autonym), plus `sampleNote` explaining what is being shown. The index
and plate prefer the autonym; the detail leaf shows both with labels.

### Result (verified)

`node scripts/specimen-coverage.mjs` → 164 scripts: **120 autonym** (the script
writing its own name), **28 attested specimen / letter run**, **16 no specimen
possible** = 90.2% with a real specimen.

The 16 with none, and why: undeciphered (proto-elamite, cretan-hieroglyphs,
indus, rongorongo, voynich), awaiting a Unicode block (maya, zapotec, aztec,
isthmian), unencoded (khitan-large, khitan-small, jurchen, dongba, afaka,
shorthand, mwangwego). These render the romanised name in italic plus the note.

Resolver lives in `client/src/lib/specimen.ts`: `specimenOf()` and
`shortSpecimen()`. Used by Dendrogram (node glyphs + tooltip), ScriptIndex (rows),
DetailLeaf (hero block). Verify new specimens with
`node scripts/audit-specimens.mjs` and `node scripts/specimen-coverage.mjs`.

### Family jump rail

`ScriptIndex` owns its own scroller and carries a horizontal family rail above it
(shown only at ≥3 groups). Tapping a chip scrolls that section's running head to
the top; an onScroll spy marks the current family and scrolls the active chip into
view. `jumpingTo` ref suppresses the spy during the smooth-scroll animation.

## Specimen rendering bug (round 4) — root cause and fix

Reported from a real iPhone: many plate nodes drew a Latin name with a blank
where the specimen should be (Wancho, Tangsa, Adlam, Mundari Bani, Pahawh Hmong,
N'Ko, Medefaidrin, Bamum, Vai, Cherokee, Georgian, Armenian, Gothic, Coptic,
Runic, Glagolitic, Old Permic, Paleo-Hebrew, Samaritan, Serbian Cyrillic, Han).

**Not a font problem, and not missing data.** Every one of those entries has an
endonym and a fontHint, and all 123 needed families resolve from Google Fonts
(each stylesheet fetched with an iPhone UA returned 200 with @font-face rules).

The cause was two different visibility gates in `Dendrogram.tsx`:

```
glyph: span * max(radius, 60)      * k > 30
label: span * max(radius + 12, 60) * k > 17
```

A glyph needed ~1.8x the arc a name needed, so a wide band of nodes passed the
label gate and failed the glyph gate. At the phone's default zoom (k≈0.59) a node
needed 51px of arc to show its script. Fix: the specimen now shares the label's
gate, and crowding is absorbed by glyph SIZE (a `roomy` arc test picks the larger
of two type sizes) rather than by hiding the specimen.

### Google Fonts families that do NOT exist (return HTTP 400)
`Noto Sans Old Uyghur`, `Noto Sans Tangut`, `Noto Sans Tigalari`,
`Noto Serif Tulu Tigalari`. Removed from `index.html`.

Self-hosting availability, checked against
`https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/<Family>/hinted/ttf/<Family>-Regular.ttf`:
- `NotoSerifTangut` → 200, available
- `NotoSerifOldUyghur` → exists in the repo (dir listing), use SERIF not SANS
- Tigalari → NOT in the notofonts repo at all (207 dirs, no Tigalari)

Also removed 3 exactly duplicated font stylesheet links from `index.html`
(13 links → 10).
