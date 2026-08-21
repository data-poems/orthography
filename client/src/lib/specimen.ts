/**
 * The specimen is the hero of this atlas. One rule, used everywhere, so the plate,
 * the index and the detail leaf never disagree about what a script looks like.
 */
import type { ScriptNode } from "@/data";

export type SpecimenKind =
  /** The script's own name, written in itself. The best possible answer. */
  | "autonym"
  /** An attested word or a canonical letter run, where no autonym survives. */
  | "sample"
  /** Unencoded or undeciphered: nothing can honestly be drawn. */
  | "none";

export interface Specimen {
  kind: SpecimenKind;
  /** The text to render, or the romanised name when kind is "none". */
  text: string;
  /** CSS font stack that covers the codepoints. */
  font: string;
  /** What is being shown, and where it comes from. */
  note: string | null;
  /** True when `text` is a romanised stand-in rather than the script itself. */
  romanised: boolean;
}

const FALLBACK_FONT = "'EB Garamond', serif";

/**
 * Resolve what to show for a script, in strict order of honesty:
 *
 *  1. `endonym` — the script spelling its own name. Preferred, because the
 *     request "show me this script" is best answered by the script naming itself.
 *  2. `sample` — an attested word or the canonical letter series.
 *  3. neither — the script is unencoded or undeciphered. We return the romanised
 *     name flagged `romanised`, and the caller renders it in italic with the note,
 *     rather than substituting another script's glyphs and implying they are real.
 */
export function specimenOf(node: ScriptNode): Specimen {
  const font = node.fontHint ?? FALLBACK_FONT;
  if (node.endonym && node.endonym.trim()) {
    return {
      kind: "autonym",
      text: node.endonym,
      font,
      note: node.sampleNote ?? null,
      romanised: false,
    };
  }
  if (node.sample && node.sample.trim()) {
    return {
      kind: "sample",
      text: node.sample,
      font,
      note: node.sampleNote ?? null,
      romanised: false,
    };
  }
  return {
    kind: "none",
    text: node.name,
    font: FALLBACK_FONT,
    note: node.sampleNote ?? "Not encoded in Unicode, so no specimen can be shown.",
    romanised: true,
  };
}

/**
 * A short specimen for cramped contexts (tree labels, list rows). Autonyms are
 * usually 2–5 characters, but a few are phrases; clip on a word boundary so a
 * clipped specimen still looks like writing rather than a truncation artefact.
 */
export function shortSpecimen(node: ScriptNode, maxChars = 8): Specimen {
  const s = specimenOf(node);
  if (s.kind === "none" || Array.from(s.text).length <= maxChars) return s;
  const firstWord = s.text.split(/\s+/)[0];
  const chars = Array.from(firstWord);
  return {
    ...s,
    text: chars.length <= maxChars ? firstWord : chars.slice(0, maxChars).join(""),
  };
}
