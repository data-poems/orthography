/**
 * Data layer for the manuscript. No presentation concerns here; the page is
 * ruled elsewhere. Keep every record sourced and dated — the brand voice names
 * dates, places, and people, so the data must supply them.
 */

/** Broad typological class, following the Daniels & Bright framework. */
export type Typology =
  | "proto-writing"
  | "logographic"
  | "logosyllabic"
  | "syllabary"
  | "semi-syllabary"
  | "abjad"
  | "alphabet"
  | "abugida"
  | "featural"
  | "undeciphered";

/** Direction of writing. */
export type Direction =
  | "ltr"
  | "rtl"
  | "boustrophedon"
  | "ttb"
  | "ttb-rtl"
  | "ttb-ltr"
  | "varied"
  | "unknown";

/** Vitality of the script today. */
export type Status =
  | "living"
  | "liturgical"
  | "revived"
  | "historical"
  | "extinct";

/** The great genealogical branches used to color the tree. */
export type Family =
  | "origins"
  | "mesopotamian"
  | "egyptian"
  | "semitic"
  | "aramaic"
  | "brahmic"
  | "greek"
  | "latin"
  | "cyrillic"
  | "sinitic"
  | "mesoamerican"
  | "aegean"
  | "independent"
  | "undeciphered";

/** How confident is the descent claim on the edge from this node to its parent. */
export type LinkCertainty = "attested" | "probable" | "disputed" | "stimulus";

export interface ScriptNode {
  /** Stable slug id. */
  id: string;
  /** Display name. */
  name: string;
  /** Name in its own script, where a Unicode representation exists. */
  endonym?: string;
  /** Parent id; null only for the conceptual root. */
  parent: string | null;
  /** Additional non-primary influences (dotted lines in the tree). */
  influences?: string[];
  /** Confidence of the primary descent claim. */
  certainty?: LinkCertainty;
  family: Family;
  typology: Typology;
  direction: Direction;
  status: Status;
  /** Earliest attestation, negative for BC. Used for the timeline. */
  yearStart: number;
  /** End of significant use; null if still in use. */
  yearEnd: number | null;
  /** Human-readable period, e.g. "c. 3400 – 100 BC". */
  period: string;
  region: string;
  /** ISO 15924 four-letter code where one is registered. */
  iso?: string;
  /** Approximate present-day users, where meaningful. */
  users?: string;
  /** Languages written with it. */
  languages: string[];
  /** A row of representative glyphs. Empty when Unicode cannot render it. */
  sample?: string;
  /** What the sample shows. */
  sampleNote?: string;
  /** CSS font stack hint for the specimen block. */
  fontHint?: string;
  /** One-sentence identification. */
  tagline: string;
  /** Two to four paragraphs of substance. */
  detail: string[];
  /** Bullet facts worth pulling out. */
  facts?: { label: string; value: string }[];
  /** Wikipedia or other source URL. */
  source?: string;
}
