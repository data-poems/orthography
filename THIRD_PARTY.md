# Sources and third-party materials

The MIT license covers original application code. It does not replace the terms
of the materials below.

## Unicode character data

`client/src/data/inventories.ts` derives from the Unicode Character Database's
`Scripts.txt`, `UnicodeData.txt`, and `PropertyValueAliases.txt`. The source file
does not record its Unicode version or input checksums; reproducing that exact
generation remains release work. The Unicode copyright and permission notice is
in [licenses/UNICODE.txt](licenses/UNICODE.txt), retrieved from
[Unicode](https://www.unicode.org/license.txt) on September 15, 2026.

## Fonts

The bundled Tangut and Old Uyghur fonts are subsets of Noto Serif families by
The Noto Project Authors. They retain the SIL Open Font License 1.1. Their
copyright notices and license texts are in
[`client/src/assets/fonts/`](client/src/assets/fonts/README.md).

The interface also requests fonts from Google Fonts. Those requests need a
network connection; the application is not a fully offline font bundle.

## Map and historical records

The map uses `world-atlas`, whose Natural Earth source data is public domain;
its package and dependency notices remain applicable. Historical script records
link their references. Those links document the research basis; they do not
claim that every historical relationship is settled or that cited publications
are MIT licensed.

## Images awaiting provenance

The repository includes `client/public/media/aleph-mark.png` and
`client/public/media/inscription-specimens.jpg`, but their source, creator, and
redistribution terms are not recorded. The inscription image is used by the
essay and social preview; the aleph mark is used as the logo and favicon.
Resolve that provenance or replace the assets before public redistribution.

`radial-card.jpg` and `radial-card-midnight.jpg` are documented as captures of the
atlas. Their publication still depends on clearing the materials visible in
the captured interface.
