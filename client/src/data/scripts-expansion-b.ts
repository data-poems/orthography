/**
 * Second expansion quire: the Central Asian Brahmi of the Tarim Basin, the
 * body-part alphabet of Manipur, the Marathi shorthand of the Maratha
 * secretariat, and the palm-leaf script of Lan Na.
 */
import type { ScriptNode } from "./types";

export const expansionScriptsB: ScriptNode[] = [
  {
    id: "tocharian",
    sample: "𑀀𑀅𑀊",
    name: "Tocharian",
    parent: "gupta",
    certainty: "attested",
    family: "brahmic",
    typology: "abugida",
    direction: "ltr",
    status: "extinct",
    yearStart: 300,
    yearEnd: 840,
    period: "c. AD 300 – 840",
    region: "Tarim Basin, Xinjiang",
    users: "none living",
    languages: ["Tocharian A (Agnean)", "Tocharian B (Kuchean)", "Sanskrit"],
    sampleNote: "Tocharian used a north-western variant of Brahmi, shown here; the variant itself is not separately encoded.",
    fontHint: "'Noto Sans Brahmi', serif",
    tagline:
      "The slanting Brahmi of the Silk Road, recording two extinct Indo-European languages spoken in what is now Xinjiang.",
    detail: [
      "Also called Central Asian slanting Gupta or North Turkestan Brahmi, the Tocharian script is a version of Gupta-era Brahmi adapted at the Buddhist monasteries of Kucha and Karasahr. Most surviving manuscripts date from the eighth century, though a few may be as early as AD 300. They were written on palm leaves, wooden tablets and imported Chinese paper, and survive only because the Tarim Basin is one of the driest places on earth.",
      "The corpus is unexpectedly varied for a monastic archive: alongside Buddhist and Manichaean scripture there are monastery accounts, commercial documents, caravan permits, medical and magical texts, and a single love poem. Its most distinctive feature is a set of eleven extra characters called Fremdzeichen, duplicating standard consonants but carrying an inherent 'ä' vowel, a solution to Tocharian phonology found in no other Brahmic script. The script appears to have died out after AD 840, when the Uyghurs were driven from Mongolia into the Tarim Basin; Tocharian texts survive in Uyghur translation, which is how we know the transition happened.",
    ],
    facts: [
      {
        label: "Of note",
        value:
          "The languages were misnamed. Early scholars identified the speakers with the Tokharoi of Bactria; 'Agnean' and 'Kuchean' are the accurate names, but Tocharian stuck.",
      },
    ],
    source: "https://en.wikipedia.org/wiki/Tocharian_script",
  },
  {
    id: "meitei-mayek",
    name: "Meitei Mayek",
    endonym: "ꯃꯩꯇꯩ ꯃꯌꯦꯛ",
    parent: "tibetan",
    influences: ["gupta"],
    certainty: "disputed",
    family: "brahmic",
    typology: "abugida",
    direction: "ltr",
    status: "revived",
    yearStart: 568,
    yearEnd: null,
    period: "c. AD 568 – 1700s, revived from 1980",
    region: "Manipur and Assam, India",
    iso: "Mtei",
    users: "~1.8 million",
    languages: ["Meitei (Manipuri)"],
    sample: "ꯀ ꯁ ꯂ ꯃ ꯄ ꯅ ꯆ ꯇ",
    sampleNote: "kok, sam, lai, mit, pa, na, chil, til — head, hair, forehead, eye…",
    fontHint: "'Noto Sans Meetei Mayek', serif",
    tagline:
      "Every letter is named after a part of the human body, and the whole script was brought back from disuse by act of legislature.",
    detail: [
      "Meitei Mayek is first known from the Yumbanlol copper plates, composed between AD 568 and 658, and from coins issued by the Meitei kings Ura Konthouba and Ayangba, now in the Mutua Museum at Imphal. It remained in use until the eighteenth century, when Vaishnavite influence and later colonial administration displaced it in favour of the Bengali script, and for roughly two hundred years Manipuri was written in a script belonging to a different branch of the family.",
      "Its origin is genuinely disputed. Some authorities derive it directly from Gupta Brahmi; Unicode and several others place it within the Tibetan group of scripts, itself Gupta-derived through the Kutila tradition. The revival is unusually well documented: a modernised orthography was approved for schools in 1980, the script was encoded in Unicode 5.2 in October 2009, the Manipur Official Language (Amendment) Act of 2021 made it co-official with Bengali, and in a joint agreement of 2022 the Meitei-language press switched over on 15 January 2023.",
    ],
    facts: [
      {
        label: "Of note",
        value:
          "The letters are named for body parts — kok is head, sam is hair, lai is forehead — which is why the script is also called Kok Sam Lai, after its first three letters.",
      },
    ],
    source: "https://en.wikipedia.org/wiki/Meitei_script",
  },
  {
    id: "modi",
    name: "Modi",
    endonym: "𑘦𑘻𑘚𑘲",
    parent: "nagari",
    certainty: "attested",
    family: "brahmic",
    typology: "abugida",
    direction: "ltr",
    status: "historical",
    yearStart: 1200,
    yearEnd: 1950,
    period: "c. AD 1200 – 1950",
    region: "Maharashtra, India",
    iso: "Modi",
    users: "a few hundred revivalists",
    languages: ["Marathi", "Konkani", "Sanskrit"],
    sample: "𑘀 𑘁 𑘂 𑘎 𑘏 𑘐 𑘑",
    sampleNote: "vowels a, ā, i and consonants ka, kha, ga, gha",
    fontHint: "'Noto Sans Modi', serif",
    tagline:
      "A cursive shorthand for Devanagari, designed so a clerk need not lift the pen to re-ink it.",
    detail: [
      "Modi is a running-hand adaptation of the Balbodh style of Devanagari, built for administrative speed. Its name probably comes from the Marathi verb moḍaṇe, 'to bend or break': many Modi letters are broken or rounded forms of their Devanagari counterparts, shaped so that the writer minimises pen lifts for re-inking. Attribution is contested between Hemāḍpant, a minister of the Yadava dynasty in the late thirteenth century, and Bāḷājī Avajī Chitnis, secretary of state to Shivaji; the oldest surviving document dates from 1389 and is held at the Bharat Itihas Sanshodhak Mandal in Pune.",
      "Successive era styles are distinguishable — Yadava, Bahamani, the Chitnisi hand of Shivaji's chancery, and the Peshwa varieties that lasted until 1818 — and the great bulk of Maratha administrative correspondence is written in it. It was the working script of business and government, used for account books and hundis (credit notes), and occasionally as a cipher, since so few outside the secretariat could read it. Printing killed it: William Carey's 1805 Marathi grammar had to be set in Balbodh because no Modi type existed at Serampore, and Balbodh eventually became the standard.",
    ],
    facts: [
      {
        label: "Of note",
        value:
          "The head stroke is drawn first, ruling the page before the letters are written, so a Modi text has no visible word boundaries at all.",
      },
    ],
    source: "https://en.wikipedia.org/wiki/Modi_script",
  },
  {
    id: "tai-tham",
    name: "Tai Tham (Lanna)",
    endonym: "ᨲ᩠ᩅᩫᨵᩢᨾ᩠ᨾ᩼",
    parent: "mon-burmese",
    certainty: "attested",
    family: "brahmic",
    typology: "abugida",
    direction: "ltr",
    status: "living",
    yearStart: 1376,
    yearEnd: null,
    period: "from AD 1376",
    region: "Northern Thailand, Laos, Shan State, Sipsong Panna",
    iso: "Lana",
    users: "~200,000 literate",
    languages: ["Northern Thai", "Tai Lü", "Khün", "Lao", "Pali"],
    sample: "ᨠ ᨡ ᨢ ᨣ ᨤ ᨥ ᨦ",
    sampleNote: "the wak ka series: ka, kha, kha, ga, gha, ṅa",
    fontHint: "'Noto Sans Tai Tham', serif",
    tagline:
      "The palm-leaf script of Lan Na, whose rounded letters exist because a straight stroke tears a leaf along its fibres.",
    detail: [
      "Tai Tham — Tham meaning dharma, scripture — is a Mon-derived abugida that took shape in the Lan Na kingdom of what is now northern Thailand. The oldest dated document is a bilingual gold folio of 1376 found at Sukhothai, carrying one line of Pali in Tai Tham beside Siamese in the Sukhothai script. By the fifteenth century it was being used for vernacular Northern Thai, probably at Chiang Mai, and it spread into Laos, Isan, Shan State and Sipsong Panna, developing local Lue, Khuen and Tham Lao variants that differ in appearance but not in system.",
      "Its rounded letterforms, noticeably softer than the angular Khmer script, follow from the writing surface: Tai Tham was written with a stylus on dried palm leaf, where a straight stroke splits the leaf along its fibres. Enormous numbers of these manuscripts were destroyed during the Thaification campaigns of the 1930s, which also ended the script's role as the primary written language of northern Thailand. It survives as the only script for Tai Khün, is still read by older monks in Laos, and is the parent of the New Tai Lue alphabet devised in the 1950s.",
    ],
    facts: [
      {
        label: "Of note",
        value:
          "Northern Thai has six tones against standard Thai's five, which is precisely why transcribing it into the Thai alphabet does not work.",
      },
    ],
    source: "https://en.wikipedia.org/wiki/Tai_Tham_script",
  },
];
