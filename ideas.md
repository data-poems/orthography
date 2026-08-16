# The Tree of Writing — Design Brainstorm

## Three candidate directions

### 1. Scriptorium Vellum
**Very Brief Intro:** The visualization is staged as a scholar's working manuscript — warm vellum ground, iron-gall ink, red rubrication, marginal annotation. The emotional intent is quiet reverence for the physical labor of writing.
**Probability:** 0.038

### 2. Epigraphic Field Survey
**Very Brief Intro:** A cool, technical archaeological drafting aesthetic — squeeze-paper grays, measured baselines, plate numbers, hairline registration marks. The intent is forensic precision, as if the tree were a plate in a nineteenth-century corpus of inscriptions.
**Probability:** 0.071

### 3. Clay and Ochre
**Very Brief Intro:** Earth-fired terracotta and ochre pigment with impressed, tactile forms, referencing tablets and cave-pigment mark-making. The intent is warmth and materiality — writing as a thing pressed into a surface.
**Probability:** 0.024

---

## CHOSEN: 1 — Scriptorium Vellum

**Design Movement:** Late-medieval European manuscript design crossed with the editorial rigor of a Bringhurst-era scholarly monograph. Reference points: the Book of Kells' rubrication logic, the ruled prickings and hair-side/flesh-side tonal variation of parchment, and the plate engravings in nineteenth-century decipherment publications (Gardiner, Prinsep, Champollion's *Lettre à M. Dacier*).

**Core Principles:**
1. **The page before the interface.** Every surface reads as a leaf of vellum: ruled, ink-marked, occasionally stained. Chrome is annotation, never chrome.
2. **Rubrication as the only accent system.** Structural emphasis comes from a single vermilion red used the way a scribe used it — for initials, headings, and the currently-attended item. Never for decoration.
3. **Ink hierarchy, not color hierarchy.** Depth is achieved through ink density (three weights of brown-black), not through hue variety. Script families are distinguished by a muted earth-pigment palette that stays subordinate to the ink.
4. **The specimen is the hero.** Actual glyphs, set large in their own scripts, are the primary visual content. The chart is a frame for them.

**Color Philosophy:** The ground is aged vellum (`oklch(0.945 0.018 82)`) — not white, never gray. Text is iron-gall ink, which is brown-black and fades to a warmer brown at low emphasis; this is why body copy is `oklch(0.28 0.022 55)` rather than a neutral. The single accent is **rubric vermilion** `oklch(0.512 0.176 32)`, the red of minium/cinnabar used in manuscript rubrication. Family colors are drawn from historical pigments — verdigris, orpiment, lapis, sepia, madder, terre verte — desaturated so no family shouts over the ink. The emotional intent: this should feel like an object that has survived, handled by many hands, rather than a screen that was rendered.

