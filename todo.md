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

- [ ] Checkpoint and deliver
