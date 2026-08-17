# Round 5: deep links, poster download, character inventories

## 1. Character inventories in the detail panel
- [x] Derive inventories from Unicode Script properties (Unicode 17.0)
- [x] Filter to ASSIGNED codepoints only — never render unassigned/tofu
- [x] Build a lazy-loaded inventory grid (glyph + U+ codepoint, grouped by role)
- [x] Explain when Unicode cannot responsibly provide an inventory
- [x] Collapse by default and progressively reveal huge charts in batches

## 2. Deep links
- [x] `/?script=<id>` selects and focuses that script on Plate I
- [x] Same `?script=<id>` works on the specimen sheet (Plate II)
- [x] Add a copy-link affordance in the detail panel
- [x] Back/forward navigation follows script inspection
- [x] Focus the tree on the linked node when arriving cold
- [x] `&inventory=1` opens straight to the character inventory

## 3. Specimen sheet download
- [x] Client-side only, no server (per user preference)
- [x] Poster-dimension PDF of all 148 specimens
- [x] Preserve all rendered specialist fonts by rasterising the already-loaded sheet
- [x] Test a generated browser download: valid 1.14 MB `%PDF-` output

## Verify
- [x] Desktop deep link opens and focuses Devanagari
- [x] Desktop sheet deep link opens Georgian
- [x] Phone deep links open the relevant detail leaf; a cold link defaults to Plate
- [x] Build and typecheck pass; poster-download browser acceptance test passes

## 4. Publish to GitHub
- [x] Create `lukeslp/orthography` as PRIVATE
- [x] Add a README describing the atlas, the data model, and the diagnostics
- [x] Commit the project and push (`e6da402`)
- [x] Confirm the pushed tree excludes node_modules and build output

## 5. Geographic origin plate
- [x] Audit regional fields and define an honest origin-coordinate policy
- [x] Add coordinate, confidence, and historical-place data for 160 mapped scripts; withhold four unsafe point claims
- [x] Build Plate IV: geographic origins with searchable, clickable markers
- [x] Retain the script detail leaf and deep-link behavior on the map
- [x] Verify desktop, tablet, and phone behavior; checkpoint and push

## 6. Geographic map depth
- [x] Define a source-aware route policy that separates attested transmission from inferred influence
- [x] Create a compact, auditable dataset of major historical spread routes
- [x] Replace crowded point nudges with expandable interactive map clusters
- [x] Add route visibility, source-aware legends, and route detail annotations
- [x] Verify desktop, tablet, and phone; checkpoint and push

- [ ] Checkpoint and deliver