**Layout Paradigm:** A **fixed left margin column** (like a manuscript's gutter) carrying controls and the legend, with the tree occupying a full-bleed canvas to its right and a detail leaf that slides in from the right edge as a third column. Deliberately three-column and asymmetric — never a centered hero. The tree itself is a **radial dendrogram rooted off-center**, growing rightward-and-around, so the composition has a visual weight bias to the left third. Scroll is never the primary navigation of the tree; pan and zoom are.

**Signature Elements:**
1. **Ruled prickings.** A faint horizontal rule grid + tiny marginal prick marks at the extreme left and right edges of panels, exactly as parchment was ruled for writing. Applied to panel backgrounds at very low opacity.
2. **Rubricated versal initials.** Each detail panel opens with a large drop-capital in vermilion set in the *script being described* where Unicode permits, otherwise in the display serif — the manuscript's own device for marking a new entry.
3. **The specimen block.** Every script gets a bordered specimen box with the glyph row set at display size on a slightly darker vellum wash, captioned in small caps with the ISO 15924 code — the visual grammar of a type specimen sheet.

**Interaction Philosophy:** Interaction should feel like handling a page rather than operating a machine. Hovering a node lifts it and **illuminates its full descent line to the root in vermilion**, the way a reader traces a genealogy with a finger. Clicking commits: the detail leaf slides in. Nothing bounces, nothing springs playfully — motion is weighted and settles, as paper does. Zoom is anchored at the cursor. The search field filters by dimming non-matches to a ghost-ink opacity rather than removing them, preserving the integrity of the page.

**Animation:**
- Entrance: the tree draws itself — branch paths stroke-dash in from root outward over ~900ms, staggered 24ms per depth ring, so the reader watches the genealogy being written. One time only, and gated behind `prefers-reduced-motion`.
- Node hover: 140ms ease-out, radius +2px, ink darkens. The ancestry path strokes to vermilion over 180ms.
- Detail leaf: slides from the right 260ms with `cubic-bezier(0.23, 1, 0.32, 1)`, no scale, no fade-from-nothing — a page being laid down.
- Timeline scrubbing: nodes past the current year fade to 8% opacity over 120ms. Continuous and interruptible; CSS transitions only.
- Never animate more than transform and opacity.

**Typography System:**
- **Display / headings:** `Cormorant Garamond` — a Garamond revival with genuine old-style proportions, used at large sizes with tight tracking for titles and versal initials.
- **Body / UI:** `EB Garamond` for reading copy at 16–18px, which keeps the manuscript register while remaining legible on screen.
- **Labels / data / captions:** `JetBrains Mono` at small sizes with wide tracking and uppercase for ISO codes, dates, and typology tags — the "engraver's caption" voice, providing the crisp counterpoint that keeps the design from being merely pretty.
- Hierarchy rule: size and weight carry hierarchy; the vermilion is reserved for state and structure, never for ordinary emphasis. Small caps and letterspacing do the work that bold would do elsewhere.

**Brand Essence:** A scholar's atlas of every script humanity has invented — for the reader who wants to see, not just be told, how the alphabet in front of them descends from an ox-head scratched in a Sinai turquoise mine. Personality: erudite, patient, tactile.

**Brand Voice:** Declarative and specific; it names dates, places, and people. It never says "explore" when it can say "trace." Headlines are noun phrases, not invitations.
- Example line: "Four times, independently, humans invented writing. Everything else is inheritance."
- Example line: "1,850 BC, Serabit el-Khadim — a mine worker draws an ox-head and means the sound /ʔ/."

**Wordmark & Logo:** An **aleph-derived mark**: the Proto-Sinaitic ox-head glyph rendered as a single-weight ink stroke, rotated through its historical journey — head-up (Proto-Sinaitic), tipped (Phoenician), fully inverted (Greek alpha / Latin A). The logo is the third form with the first form's horns still faintly ghosted behind it, in vermilion on vellum. Wordmark: "THE TREE OF WRITING" in Cormorant Garamond small caps with generous letterspacing, the descender of the initial T extended as a hairline rule beneath the words.

**Signature Brand Color:** **Rubric vermilion**, `oklch(0.512 0.176 32)` — the minium red of manuscript rubrication. Ownable because it is used with monastic discipline: one red, only ever for structure and attention.

---

## Style Decisions

- **Radial allocation is proportional-with-floor, not equal.** Each branch receives an angular sector sized by its leaf count, with a 4° floor so a singleton invention stays clickable; the shortfall is recovered from the wide sectors. Heavy branches are woven between light ones (largest, smallest, next largest) so no half of the plate starves.
- **Fit-to-view uses the real bounding box**, never a multiple of the radius, so the outermost ring sits ~130px from the viewport edge at any window size.
- **Label visibility is a legibility test, not a depth cutoff.** A name is drawn when `span × radius × zoom` exceeds a line height, so sparse outer branches stay named while the dense Brahmic fan thins until the reader zooms in.
- **Ring spacing widens outward** (150, 300, 448, 592, 734, 872, 1008) because outer rings carry more siblings and need more room for radiating labels.
- The **conceptual root is labelled INVENTION** in engraver's caption voice, not given a script name — it is an event, not a writing system.
