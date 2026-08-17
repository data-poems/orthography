/**
 * Geographic origin data for Plate IV. Coordinates describe historical
 * development or first secure attestation, not a script's full area of use.
 * See research/geographic-origin-policy.md for evidence and precision rules.
 */

export type OriginPrecision = "site" | "region" | "broad" | "withheld";

export interface OriginRecord {
  id: string;
  latitude: number | null;
  longitude: number | null;
  precision: OriginPrecision;
  label: string;
  note: string;
  source: string | null;
}

export const originRecords: OriginRecord[] = [
  {
    "id": "cuneiform",
    "latitude": 31.3242,
    "longitude": 45.6377,
    "precision": "site",
    "label": "Uruk (Warka), southern Iraq",
    "note": "Earliest proto-cuneiform tablets are securely attested at the Uruk site; site coordinate.",
    "source": "https://www.metmuseum.org/essays/the-origins-of-writing"
  },
  {
    "id": "proto-elamite",
    "latitude": 32.1896,
    "longitude": 48.2578,
    "precision": "site",
    "label": "Susa, Khuzestan, Iran",
    "note": "Site of the principal and earliest securely attested Proto-Elamite tablet corpus.",
    "source": "https://en.wikipedia.org/wiki/Proto-Elamite"
  },
  {
    "id": "old-persian-cuneiform",
    "latitude": 34.0723,
    "longitude": 47.4354,
    "precision": "site",
    "label": "Bīsotūn (Behistun), western Iran",
    "note": "The Bīsotūn inscription is the first secure attestation of Old Persian cuneiform and explicitly presents the script as newly made; site coordinate.",
    "source": "https://www.iranicaonline.org/articles/bisotun-iii/"
  },
  {
    "id": "ugaritic",
    "latitude": 35.602,
    "longitude": 35.789,
    "precision": "site",
    "label": "Ugarit (Ras Shamra), northern Syria",
    "note": "Site of the earliest and defining Ugaritic corpus; location-level attribution.",
    "source": "https://en.wikipedia.org/wiki/Ugaritic_alphabet"
  },
  {
    "id": "anatolian-hieroglyphs",
    "latitude": 39.9,
    "longitude": 35.3,
    "precision": "region",
    "label": "central Anatolia",
    "note": "Regional origin assignment; the indigenous script is attested across Anatolia and northern Syria, with no single securely established place of invention.",
    "source": "https://en.wikipedia.org/wiki/Anatolian_hieroglyphs"
  },
  {
    "id": "egyptian-hieroglyphs",
    "latitude": 26.1833,
    "longitude": 31.9167,
    "precision": "site",
    "label": "Abydos (Umm el-Qa'ab), Upper Egypt",
    "note": "Earliest securely attested Egyptian hieroglyphic writing is documented on Predynastic labels and tags from Abydos.",
    "source": "https://en.wikipedia.org/wiki/Egyptian_hieroglyphs"
  },
  {
    "id": "hieratic",
    "latitude": 26.8,
    "longitude": 30.8,
    "precision": "broad",
    "label": "Egypt (Nile Valley regional centroid)",
    "note": "Hieratic is a cursive form of hieroglyphic writing that developed in Egypt; no single origin site is securely established.",
    "source": "https://en.wikipedia.org/wiki/Hieratic"
  },
  {
    "id": "demotic",
    "latitude": 30.8,
    "longitude": 31,
    "precision": "region",
    "label": "Northern Egypt (Nile Delta regional centroid)",
    "note": "Demotic developed from hieratic in northern Egypt around the seventh century BCE; the coordinate is a regional centroid.",
    "source": "https://en.wikipedia.org/wiki/Demotic_Egyptian_script"
  },
  {
    "id": "meroitic",
    "latitude": 16.9387,
    "longitude": 33.7493,
    "precision": "site",
    "label": "Meroë, Kingdom of Kush, Sudan",
    "note": "The Meroitic scripts were developed for the Meroitic language during the Kushite period centered on Meroë.",
    "source": "https://en.wikipedia.org/wiki/Meroitic_script"
  },
  {
    "id": "coptic",
    "latitude": 26.8206,
    "longitude": 30.8025,
    "precision": "broad",
    "label": "Egypt",
    "note": "Regional origin: the script developed in Egypt from Greek letterforms supplemented by Demotic signs; no single founding site is securely established.",
    "source": "https://en.wikipedia.org/wiki/Coptic_script"
  },
  {
    "id": "cretan-hieroglyphs",
    "latitude": 35.14,
    "longitude": 25.16,
    "precision": "site",
    "label": "Archanes-Phourni, Crete",
    "note": "Earliest Cretan writing attestations associated with the Archanes-Phourni cemetery and the early Cretan hieroglyphic milieu; site coordinate.",
    "source": "https://en.wikipedia.org/wiki/Cretan_hieroglyphs"
  },
  {
    "id": "linear-a",
    "latitude": 35.24,
    "longitude": 24.9,
    "precision": "region",
    "label": "Minoan Crete",
    "note": "Linear A is first securely attested across Minoan Crete in the protopalatial period; regional centroid coordinate.",
    "source": "https://en.wikipedia.org/wiki/Linear_A"
  },
  {
    "id": "linear-b",
    "latitude": 35.3,
    "longitude": 25.16,
    "precision": "site",
    "label": "Knossos, Crete",
    "note": "The earliest substantial and securely identified Linear B archive is from the palace at Knossos; site coordinate.",
    "source": "https://en.wikipedia.org/wiki/Linear_B"
  },
  {
    "id": "cypro-minoan",
    "latitude": 35.09,
    "longitude": 33.65,
    "precision": "site",
    "label": "Enkomi, Cyprus",
    "note": "The earliest extant substantial Cypro-Minoan examples are associated with Enkomi; site coordinate.",
    "source": "https://en.wikipedia.org/wiki/Cypro-Minoan_syllabary"
  },
  {
    "id": "cypriot-syllabary",
    "latitude": 35.1,
    "longitude": 33.3,
    "precision": "region",
    "label": "Cyprus",
    "note": "The syllabary developed on Cyprus from the Late Bronze Age Cypro-Minoan tradition, but no single uncontested invention site is established; island centroid coordinate.",
    "source": "https://en.wikipedia.org/wiki/Cypriot_syllabary"
  },
  {
    "id": "maya",
    "latitude": 17.551,
    "longitude": -89.415,
    "precision": "site",
    "label": "San Bartolo, Petén, Guatemala",
    "note": "Site location of Late Preclassic murals containing an early securely attested Maya hieroglyphic text, dated to about 300–200 BCE.",
    "source": "https://en.wikipedia.org/wiki/Maya_script"
  },
  {
    "id": "isthmian",
    "latitude": 17.3,
    "longitude": -94.5,
    "precision": "broad",
    "label": "Isthmus of Tehuantepec and adjacent Chiapas–Guatemala region, Mexico and Guatemala",
    "note": "Broad regional centroid for a sparse and disputed corpus; known inscriptions span the Tehuantepec–Chiapas area, so no single origin site is secure.",
    "source": "https://en.wikipedia.org/wiki/Isthmian_script"
  },
  {
    "id": "zapotec",
    "latitude": 17.043,
    "longitude": -96.767,
    "precision": "site",
    "label": "Monte Albán, Oaxaca, Mexico",
    "note": "Site location of the earliest substantial Zapotec monumental inscription corpus, associated with the ancient Zapotec capital.",
    "source": "https://en.wikipedia.org/wiki/Zapotec_script"
  },
  {
    "id": "aztec",
    "latitude": 19.4,
    "longitude": -99.1,
    "precision": "region",
    "label": "Central Mexico",
    "note": "Regional centroid for Nahuatl/Aztec pictorial writing within the Central Mexican and Mixteca–Puebla graphic tradition; a single developmental site is not secure.",
    "source": "https://en.wikipedia.org/wiki/Aztec_writing"
  },
  {
    "id": "indus",
    "latitude": 30.6292,
    "longitude": 72.3347,
    "precision": "site",
    "label": "Harappa, Punjab, Pakistan",
    "note": "Site with early Ravi-phase signs associated with the development of the Indus script.",
    "source": "https://en.wikipedia.org/wiki/Indus_script"
  },
  {
    "id": "rongorongo",
    "latitude": -27.1127,
    "longitude": -109.3497,
    "precision": "broad",
    "label": "Rapa Nui (Easter Island), Polynesia",
    "note": "Island-level location of the surviving corpus and the securely documented historical tradition; no earlier external origin is established.",
    "source": "https://en.wikipedia.org/wiki/Rongorongo"
  },
  {
    "id": "voynich",
    "latitude": null,
    "longitude": null,
    "precision": "withheld",
    "label": "Origin disputed; possibly Italy or Central Europe",
    "note": "The manuscript's production location and the nature of its script remain unresolved, so coordinates are withheld.",
    "source": "https://en.wikipedia.org/wiki/Voynich_manuscript"
  },
  {
    "id": "proto-sinaitic",
    "latitude": 28.58,
    "longitude": 33.45,
    "precision": "site",
    "label": "Serabit el-Khadim, Sinai Peninsula, Egypt",
    "note": "Main concentration of Proto-Sinaitic inscriptions; site-level attribution, with related evidence at Wadi el-Hol.",
    "source": "https://en.wikipedia.org/wiki/Proto-Sinaitic_script"
  },
  {
    "id": "proto-canaanite",
    "latitude": 31.65,
    "longitude": 34.85,
    "precision": "region",
    "label": "Shephelah, southern Canaan",
    "note": "The Shephelah is identified as the Bronze Age core area of Proto-Canaanite; regional centroid.",
    "source": "https://en.wikipedia.org/wiki/Proto-Canaanite_alphabet"
  },
  {
    "id": "phoenician",
    "latitude": 34.12,
    "longitude": 35.65,
    "precision": "site",
    "label": "Byblos, Phoenician coast, Lebanon",
    "note": "Byblos preserves early Phoenician inscriptions and is used here as a documented coastal site proxy.",
    "source": "https://en.wikipedia.org/wiki/Phoenician_alphabet"
  },
  {
    "id": "paleo-hebrew",
    "latitude": 31.78,
    "longitude": 35.22,
    "precision": "region",
    "label": "Central hill country of the ancient kingdoms of Israel and Judah",
    "note": "Regional attribution to the Israelite-Judean writing tradition; coordinates are a regional centroid.",
    "source": "https://en.wikipedia.org/wiki/Paleo-Hebrew_alphabet"
  },
  {
    "id": "samaritan",
    "latitude": 32.221,
    "longitude": 35.26,
    "precision": "site",
    "label": "Nablus (ancient Shechem), Samaria",
    "note": "Samaritan script is associated with the Samaritan community centered at Nablus; site-level attribution.",
    "source": "https://en.wikipedia.org/wiki/Samaritan_script"
  },
  {
    "id": "ancient-south-arabian",
    "latitude": 15.46,
    "longitude": 45.33,
    "precision": "site",
    "label": "Marib, Yemen",
    "note": "Marib, the Sabaean center, is a documented site proxy for the Ancient South Arabian monumental tradition.",
    "source": "https://en.wikipedia.org/wiki/Ancient_South_Arabian_script"
  },
  {
    "id": "ancient-north-arabian",
    "latitude": 27.5,
    "longitude": 37,
    "precision": "broad",
    "label": "Ancient North Arabia and the Syrian desert",
    "note": "Ancient North Arabian denotes multiple related scripts across a large zone, not one securely localized invention site; broad regional centroid.",
    "source": "https://ociana.osu.edu/scripts_north_arabian"
  },
  {
    "id": "geez",
    "latitude": 14.29,
    "longitude": 39,
    "precision": "region",
    "label": "Northern Ethiopia and Eritrea (Aksumite highlands)",
    "note": "Early Ethiopic/Ge'ez development is localized to the Aksumite region; coordinates are a regional centroid near Yeha.",
    "source": "https://en.wikipedia.org/wiki/Ge%CA%BBez_script"
  },
  {
    "id": "tifinagh",
    "latitude": null,
    "longitude": null,
    "precision": "withheld",
    "label": "North African Libyco-Berber zone",
    "note": "Origin is disputed among widely distributed Libyco-Berber attestations; coordinates withheld rather than implying a single birthplace.",
    "source": "https://en.wikipedia.org/wiki/Tifinagh"
  },
  {
    "id": "aramaic",
    "latitude": 36.85,
    "longitude": 38,
    "precision": "broad",
    "label": "Upper Mesopotamia and northern Syria",
    "note": "Broad homeland of early Aramaic writing; no single secure founding site is established.",
    "source": "https://en.wikipedia.org/wiki/Aramaic_alphabet"
  },
  {
    "id": "hebrew",
    "latitude": 31.77,
    "longitude": 35.21,
    "precision": "region",
    "label": "Judea, around Jerusalem",
    "note": "Regional location for the adoption and consolidation of the Aramaic-derived square Hebrew script.",
    "source": "https://en.wikipedia.org/wiki/Hebrew_alphabet"
  },
  {
    "id": "syriac",
    "latitude": 37.16,
    "longitude": 38.79,
    "precision": "site",
    "label": "Edessa (modern Şanlıurfa, Turkey)",
    "note": "Syriac script is securely associated with the early Christian scribal center of Edessa.",
    "source": "https://en.wikipedia.org/wiki/Syriac_alphabet"
  },
  {
    "id": "mandaic",
    "latitude": 31,
    "longitude": 47,
    "precision": "region",
    "label": "Lower Mesopotamia, southern Iraq",
    "note": "Regional origin for a script developed by Mandaeans; exact site and derivation remain debated.",
    "source": "https://en.wikipedia.org/wiki/Mandaic_alphabet"
  },
  {
    "id": "palmyrene",
    "latitude": 34.55,
    "longitude": 38.27,
    "precision": "site",
    "label": "Palmyra, Syria",
    "note": "The script was developed and attested at the caravan city of Palmyra.",
    "source": "https://en.wikipedia.org/wiki/Palmyrene_alphabet"
  },
  {
    "id": "nabataean",
    "latitude": 30.33,
    "longitude": 35.44,
    "precision": "site",
    "label": "Petra, Jordan",
    "note": "Petra is the principal early center and secure archaeological locus of Nabataean writing.",
    "source": "https://en.wikipedia.org/wiki/Nabataean_alphabet"
  },
  {
    "id": "arabic",
    "latitude": 32.5,
    "longitude": 38.5,
    "precision": "broad",
    "label": "Northern Arabia and the Levant",
    "note": "Broad development zone for the Arabic script from Nabataean and related late Aramaic hands; a single origin site is disputed.",
    "source": "https://en.wikipedia.org/wiki/Arabic_script"
  },
  {
    "id": "perso-arabic",
    "latitude": 32.65,
    "longitude": 51.68,
    "precision": "region",
    "label": "Iranian plateau, especially central Persia",
    "note": "Regional location for the Persian adaptation of Arabic writing in the early Islamic Iranian world.",
    "source": "https://en.wikipedia.org/wiki/Persian_alphabet"
  },
  {
    "id": "urdu-nastaliq",
    "latitude": 28.61,
    "longitude": 77.21,
    "precision": "region",
    "label": "North India, Delhi-centered Persianate milieu",
    "note": "Regional location for the formation and literary standardization of Urdu Nastaliq.",
    "source": "https://en.wikipedia.org/wiki/Urdu_alphabet"
  },
  {
    "id": "thaana",
    "latitude": 4.18,
    "longitude": 73.51,
    "precision": "region",
    "label": "Maldives, Malé-centered archipelago",
    "note": "Regional origin in the Maldives; the script’s precise first development site is uncertain.",
    "source": "https://en.wikipedia.org/wiki/Thaana"
  },
  {
    "id": "hanifi-rohingya",
    "latitude": 20.15,
    "longitude": 92.9,
    "precision": "region",
    "label": "Rakhine State, Myanmar",
    "note": "Regional origin for a modern script devised for Rohingya in the late twentieth century.",
    "source": "https://en.wikipedia.org/wiki/Hanifi_Rohingya_script"
  },
  {
    "id": "pahlavi",
    "latitude": 32,
    "longitude": 51,
    "precision": "broad",
    "label": "Persia, Iranian plateau",
    "note": "Broad development zone for Middle Persian scripts derived from Imperial Aramaic administrative writing.",
    "source": "https://en.wikipedia.org/wiki/Pahlavi_scripts"
  },
  {
    "id": "avestan",
    "latitude": null,
    "longitude": null,
    "precision": "withheld",
    "label": "Sasanian Iranian world",
    "note": "The alphabet was created in Sasanian Persia, but its exact place of development is not securely documented.",
    "source": "https://en.wikipedia.org/wiki/Avestan_alphabet"
  },
  {
    "id": "sogdian",
    "latitude": 39.65,
    "longitude": 66.96,
    "precision": "region",
    "label": "Sogdiana, around Samarkand",
    "note": "Regional origin for the Sogdian form of the Aramaic-derived script, centered on Sogdiana.",
    "source": "https://en.wikipedia.org/wiki/Sogdian_alphabet"
  },
  {
    "id": "old-uyghur",
    "latitude": 42.94,
    "longitude": 89.18,
    "precision": "region",
    "label": "Turfan, eastern Tarim Basin",
    "note": "Regional locus for the Uyghur adaptation of the Sogdian script in the Tarim Basin.",
    "source": "https://en.wikipedia.org/wiki/Old_Uyghur_alphabet"
  },
  {
    "id": "mongolian",
    "latitude": 47.92,
    "longitude": 106.92,
    "precision": "broad",
    "label": "Mongolia and the Mongol imperial sphere",
    "note": "Broad origin zone for the Mongolian script, adopted from Uyghur in the early thirteenth century.",
    "source": "https://en.wikipedia.org/wiki/Mongolian_script"
  },
  {
    "id": "manchu",
    "latitude": 42,
    "longitude": 126,
    "precision": "region",
    "label": "Manchuria",
    "note": "Regional origin for the Manchu adaptation of the Mongolian script under the early Qing-era Jurchen polity.",
    "source": "https://en.wikipedia.org/wiki/Manchu_alphabet"
  },
  {
    "id": "old-turkic",
    "latitude": 47.25,
    "longitude": 102.75,
    "precision": "site",
    "label": "Orkhon Valley, Mongolia",
    "note": "Earliest secure monumental corpus is concentrated in the Orkhon Valley; deeper origins of the runiform script remain debated.",
    "source": "https://en.wikipedia.org/wiki/Old_Turkic_script"
  },
  {
    "id": "kharosthi",
    "latitude": 33.746,
    "longitude": 72.839,
    "precision": "site",
    "label": "Taxila, Punjab, Pakistan",
    "note": "Early inscriptions are attested in the Taxila–Gandhara area.",
    "source": "https://en.wikipedia.org/wiki/Kharosthi"
  },
  {
    "id": "greek",
    "latitude": 38.48,
    "longitude": 23.64,
    "precision": "region",
    "label": "Euboea, early Archaic Greece",
    "note": "Most specialists place the early eighth-century adoption of Phoenician letters for Greek somewhere on Euboea; this is a regional attribution, not a claimed single workshop.",
    "source": "https://en.wikipedia.org/wiki/History_of_the_Greek_alphabet"
  },
  {
    "id": "old-italic",
    "latitude": 40.5383,
    "longitude": 14.2428,
    "precision": "site",
    "label": "Cumae, Campania, Italy",
    "note": "The Old Italic family is conventionally traced to the Euboean Greek alphabet at Cumae, adapted by Etruscans in Italy.",
    "source": "https://en.wikipedia.org/wiki/Old_Italic_scripts"
  },
  {
    "id": "latin",
    "latitude": 41.9028,
    "longitude": 12.4964,
    "precision": "site",
    "label": "Rome, Latium, Italy",
    "note": "The Latin script developed in ancient Rome from an Etruscan alphabet ultimately derived from Greek at Cumae.",
    "source": "https://en.wikipedia.org/wiki/Latin_script"
  },
  {
    "id": "runic",
    "latitude": 55.45,
    "longitude": 10.4,
    "precision": "site",
    "label": "Vimose, Funen, Denmark",
    "note": "The earliest clear runic evidence is associated with the Vimose finds; the exact invention point remains debated.",
    "source": "https://en.wikipedia.org/wiki/Runes"
  },
  {
    "id": "ogham",
    "latitude": 52.2,
    "longitude": -8.5,
    "precision": "region",
    "label": "Munster, Ireland",
    "note": "Regional centroid for southern Ireland, where most surviving early Ogham stones are concentrated; earliest inscriptions date to about the fourth century CE.",
    "source": "https://en.wikipedia.org/wiki/Ogham"
  },
  {
    "id": "gothic-alphabet",
    "latitude": 43.1,
    "longitude": 25.6,
    "precision": "broad",
    "label": "Lower Danube / Moesia, fourth-century Gothic mission",
    "note": "Wulfila developed the alphabet for Gothic Bible translation in the Greco-Roman world around the Black Sea and Lower Danube; a single creation site is not securely documented.",
    "source": "https://en.wikipedia.org/wiki/Gothic_alphabet"
  },
  {
    "id": "armenian",
    "latitude": 40.17,
    "longitude": 44.51,
    "precision": "region",
    "label": "Armenia, around the Vagharshapat–Echmiadzin region",
    "note": "Mesrop Mashtots and Sahak introduced the alphabet in Armenia around 405; this point is a regional historical reference rather than a documented invention site.",
    "source": "https://en.wikipedia.org/wiki/Armenian_alphabet"
  },
  {
    "id": "georgian",
    "latitude": 41.84,
    "longitude": 44.72,
    "precision": "region",
    "label": "Kartli (Iberia), eastern Georgia",
    "note": "The script is generally linked to the Christianization of Iberia/Kartli before its fifth-century attestations; exact origin and authorship remain contested, so this is a regional attribution.",
    "source": "https://en.wikipedia.org/wiki/Georgian_scripts"
  },
  {
    "id": "glagolitic",
    "latitude": 49.1,
    "longitude": 17.3,
    "precision": "broad",
    "label": "Great Moravia",
    "note": "Regional centroid; created in the 9th century for Cyril and Methodius's Great Moravian mission, with Cyril of Thessalonica traditionally credited.",
    "source": "https://en.wikipedia.org/wiki/Glagolitic_script"
  },
  {
    "id": "cyrillic",
    "latitude": 43.162,
    "longitude": 26.816,
    "precision": "site",
    "label": "Preslav Literary School, Veliki Preslav, Bulgaria",
    "note": "Documented development site; Early Cyrillic was developed at the Preslav Literary School in the First Bulgarian Empire.",
    "source": "https://en.wikipedia.org/wiki/Cyrillic_script"
  },
  {
    "id": "old-permic",
    "latitude": 65.93,
    "longitude": 56.16,
    "precision": "region",
    "label": "Ust-Vym, Komi lands, Russia",
    "note": "Regional location; introduced in 1372 by Stephen of Perm for medieval Komi, in the Perm region.",
    "source": "https://en.wikipedia.org/wiki/Old_Permic_script"
  },
  {
    "id": "deseret",
    "latitude": 40.7608,
    "longitude": -111.891,
    "precision": "site",
    "label": "Salt Lake City, Utah Territory, United States",
    "note": "The Deseret alphabet was developed and promoted in Salt Lake City for an English spelling reform in the 1850s.",
    "source": "https://en.wikipedia.org/wiki/Deseret_alphabet"
  },
  {
    "id": "shavian",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "precision": "region",
    "label": "London, United Kingdom",
    "note": "Regional attribution to London, where the Shavian alphabet was developed and introduced through the Shaw alphabet competition and publication project.",
    "source": "https://en.wikipedia.org/wiki/Shavian_alphabet"
  },
  {
    "id": "ipa",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "precision": "site",
    "label": "Paris, France",
    "note": "The International Phonetic Alphabet was established by the International Phonetic Association in Paris in 1888.",
    "source": "https://en.wikipedia.org/wiki/International_Phonetic_Alphabet"
  },
  {
    "id": "braille",
    "latitude": 48.8926,
    "longitude": 2.7965,
    "precision": "site",
    "label": "Coupvray, France",
    "note": "Louis Braille devised the six-dot tactile writing system in Coupvray during the 1820s.",
    "source": "https://en.wikipedia.org/wiki/Braille"
  },
  {
    "id": "brahmi",
    "latitude": 22.5,
    "longitude": 79,
    "precision": "broad",
    "label": "Indian subcontinent, early Ashokan zone",
    "note": "Broad central estimate for the early Mauryan attestation zone.",
    "source": "https://en.wikipedia.org/wiki/Brahmi_script"
  },
  {
    "id": "gupta",
    "latitude": 25.3,
    "longitude": 82,
    "precision": "region",
    "label": "Northern India",
    "note": "Regional Gupta-era development of northern India.",
    "source": "https://en.wikipedia.org/wiki/Gupta_script"
  },
  {
    "id": "siddham",
    "latitude": 25.3,
    "longitude": 82,
    "precision": "region",
    "label": "Northern India",
    "note": "Developed from late Gupta writing; single birthplace not secure.",
    "source": "https://en.wikipedia.org/wiki/Siddha%E1%B9%83_script"
  },
  {
    "id": "sharada",
    "latitude": 34.08,
    "longitude": 74.8,
    "precision": "region",
    "label": "Kashmir Valley, India",
    "note": "Historically associated with the Kashmir Valley.",
    "source": "https://en.wikipedia.org/wiki/Sharada_script"
  },
  {
    "id": "nagari",
    "latitude": 25.3,
    "longitude": 82,
    "precision": "region",
    "label": "Northern India",
    "note": "Post-Gupta regional development in northern India.",
    "source": "https://en.wikipedia.org/wiki/Nagari_script"
  },
  {
    "id": "devanagari",
    "latitude": 25.3,
    "longitude": 82,
    "precision": "region",
    "label": "Northern India",
    "note": "Developed from Nagari; no single origin site is secure.",
    "source": "https://en.wikipedia.org/wiki/Devanagari"
  },
  {
    "id": "gurmukhi",
    "latitude": 31.15,
    "longitude": 75.34,
    "precision": "region",
    "label": "Punjab, India",
    "note": "Standardized in the Punjab in the sixteenth century.",
    "source": "https://en.wikipedia.org/wiki/Gurmukhi"
  },
  {
    "id": "gujarati",
    "latitude": 22.5,
    "longitude": 72,
    "precision": "region",
    "label": "Gujarat, India",
    "note": "Developed in Gujarat from western Nagari forms.",
    "source": "https://en.wikipedia.org/wiki/Gujarati_script"
  },
  {
    "id": "bengali-assamese",
    "latitude": 23,
    "longitude": 89,
    "precision": "region",
    "label": "Bengal delta",
    "note": "Formed in the eastern Gangetic and Bengal region.",
    "source": "https://en.wikipedia.org/wiki/Bengali%E2%80%93Assamese_script"
  },
  {
    "id": "odia",
    "latitude": 20.3,
    "longitude": 85.8,
    "precision": "region",
    "label": "Odisha, India",
    "note": "Developed in Odisha from eastern Nagari traditions.",
    "source": "https://en.wikipedia.org/wiki/Odia_script"
  },
  {
    "id": "tibetan",
    "latitude": 29.65,
    "longitude": 91.12,
    "precision": "site",
    "label": "Central Tibet, around Lhasa",
    "note": "Seventh-century Tibetan creation associated with the imperial court.",
    "source": "https://en.wikipedia.org/wiki/Tibetan_script"
  },
  {
    "id": "phags-pa",
    "latitude": 39.9,
    "longitude": 116.4,
    "precision": "site",
    "label": "Dadu, China",
    "note": "Commissioned for the Yuan court at Dadu.",
    "source": "https://en.wikipedia.org/wiki/%CA%BCPhags-pa_script"
  },
  {
    "id": "kadamba",
    "latitude": 14.55,
    "longitude": 74.49,
    "precision": "site",
    "label": "Banavasi, Karnataka",
    "note": "Early attestation in the Kadamba realm centered on Banavasi.",
    "source": "https://en.wikipedia.org/wiki/Kadamba_script"
  },
  {
    "id": "kannada",
    "latitude": 14.5,
    "longitude": 75.9,
    "precision": "region",
    "label": "Karnataka, India",
    "note": "Developed in Karnataka from southern Brahmi traditions.",
    "source": "https://en.wikipedia.org/wiki/Kannada_script"
  },
  {
    "id": "telugu",
    "latitude": 16.5,
    "longitude": 80.6,
    "precision": "region",
    "label": "Andhra region, India",
    "note": "Developed in the Andhra region from the Telugu-Kannada branch.",
    "source": "https://en.wikipedia.org/wiki/Telugu_script"
  },
  {
    "id": "pallava",
    "latitude": 12.5,
    "longitude": 79,
    "precision": "region",
    "label": "Tamil Nadu, India",
    "note": "Developed in the Pallava realm of northern Tamil Nadu.",
    "source": "https://en.wikipedia.org/wiki/Pallava_script"
  },
  {
    "id": "tamil",
    "latitude": 11,
    "longitude": 78,
    "precision": "region",
    "label": "Tamil Nadu, India",
    "note": "Developed in the Tamil region from southern Brahmi.",
    "source": "https://en.wikipedia.org/wiki/Tamil_script"
  },
  {
    "id": "malayalam",
    "latitude": 10.5,
    "longitude": 76.3,
    "precision": "region",
    "label": "Kerala, India",
    "note": "Developed in Kerala from western southern Brahmic forms.",
    "source": "https://en.wikipedia.org/wiki/Malayalam_script"
  },
  {
    "id": "sinhala",
    "latitude": 8.31,
    "longitude": 80.4,
    "precision": "site",
    "label": "Anuradhapura, Sri Lanka",
    "note": "Early Sinhala writing is attested in the Anuradhapura zone.",
    "source": "https://en.wikipedia.org/wiki/Sinhala_script"
  },
  {
    "id": "khmer",
    "latitude": 13.4,
    "longitude": 103.9,
    "precision": "region",
    "label": "Angkor region, Cambodia",
    "note": "Mainland Southeast Asian development from Pallava-related writing.",
    "source": "https://en.wikipedia.org/wiki/Khmer_script"
  },
  {
    "id": "thai",
    "latitude": 17.01,
    "longitude": 99.82,
    "precision": "site",
    "label": "Sukhothai, Thailand",
    "note": "Early Thai script is associated with late-thirteenth-century Sukhothai.",
    "source": "https://en.wikipedia.org/wiki/Thai_script"
  },
  {
    "id": "lao",
    "latitude": 18,
    "longitude": 103,
    "precision": "region",
    "label": "Lan Xang region",
    "note": "Developed from the Thai tradition in Lan Xang.",
    "source": "https://en.wikipedia.org/wiki/Lao_script"
  },
  {
    "id": "mon-burmese",
    "latitude": 17,
    "longitude": 97,
    "precision": "region",
    "label": "Lower Myanmar",
    "note": "Regional formation; a single origin site is disputed.",
    "source": "https://en.wikipedia.org/wiki/Burmese_script"
  },
  {
    "id": "kawi",
    "latitude": -7.6,
    "longitude": 110,
    "precision": "region",
    "label": "Java, Indonesia",
    "note": "Developed in Java from Indic-derived writing.",
    "source": "https://en.wikipedia.org/wiki/Kawi_script"
  },
  {
    "id": "balinese",
    "latitude": -8.4,
    "longitude": 115.2,
    "precision": "region",
    "label": "Bali, Indonesia",
    "note": "Developed on Bali from Kawi.",
    "source": "https://en.wikipedia.org/wiki/Balinese_script"
  },
  {
    "id": "javanese",
    "latitude": -7.5,
    "longitude": 110,
    "precision": "region",
    "label": "Central Java, Indonesia",
    "note": "Developed in Java from Kawi-related forms.",
    "source": "https://en.wikipedia.org/wiki/Javanese_script"
  },
  {
    "id": "baybayin",
    "latitude": 15,
    "longitude": 121,
    "precision": "region",
    "label": "Luzon, Philippines",
    "note": "Philippine attestation is strongest in Luzon; birthplace unknown.",
    "source": "https://en.wikipedia.org/wiki/Baybayin"
  },
  {
    "id": "cham",
    "latitude": 12,
    "longitude": 108,
    "precision": "region",
    "label": "Champa, central Vietnam",
    "note": "Developed in the Champa region from Indic-derived writing.",
    "source": "https://en.wikipedia.org/wiki/Cham_script"
  },
  {
    "id": "ol-chiki",
    "latitude": 21.9,
    "longitude": 86.7,
    "precision": "site",
    "label": "Mayurbhanj, Odisha",
    "note": "Created at Mayurbhanj in 1925 for Santali.",
    "source": "https://en.wikipedia.org/wiki/Ol_Chiki_script"
  },
  {
    "id": "canadian-syllabics",
    "latitude": 53.97,
    "longitude": -97.83,
    "precision": "site",
    "label": "Norway House, Manitoba",
    "note": "Developed for Cree missions in the 1840s.",
    "source": "https://en.wikipedia.org/wiki/Canadian_Aboriginal_syllabics"
  },
  {
    "id": "pollard-miao",
    "latitude": 26.86,
    "longitude": 104.28,
    "precision": "site",
    "label": "Weining, Guizhou",
    "note": "Created by Sam Pollard for Miao communities.",
    "source": "https://en.wikipedia.org/wiki/Pollard_script"
  },
  {
    "id": "oracle-bone",
    "latitude": 36.1,
    "longitude": 114.39,
    "precision": "site",
    "label": "Yinxu (Anyang), Henan, China",
    "note": "Earliest securely attested Chinese writing is concentrated at the late Shang capital site of Yinxu.",
    "source": "https://en.wikipedia.org/wiki/Oracle_bone_script"
  },
  {
    "id": "seal-script",
    "latitude": 34.33,
    "longitude": 108.72,
    "precision": "region",
    "label": "Qin state, centered on Xianyang, Shaanxi, China",
    "note": "Small seal script developed in the Qin textual tradition and was standardized under the Qin dynasty.",
    "source": "https://en.wikipedia.org/wiki/Seal_script"
  },
  {
    "id": "chinese-traditional",
    "latitude": 36.1,
    "longitude": 114.39,
    "precision": "broad",
    "label": "North China, represented by the early corpus at Anyang",
    "note": "Traditional characters are a modern category for the continuing Chinese script tradition, whose earliest secure corpus is at Anyang.",
    "source": "https://en.wikipedia.org/wiki/Chinese_characters"
  },
  {
    "id": "chinese-simplified",
    "latitude": 39.9,
    "longitude": 116.41,
    "precision": "site",
    "label": "Beijing, China",
    "note": "The modern standardized simplified set was promulgated by the government of the People’s Republic of China from Beijing.",
    "source": "https://en.wikipedia.org/wiki/Simplified_Chinese_characters"
  },
  {
    "id": "kanji",
    "latitude": 34.69,
    "longitude": 135.8,
    "precision": "broad",
    "label": "Nara region, Japan",
    "note": "Kanji denotes Chinese characters adapted for Japanese; early secure Japanese use is associated with the Kofun-period Nara–Kinai region.",
    "source": "https://en.wikipedia.org/wiki/Kanji"
  },
  {
    "id": "manyogana",
    "latitude": 34.69,
    "longitude": 135.8,
    "precision": "region",
    "label": "Nara region, Japan",
    "note": "Man’yōgana is the Japanese use of Chinese characters for phonetic value, attested in early Japanese literary and inscriptional contexts.",
    "source": "https://en.wikipedia.org/wiki/Man%27y%C5%8Dgana"
  },
  {
    "id": "hiragana",
    "latitude": 35.01,
    "longitude": 135.77,
    "precision": "region",
    "label": "Kyoto and the Heian court, Japan",
    "note": "Hiragana developed from cursive forms of Chinese characters in the Heian-period court milieu.",
    "source": "https://en.wikipedia.org/wiki/Hiragana"
  },
  {
    "id": "katakana",
    "latitude": 35.01,
    "longitude": 135.77,
    "precision": "region",
    "label": "Kyoto and the Heian scholarly milieu, Japan",
    "note": "Katakana developed from abbreviated character components used for annotation in Buddhist textual study.",
    "source": "https://en.wikipedia.org/wiki/Katakana"
  },
  {
    "id": "hanja",
    "latitude": 36.5,
    "longitude": 127.8,
    "precision": "broad",
    "label": "Korean Peninsula",
    "note": "Hanja is the Korean adaptation and use of Chinese characters; its initial introduction predates a securely localized single origin site.",
    "source": "https://en.wikipedia.org/wiki/Hanja"
  },
  {
    "id": "chu-nom",
    "latitude": 21.03,
    "longitude": 105.85,
    "precision": "broad",
    "label": "Northern Vietnam, centered on the Red River delta",
    "note": "Chữ Nôm is a Vietnamese adaptation of Chinese characters that emerged in the Vietnamese literary sphere; a single first site is not secure.",
    "source": "https://en.wikipedia.org/wiki/Ch%E1%BB%AF_N%C3%B4m"
  },
  {
    "id": "sawndip",
    "latitude": 22.82,
    "longitude": 108.32,
    "precision": "region",
    "label": "Guangxi Zhuang region, China",
    "note": "Sawndip is the locally adapted character tradition used for Zhuang varieties across Guangxi rather than a single-site invention.",
    "source": "https://en.wikipedia.org/wiki/Sawndip"
  },
  {
    "id": "nushu",
    "latitude": 25.27,
    "longitude": 111.34,
    "precision": "site",
    "label": "Jiangyong, Hunan, China",
    "note": "Nüshu is a localized syllabic script documented in the Jiangyong county area.",
    "source": "https://en.wikipedia.org/wiki/N%C3%BCshu"
  },
  {
    "id": "bopomofo",
    "latitude": 39.9,
    "longitude": 116.41,
    "precision": "site",
    "label": "Beijing, China",
    "note": "Bopomofo was developed and officially adopted through the Republic of China national phonetic-reform process centered in Beijing.",
    "source": "https://en.wikipedia.org/wiki/Bopomofo"
  },
  {
    "id": "khitan-large",
    "latitude": 43.62,
    "longitude": 118.96,
    "precision": "broad",
    "label": "Liao imperial domain, centered near Linhuangfu in present-day Inner Mongolia",
    "note": "The large script was commissioned for the Khitan imperial state, but its first production site is not securely localized.",
    "source": "https://en.wikipedia.org/wiki/Khitan_large_script"
  },
  {
    "id": "khitan-small",
    "latitude": 43.62,
    "longitude": 118.96,
    "precision": "broad",
    "label": "Liao imperial domain, centered near Linhuangfu in present-day Inner Mongolia",
    "note": "The small script was created for the Khitan Liao state; surviving evidence does not establish one certain workshop or site of origin.",
    "source": "https://en.wikipedia.org/wiki/Khitan_small_script"
  },
  {
    "id": "jurchen",
    "latitude": 45.55,
    "longitude": 126.97,
    "precision": "broad",
    "label": "Jin realm in Manchuria, centered on the Harbin–Acheng area",
    "note": "Jurchen was created for the Jin state in the Manchurian sphere, with no securely identified single origin site.",
    "source": "https://en.wikipedia.org/wiki/Jurchen_script"
  },
  {
    "id": "tangut",
    "latitude": 38.49,
    "longitude": 106.23,
    "precision": "region",
    "label": "Western Xia, centered on Yinchuan, Ningxia, China",
    "note": "The Tangut script was commissioned for the Western Xia state in 1036; Yinchuan represents its political core.",
    "source": "https://en.wikipedia.org/wiki/Tangut_script"
  },
  {
    "id": "yi",
    "latitude": 25.04,
    "longitude": 102.71,
    "precision": "broad",
    "label": "Yi-speaking areas of southwest China, represented by Yunnan",
    "note": "Classical Yi developed across a broad Sichuan–Yunnan cultural area, so no single first site is securely defensible.",
    "source": "https://en.wikipedia.org/wiki/Yi_script"
  },
  {
    "id": "dongba",
    "latitude": 26.87,
    "longitude": 100.23,
    "precision": "region",
    "label": "Lijiang area, Yunnan, China",
    "note": "Dongba symbols belong to the Naxi ritual tradition centered in the Lijiang region.",
    "source": "https://en.wikipedia.org/wiki/Dongba_symbols"
  },
  {
    "id": "hangul",
    "latitude": 37.5665,
    "longitude": 126.978,
    "precision": "site",
    "label": "Seoul, Korea",
    "note": "Site-level attribution; Hangul was devised under King Sejong and officially promulgated from the Joseon court at Seoul in 1446.",
    "source": "https://en.wikipedia.org/wiki/Hangul"
  },
  {
    "id": "cherokee",
    "latitude": 34.35,
    "longitude": -84.75,
    "precision": "region",
    "label": "Cherokee homeland, southeastern United States",
    "note": "Regional origin assignment; Sequoyah developed the syllabary in the Cherokee homeland during the early nineteenth century, while the exact workshop site is uncertain.",
    "source": "https://en.wikipedia.org/wiki/Cherokee_syllabary"
  },
  {
    "id": "vai",
    "latitude": 7.45,
    "longitude": -11.15,
    "precision": "site",
    "label": "Jondu, Grand Cape Mount County, Liberia",
    "note": "Site-level attribution; Momolu Duwalu Bukele is documented as devising the Vai syllabary at Jondu.",
    "source": "https://en.wikipedia.org/wiki/Vai_syllabary"
  },
  {
    "id": "nko",
    "latitude": 10.38,
    "longitude": -9.31,
    "precision": "site",
    "label": "Kankan, Guinea",
    "note": "Site-level attribution; Solomana Kanté finalized and introduced N’Ko in Kankan after devising it in Côte d’Ivoire.",
    "source": "https://en.wikipedia.org/wiki/N%27Ko_script"
  },
  {
    "id": "adlam",
    "latitude": 9.54,
    "longitude": -13.68,
    "precision": "region",
    "label": "Fulani communities in Guinea",
    "note": "Regional origin assignment; the Barry brothers developed Adlam in late-1980s Guinea, but a securely documented invention site is not established.",
    "source": "https://en.wikipedia.org/wiki/Adlam_script"
  },
  {
    "id": "bamum",
    "latitude": 5.73,
    "longitude": 10.9,
    "precision": "site",
    "label": "Foumban, Cameroon",
    "note": "Site-level attribution; King Ibrahim Njoya created and revised the Bamum scripts at the Bamum court in Foumban.",
    "source": "https://en.wikipedia.org/wiki/Bamum_script"
  },
  {
    "id": "pahawh-hmong",
    "latitude": 20.42,
    "longitude": 104.04,
    "precision": "region",
    "label": "Laos",
    "note": "Regional origin assignment; Shong Lue Yang invented Pahawh Hmong in Laos in 1959, but the source does not securely identify one invention settlement.",
    "source": "https://en.wikipedia.org/wiki/Pahawh_Hmong"
  },
  {
    "id": "mwangwego",
    "latitude": -13.96,
    "longitude": 33.77,
    "precision": "region",
    "label": "Malawi",
    "note": "Regional origin assignment; Mwangwego was designed in Malawi by Nolence Mwangwego, without a securely documented single invention site.",
    "source": "https://en.wikipedia.org/wiki/Mwangwego_script"
  },
  {
    "id": "osage",
    "latitude": 36.67,
    "longitude": -96.34,
    "precision": "region",
    "label": "Osage Nation, Oklahoma, United States",
    "note": "Regional origin assignment; the modern Osage alphabet was created for language revitalization in the Osage Nation, but no single invention site is securely documented.",
    "source": "https://en.wikipedia.org/wiki/Osage_script"
  },
  {
    "id": "afaka",
    "latitude": 5.85,
    "longitude": -55.2,
    "precision": "region",
    "label": "Suriname",
    "note": "Regional origin assignment; Afaka created the script for Ndyuka in Suriname around 1908, while the precise place is uncertain.",
    "source": "https://en.wikipedia.org/wiki/Afaka_script"
  },
  {
    "id": "shorthand",
    "latitude": null,
    "longitude": null,
    "precision": "withheld",
    "label": "Pitman and Gregg shorthand systems",
    "note": "Withheld; this corpus item combines distinct systems with separate origins in Britain and Ireland/United States, so one coordinate would be misleading.",
    "source": "https://en.wikipedia.org/wiki/Pitman_shorthand"
  },
  {
    "id": "tocharian",
    "latitude": 39.5,
    "longitude": 87,
    "precision": "region",
    "label": "Tarim Basin, Xinjiang",
    "note": "Attested across the Tarim Basin; creation site unknown.",
    "source": "https://en.wikipedia.org/wiki/Tocharian_script"
  },
  {
    "id": "meitei-mayek",
    "latitude": 24.8,
    "longitude": 93.9,
    "precision": "region",
    "label": "Manipur, India",
    "note": "Indigenous to the Manipur valley; early evidence is regional.",
    "source": "https://en.wikipedia.org/wiki/Meitei_script"
  },
  {
    "id": "modi",
    "latitude": 19.75,
    "longitude": 75.7,
    "precision": "region",
    "label": "Maharashtra, India",
    "note": "Developed as a cursive administrative hand in Maharashtra.",
    "source": "https://en.wikipedia.org/wiki/Modi_script"
  },
  {
    "id": "tai-tham",
    "latitude": 18.8,
    "longitude": 99,
    "precision": "region",
    "label": "Lan Na, northern Thailand",
    "note": "Developed in the Lan Na cultural region.",
    "source": "https://en.wikipedia.org/wiki/Tai_Tham_script"
  },
  {
    "id": "grantha",
    "latitude": 12.5,
    "longitude": 79,
    "precision": "region",
    "label": "Tamil Nadu, India",
    "note": "Developed in the Pallava sphere for Sanskrit.",
    "source": "https://en.wikipedia.org/wiki/Grantha_script"
  },
  {
    "id": "tigalari",
    "latitude": 13.3,
    "longitude": 74.8,
    "precision": "region",
    "label": "Coastal Karnataka",
    "note": "Developed on the Karnataka coast.",
    "source": "https://en.wikipedia.org/wiki/Tigalari_script"
  },
  {
    "id": "nandinagari",
    "latitude": 14.5,
    "longitude": 75.9,
    "precision": "region",
    "label": "Karnataka, India",
    "note": "Southern Indian development from Nagari-related forms.",
    "source": "https://en.wikipedia.org/wiki/Nandinagari"
  },
  {
    "id": "kaithi",
    "latitude": 26,
    "longitude": 84.5,
    "precision": "region",
    "label": "Bihar and eastern Uttar Pradesh",
    "note": "Regional administrative script of the Gangetic plain.",
    "source": "https://en.wikipedia.org/wiki/Kaithi"
  },
  {
    "id": "sylheti-nagri",
    "latitude": 24.9,
    "longitude": 91.9,
    "precision": "region",
    "label": "Sylhet region, Bangladesh",
    "note": "Developed in Sylhet; exact early locus not secure.",
    "source": "https://en.wikipedia.org/wiki/Sylheti_Nagri"
  },
  {
    "id": "takri",
    "latitude": 32.5,
    "longitude": 76.5,
    "precision": "region",
    "label": "Western Himalaya",
    "note": "Developed in western Himalayan administrative traditions.",
    "source": "https://en.wikipedia.org/wiki/Takri_script"
  },
  {
    "id": "multani",
    "latitude": 30.2,
    "longitude": 71.47,
    "precision": "site",
    "label": "Multan, Punjab",
    "note": "Historically associated with the Multan region.",
    "source": "https://en.wikipedia.org/wiki/Multani_script"
  },
  {
    "id": "khojki",
    "latitude": 26,
    "longitude": 68.5,
    "precision": "region",
    "label": "Sindh, Pakistan",
    "note": "Developed among Ismaili communities in Sindh.",
    "source": "https://en.wikipedia.org/wiki/Khojki_script"
  },
  {
    "id": "khudawadi",
    "latitude": 27.85,
    "longitude": 68.52,
    "precision": "site",
    "label": "Khudabad, Sindh",
    "note": "Associated with Khudabad.",
    "source": "https://en.wikipedia.org/wiki/Khudabadi_script"
  },
  {
    "id": "chakma",
    "latitude": 22.7,
    "longitude": 92.3,
    "precision": "region",
    "label": "Chittagong Hill Tracts",
    "note": "Associated with the Chittagong Hill Tracts; early development uncertain.",
    "source": "https://en.wikipedia.org/wiki/Chakma_script"
  },
  {
    "id": "lepcha",
    "latitude": 27.33,
    "longitude": 88.61,
    "precision": "region",
    "label": "Sikkim, India",
    "note": "Developed for Lepcha in the Sikkim region.",
    "source": "https://en.wikipedia.org/wiki/Lepcha_script"
  },
  {
    "id": "limbu",
    "latitude": 27.3,
    "longitude": 87.7,
    "precision": "region",
    "label": "Limbuwan, eastern Nepal",
    "note": "Developed in the Limbuwan region.",
    "source": "https://en.wikipedia.org/wiki/Limbu_script"
  },
  {
    "id": "tirhuta",
    "latitude": 26.3,
    "longitude": 86,
    "precision": "region",
    "label": "Mithila",
    "note": "Developed in the Mithila cultural region.",
    "source": "https://en.wikipedia.org/wiki/Tirhuta_script"
  },
  {
    "id": "saurashtra",
    "latitude": 22.3,
    "longitude": 71.8,
    "precision": "region",
    "label": "Gujarat, India",
    "note": "Associated with the Saurashtra community and western India.",
    "source": "https://en.wikipedia.org/wiki/Saurashtra_script"
  },
  {
    "id": "ranjana",
    "latitude": 27.7,
    "longitude": 85.3,
    "precision": "region",
    "label": "Kathmandu Valley, Nepal",
    "note": "Developed in Newar Buddhist culture.",
    "source": "https://en.wikipedia.org/wiki/Ranjana_script"
  },
  {
    "id": "soyombo",
    "latitude": 46.3,
    "longitude": 102.8,
    "precision": "region",
    "label": "Mongolia",
    "note": "Created by Zanabazar; precise workshop site uncertain.",
    "source": "https://en.wikipedia.org/wiki/Soyombo_script"
  },
  {
    "id": "zanabazar-square",
    "latitude": 46.8,
    "longitude": 103.8,
    "precision": "region",
    "label": "Mongolia",
    "note": "Created by Zanabazar; exact origin site uncertain.",
    "source": "https://en.wikipedia.org/wiki/Zanabazar_square_script"
  },
  {
    "id": "marchen",
    "latitude": 31,
    "longitude": 81,
    "precision": "region",
    "label": "Western Tibet",
    "note": "Bön-associated Tibetan-derived script; early locus not secure.",
    "source": "https://en.wikipedia.org/wiki/Marchen_script"
  },
  {
    "id": "tai-le",
    "latitude": 23.7,
    "longitude": 101.5,
    "precision": "region",
    "label": "Yunnan, China",
    "note": "Developed among Tai Nüa communities in the Yunnan–Upper Mekong region.",
    "source": "https://en.wikipedia.org/wiki/Tai_Le_script"
  },
  {
    "id": "new-tai-lue",
    "latitude": 24.5,
    "longitude": 101.5,
    "precision": "region",
    "label": "Yunnan, China",
    "note": "Standardized in Yunnan in the mid-twentieth century.",
    "source": "https://en.wikipedia.org/wiki/New_Tai_Lue_alphabet"
  },
  {
    "id": "tai-viet",
    "latitude": 21.5,
    "longitude": 104.5,
    "precision": "region",
    "label": "Northwestern Vietnam",
    "note": "Developed among Tai communities of northwestern Vietnam.",
    "source": "https://en.wikipedia.org/wiki/Tai_Viet_script"
  },
  {
    "id": "buhid",
    "latitude": 13.1,
    "longitude": 121.2,
    "precision": "region",
    "label": "Mindoro, Philippines",
    "note": "Indigenous to Mindoro; single creation site not established.",
    "source": "https://en.wikipedia.org/wiki/Buhid_script"
  },
  {
    "id": "hanunoo",
    "latitude": 12.5,
    "longitude": 121.1,
    "precision": "region",
    "label": "Mindoro, Philippines",
    "note": "Indigenous to Mindoro; precise early locus unknown.",
    "source": "https://en.wikipedia.org/wiki/Hanunoo_script"
  },
  {
    "id": "tagbanwa",
    "latitude": 9.8,
    "longitude": 118.7,
    "precision": "region",
    "label": "Palawan, Philippines",
    "note": "Indigenous to Palawan; precise development site unknown.",
    "source": "https://en.wikipedia.org/wiki/Tagbanwa_script"
  },
  {
    "id": "rejang",
    "latitude": -3.8,
    "longitude": 102.3,
    "precision": "region",
    "label": "Bengkulu, Sumatra",
    "note": "Associated with Bengkulu and southern Sumatra.",
    "source": "https://en.wikipedia.org/wiki/Rejang_alphabet"
  },
  {
    "id": "lontara",
    "latitude": -4.5,
    "longitude": 119.8,
    "precision": "region",
    "label": "South Sulawesi",
    "note": "Developed among Bugis and Makassar communities.",
    "source": "https://en.wikipedia.org/wiki/Lontara_script"
  },
  {
    "id": "batak",
    "latitude": 2.3,
    "longitude": 99,
    "precision": "region",
    "label": "North Sumatra",
    "note": "Developed in the Batak regions of northern Sumatra.",
    "source": "https://en.wikipedia.org/wiki/Batak_script"
  },
  {
    "id": "sundanese",
    "latitude": -6.9,
    "longitude": 107.6,
    "precision": "region",
    "label": "West Java",
    "note": "Associated with West Java; early evidence is regional.",
    "source": "https://en.wikipedia.org/wiki/Sundanese_script"
  },
  {
    "id": "serbian-cyrillic",
    "latitude": 44,
    "longitude": 20.9,
    "precision": "broad",
    "label": "Medieval Serbia",
    "note": "Broad regional centroid; the alphabet originated in medieval Serbia and was substantially reformed there in the 19th century.",
    "source": "https://en.wikipedia.org/wiki/Serbian_Cyrillic_alphabet"
  },
  {
    "id": "lisu",
    "latitude": 25,
    "longitude": 98.5,
    "precision": "region",
    "label": "Yunnan–northern Myanmar borderlands",
    "note": "Regional centroid for the Yunnan and adjacent Myanmar area associated with James O. Fraser’s early development of the Fraser/Lisu script.",
    "source": "https://en.wikipedia.org/wiki/Fraser_script"
  },
  {
    "id": "mundari-bani",
    "latitude": 23.6,
    "longitude": 85.3,
    "precision": "region",
    "label": "Jharkhand, India",
    "note": "Created in eastern India in the late twentieth century.",
    "source": "https://en.wikipedia.org/wiki/Mundari_Bani"
  },
  {
    "id": "tangsa",
    "latitude": 27,
    "longitude": 95,
    "precision": "region",
    "label": "Arunachal Pradesh–Myanmar borderland",
    "note": "Created in 1990 in the regional borderland.",
    "source": "https://www.unicode.org/L2/L2021/21027-tangsa.pdf"
  },
  {
    "id": "wancho",
    "latitude": 27.2,
    "longitude": 95,
    "precision": "region",
    "label": "Arunachal Pradesh, India",
    "note": "Created in the early twenty-first century in Arunachal Pradesh.",
    "source": "https://indianexpress.com/article/north-east-india/arunachal-pradesh/meet-banwang-losu-arunachal-man-who-scripted-history-by-creating-new-alphabet-for-ancient-tribal-language-5903790/"
  },
  {
    "id": "medefaidrin",
    "latitude": 5.2,
    "longitude": 7.8,
    "precision": "region",
    "label": "Akwa Ibom State, Nigeria",
    "note": "Regional origin assignment; Medefaidrin was created in the 1930s by Ibibio-speaking communities in Akwa Ibom, without a securely documented single invention site.",
    "source": "https://en.wikipedia.org/wiki/Medefaidrin"
  }
] as OriginRecord[];

export const mappedOrigins = originRecords.filter(
  (record): record is OriginRecord & { latitude: number; longitude: number } =>
    record.latitude !== null && record.longitude !== null,
);

export const originByScriptId = new Map(originRecords.map((record) => [record.id, record]));

export const ORIGIN_MAP_STATS = { mapped: 160, withheld: 4, total: 164 } as const;
