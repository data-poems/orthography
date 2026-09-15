/**
 * These are restrained historical corridors, not geopolitical borders or
 * migration trails. Their source-aware styles make uncertainty legible.
 */

export type RouteEvidence = "attested" | "probable" | "adaptation";

export interface TransmissionRoute {
  id: string;
  label: string;
  /** Ordered historical origin records. Each adjoining pair becomes one curve. */
  stops: string[];
  period: string;
  evidence: RouteEvidence;
  note: string;
  source: string;
}

export const transmissionRoutes: TransmissionRoute[] = [
  {
    id: "phoenician-greek-latin",
    label: "Mediterranean alphabet corridor",
    stops: ["phoenician", "greek", "old-italic", "latin"],
    period: "c. 900–600 BC",
    evidence: "attested",
    note: "Phoenician letter forms were adapted in Greek; a western Greek tradition was adapted in Italy and underlies Latin.",
    source: "https://www.cambridge.org/core/journals/diogenes/article/spread-of-alphabetic-scripts-c-1700500-bce/D8709E918BB7C29091FD730DAE8A5602",
  },
  {
    id: "phoenician-aramaic-arabic",
    label: "Near Eastern alphabet corridor",
    stops: ["phoenician", "aramaic", "nabataean", "arabic"],
    period: "c. 800 BC–AD 400",
    evidence: "attested",
    note: "Aramaic became a major Near Eastern written lingua franca; Nabataean forms form the immediate historical setting of Arabic script.",
    source: "https://www.cambridge.org/core/journals/diogenes/article/spread-of-alphabetic-scripts-c-1700500-bce/D8709E918BB7C29091FD730DAE8A5602",
  },
  {
    id: "aramaic-brahmi",
    label: "Aramaic–Brahmi proposal",
    stops: ["aramaic", "brahmi"],
    period: "before the 3rd century BC",
    evidence: "probable",
    note: "The suggested Aramaic contribution to Brahmi remains debated; the line records a qualified scholarly proposal, not a settled direct journey.",
    source: "https://en.wikipedia.org/wiki/Brahmi_script",
  },
  {
    id: "brahmi-tibetan",
    label: "Indic–Tibetan literary corridor",
    stops: ["brahmi", "tibetan"],
    period: "7th century AD",
    evidence: "attested",
    note: "Tibetan writing was developed from Indian models in the early Tibetan imperial context.",
    source: "https://en.wikipedia.org/wiki/Tibetan_script",
  },
  {
    id: "pallava-mainland",
    label: "Pallava to mainland Southeast Asia",
    stops: ["pallava", "khmer", "thai", "lao"],
    period: "c. AD 500–1300",
    evidence: "adaptation",
    note: "South Indian-derived forms were adapted through mainland Southeast Asian textual networks, developing distinct Khmer, Thai, and Lao traditions.",
    source: "https://en.wikipedia.org/wiki/Pallava_script",
  },
  {
    id: "pallava-insular",
    label: "Pallava to island Southeast Asia",
    stops: ["pallava", "kawi", "javanese", "balinese"],
    period: "c. AD 700–1400",
    evidence: "adaptation",
    note: "Indic-derived forms were adapted in the Kawi tradition and its Javanese and Balinese successors.",
    source: "https://en.wikipedia.org/wiki/Pallava_script",
  },
  {
    id: "han-east-asia",
    label: "Chinese-character textual sphere",
    stops: ["chinese-traditional", "hanja", "kanji", "chu-nom"],
    period: "from the 2nd century BC",
    evidence: "attested",
    note: "Chinese characters spread across East Asia and were adapted to Korean, Japanese, and Vietnamese written practices.",
    source: "https://www.cambridge.org/core/books/cambridge-handbook-of-language-standardization/language-modernization-in-the-chinese-character-cultural-sphere/C78FF061927EEED8A7FA001A4E6710AC",
  },
  {
    id: "sogdian-uyghur-mongolian",
    label: "Central Asian vertical-script corridor",
    stops: ["sogdian", "old-uyghur", "mongolian"],
    period: "c. AD 800–1300",
    evidence: "attested",
    note: "Old Uyghur was adapted from Sogdian; Mongolian script developed through the Uyghur scribal tradition.",
    source: "https://en.wikipedia.org/wiki/Old_Uyghur_script",
  },
  {
    id: "greek-coptic",
    label: "Greek to Coptic",
    stops: ["greek", "coptic"],
    period: "2nd–4th centuries AD",
    evidence: "attested",
    note: "Coptic was formed from Greek letter forms supplemented by signs from Demotic for Egyptian sounds.",
    source: "https://en.wikipedia.org/wiki/Coptic_alphabet",
  },
  {
    id: "greek-cyrillic",
    label: "Greek to Cyrillic",
    stops: ["greek", "cyrillic"],
    period: "late 9th–10th centuries AD",
    evidence: "attested",
    note: "Early Cyrillic is based primarily on Greek letter forms in a Slavic Christian literary context.",
    source: "https://en.wikipedia.org/wiki/Cyrillic_script",
  },
];
