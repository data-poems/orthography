/**
 * The single assembled corpus, plus derived lookups. Nothing here renders;
 * this is the quire being stitched.
 */
import type { Family, ScriptNode, Status, Typology } from "./types";
import { ancientScripts } from "./scripts-ancient";
import { semiticScripts } from "./scripts-semitic";
import { europeanScripts } from "./scripts-european";
import { brahmicScripts } from "./scripts-brahmic";
import { siniticScripts } from "./scripts-sinitic";
import { independentScripts } from "./scripts-independent";
import { expansionScripts } from "./scripts-expansion";
import { expansionScriptsB } from "./scripts-expansion-b";

export * from "./types";

export const allScripts: ScriptNode[] = [
  ...ancientScripts,
  ...semiticScripts,
  ...europeanScripts,
  ...brahmicScripts,
  ...siniticScripts,
  ...independentScripts,
  ...expansionScriptsB,
  ...expansionScripts,
];

export const scriptById = new Map<string, ScriptNode>(
  allScripts.map((s) => [s.id, s]),
);

export const childrenOf = new Map<string, ScriptNode[]>();
for (const s of allScripts) {
  if (!s.parent) continue;
  const list = childrenOf.get(s.parent) ?? [];
  list.push(s);
  childrenOf.set(s.parent, list);
}

/** Every id on the path from the conceptual root down to `id`, inclusive. */
export function ancestryOf(id: string): string[] {
  const path: string[] = [];
  let cur = scriptById.get(id);
  let guard = 0;
  while (cur && guard++ < 64) {
    path.unshift(cur.id);
    cur = cur.parent ? scriptById.get(cur.parent) : undefined;
  }
  return path;
}

/** Every descendant id of `id`, excluding itself. */
export function descendantsOf(id: string): string[] {
  const out: string[] = [];
  const stack = [...(childrenOf.get(id) ?? [])];
  while (stack.length) {
    const n = stack.pop()!;
    out.push(n.id);
    stack.push(...(childrenOf.get(n.id) ?? []));
  }
  return out;
}

/* ── Presentation vocabulary for the legend and filters ─────────── */

export const familyLabels: Record<Family, string> = {
  origins: "Origins",
  mesopotamian: "Mesopotamian",
  egyptian: "Egyptian",
  semitic: "Semitic / Alphabetic",
  aramaic: "Aramaic",
  brahmic: "Brahmic",
  greek: "Greek",
  latin: "Latin & Italic",
  cyrillic: "Slavic",
  sinitic: "Sinitic",
  mesoamerican: "Mesoamerican",
  aegean: "Aegean",
  independent: "Independent invention",
  undeciphered: "Undeciphered",
};

/** Historical pigment palette, one hue per branch. Kept subordinate to ink. */
export const familyColors: Record<Family, string> = {
  origins: "#6b5f52",
  mesopotamian: "#8a6a3b",
  egyptian: "#b8860b",
  semitic: "#a8341f",
  aramaic: "#7d3f5c",
  brahmic: "#2f6b52",
  greek: "#2c5878",
  latin: "#3d4f8a",
  cyrillic: "#5b4a86",
  sinitic: "#8c3b2e",
  mesoamerican: "#4f7a3a",
  aegean: "#1f6b72",
  independent: "#a6742a",
  undeciphered: "#767068",
};

export const typologyLabels: Record<Typology, string> = {
  "proto-writing": "Proto-writing",
  logographic: "Logographic",
  logosyllabic: "Logosyllabic",
  syllabary: "Syllabary",
  "semi-syllabary": "Semi-syllabary",
  abjad: "Abjad",
  alphabet: "Alphabet",
  abugida: "Abugida",
  featural: "Featural",
  undeciphered: "Undeciphered",
};

export const typologyGloss: Record<Typology, string> = {
  "proto-writing": "Signs conveying information without encoding a language's grammar.",
  logographic: "One sign per word or morpheme.",
  logosyllabic: "Signs used both for meaning and for syllabic sound.",
  syllabary: "One sign per syllable; consonant and vowel are not separable.",
  "semi-syllabary": "Mixes syllabic and segmental signs.",
  abjad: "Consonants only; the reader supplies the vowels.",
  alphabet: "Consonants and vowels written as equal, independent letters.",
  abugida: "Consonant carries an inherent vowel, overridden by attached marks.",
  featural: "Letter shapes encode the articulatory features of the sound.",
  undeciphered: "Structure not yet established.",
};

export const statusLabels: Record<Status, string> = {
  living: "In everyday use",
  liturgical: "Liturgical or ceremonial",
  revived: "Under revival",
  historical: "Restricted or scholarly use",
  extinct: "No longer used",
};

export const directionLabels: Record<string, string> = {
  ltr: "Left to right",
  rtl: "Right to left",
  boustrophedon: "Boustrophedon (alternating)",
  ttb: "Top to bottom",
  "ttb-rtl": "Top to bottom, columns right to left",
  "ttb-ltr": "Top to bottom, columns left to right",
  varied: "Varies",
  unknown: "Unknown",
};

export const certaintyLabels: Record<string, string> = {
  attested: "Attested descent",
  probable: "Probable descent",
  disputed: "Disputed descent",
  stimulus: "Stimulus diffusion — the idea, not the forms",
};
