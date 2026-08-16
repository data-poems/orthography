# Round 4 — the specimen gallery

All 148 specimens as a single poster plate, in the Scriptorium Vellum idiom:
a printed specimen sheet a type foundry would issue, not a card grid.

- [ ] Re-read NOTES.md, lib/specimen.ts, App.tsx routes, index.css tokens
- [ ] Build `pages/Gallery.tsx` — the poster plate
- [ ] Arrangement modes: by family (default), by date, by typology
- [ ] Cell: the glyph large and dominant, name / date / ISO in small apparatus
- [ ] Click a specimen → detail leaf; action to show it in the radial plate
- [ ] Close with an honest register of the 16 that cannot be shown
- [ ] Route `/specimens`, link from desktop rail, phone bottom bar, essay
- [ ] Verify desktop / tablet / phone, check for tofu
- [ ] Checkpoint and deliver

## Bug reported from a real phone (screenshots)

On the phone plate, many nodes show only the Latin name with no glyph:
Wancho, Tangsa, Adlam, Mundari Bani, Mwangwego, Pahawh Hmong, N'Ko,
Medefaidrin, Afaka, Bamum, Vai, Cherokee, Man'yōgana, Georgian, Armenian,
Gothic, Coptic, Runic, Glagolitic, Old Permic, Paleo-Hebrew, Samaritan,
Serbian Cyrillic, Chinese Characters.

Data check: ALL of these except Mwangwego and Afaka DO carry an endonym and a
fontHint. So this is NOT missing data — it is a rendering failure.

Hypotheses to test, in order:
- [ ] The `n.span * radius * k > 30` gate hides the glyph at low zoom, so most
      nodes never draw one regardless of font support
- [ ] Google Fonts `family=` requests for these Noto script fonts are not
      actually returning webfonts (many historic Noto fonts are not on Google
      Fonts CSS2), so the browser silently falls back
- [ ] iOS Safari lacks system coverage for these blocks, so even fallback fails
- [ ] Fix: verify each font URL resolves; self-host or drop to a documented
      "specimen unavailable on this device" state rather than a silent blank

### ROOT CAUSE FOUND

Not fonts. All 123 needed families resolve and are served (checked each
stylesheet with an iPhone UA; only 4 unused ones 400, and 3 links were exact
duplicates). The bug is the visibility gate in `Dendrogram.tsx`:

```
glyph gate:  span * max(radius, 60)      * k > 30
label gate:  span * max(radius + 12, 60) * k > 17
```

A glyph needs ~1.8x the arc a name needs, so every node whose arc falls between
those two thresholds draws its NAME and no specimen — precisely the screenshots.
At the phone's default zoom (0.59) a node needs 51px of arc for a glyph.

- [x] Diagnose
- [ ] Fix: one gate for both, glyph first (the specimen is the hero, per ideas.md)
- [x] Fix: one gate for both, glyph first (the specimen is the hero, per ideas.md)
- [ ] Verify on a 390px viewport at default zoom (phone defaults to INDEX, so the
      plate must be checked by toggling, or on desktop where the plate is default)

Also fixed while in here:
- [x] Self-hosted Tangut + Old Uyghur (Google Fonts has no such family); subset
      to the shown codepoints, 1.5KB and 11KB woff2
- [x] Tigalari: no released font exists anywhere for the Unicode 16 block, so its
      specimen is removed and the reason stated rather than showing tofu
