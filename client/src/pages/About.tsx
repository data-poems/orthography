/**
 * A reading page, so the measure narrows and the ruling shows. Single column
 * of body text with a ruled left margin holding the running heads. Vermilion
 * for section marks and the versal initial only.
 */
import { Link } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PlateNav from "@/components/PlateNav";
import { allScripts, familyColors, familyLabels, type Family } from "@/data";


function Rubric({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 mt-10 text-[1.55rem] leading-tight">
      <span className="mr-2 text-[var(--rubric)]">¶</span>
      {children}
    </h2>
  );
}

export default function About() {
  const counts = allScripts.reduce<Record<string, number>>((acc, s) => {
    if (s.id === "root") return acc;
    acc[s.family] = (acc[s.family] ?? 0) + 1;
    return acc;
  }, {});
  const living = allScripts.filter((s) => s.status === "living").length;
  const order = Object.keys(counts).sort((a, b) => counts[b] - counts[a]) as Family[];

  return (
    <div className="grain min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-[var(--vellum-deep)]/95 px-4 py-2.5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <PlateNav />
        </div>
      </header>

      {/* Opening plate */}
      <div className="relative border-b border-border">
        <div
          className="flex h-[38vh] min-h-[240px] items-center justify-center gap-10 overflow-hidden px-6 text-[5rem] text-[var(--rubric)]/30"
          aria-hidden="true">
          <span>Α</span><span>अ</span><span>א</span><span>A</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--vellum)] via-[var(--vellum)]/20 to-transparent" />
        <div className="absolute bottom-5 left-0 right-0">
          <div className="mx-auto max-w-5xl px-6">
                        <h1 className="max-w-[36rem] text-[2.6rem] leading-[1.04]">
              Four inventions, and everything that followed
            </h1>
            <div className="caption mt-2.5">Plate III · the argument</div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-10 lg:grid-cols-[1fr_15rem]">
        <article className="max-w-[38rem]">
          <p className="mb-5 text-[1.1rem] leading-[1.6] text-[var(--ink-mid)]">
            Writing was invented independently no more than four times in human
            history, and possibly only three. Every other script on earth — all
            {" "}{allScripts.length - 1} in this atlas, and the several hundred more that
            have been catalogued — descends from one of those inventions, or was
            made by someone who had seen writing and worked out the rest alone.
          </p>

          <Rubric>The four independent inventions</Rubric>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            <span
              aria-hidden
              className="float-left mr-3 mt-1 leading-[0.78] text-[var(--rubric)]"
              style={{ fontFamily: "var(--font-display)", fontSize: "3.4rem" }}>
              S
            </span>
            Sumerian cuneiform emerged in Mesopotamia around 3400 BC, from clay
            tokens and accounting impressions rather than from any desire to
            record literature; the earliest tablets are receipts. Egyptian
            hieroglyphs appear at Abydos by about 3250 BC, in the tomb of a
            predynastic ruler, already using signs for sounds. Chinese writing is
            first securely attested on the Shang oracle bones of about 1250 BC,
            though its abstraction implies a long unrecorded development on
            perishable material. Mesoamerican writing appears with the Zapotec
            and Olmec around 900 BC, and reached its fullest form in Maya
            glyphs — a fully phonetic logosyllabary developed in complete
            isolation from the Old World.
          </p>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            Whether Egypt counts as independent is not settled. The two systems
            emerged within a century or two of each other in regions that traded,
            and it is possible that Egypt received the idea rather than the
            method. If so, writing was invented three times, not four.
          </p>

          <Rubric>The alphabet has one ancestor</Rubric>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            Every alphabet in use today, without exception, traces to a single
            small corpus of inscriptions from a turquoise mine. At Serabit
            el-Khadim in the Sinai, Semitic-speaking workers in Egyptian
            employment took hieroglyphs, discarded their Egyptian sound values,
            and assigned each one the first consonant of the Canaanite word for
            the object depicted. The hieroglyph for a house, pr, became the sign
            for /b/, because the Canaanite word was baytu — and it is still with
            us as bet, beta, and B. An ox-head, ʾalp, became the glottal stop;
            tipped over and eventually inverted, it is the letter A.
          </p>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            From Proto-Sinaitic came Phoenician, the first script with a fixed
            writing direction, and from Phoenician the tree divides in two. West,
            to the Greeks, who reassigned the letters they had no use for to
            vowels and so produced the first full alphabet; then to Etruscan,
            Latin, and eventually 2.6 billion users. East, to Aramaic, the
            administrative script of three successive empires, and from Aramaic
            to Hebrew, Syriac, Arabic, Mongolian, and — most probably — to Brahmi
            and the 198 scripts of India and Southeast Asia that descend from it.
          </p>

          <Rubric>Six ways to encode a language</Rubric>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            Scripts are usually sorted by what unit of language a single sign
            represents. A <em>logosyllabary</em> like Chinese assigns signs to
            morphemes. A <em>syllabary</em> like Cherokee or Japanese kana gives
            one sign per syllable, with no way to separate the consonant from the
            vowel. An <em>abjad</em> like Phoenician, Hebrew or Arabic writes only
            consonants and leaves vowels to the reader. An{" "}
            <em>alphabet</em> writes both as equal, independent letters. An{" "}
            <em>abugida</em> — the Brahmic solution, and Ge'ez — gives each
            consonant an inherent vowel that attached marks override. And a{" "}
            <em>featural</em> script like Hangul goes further still: the shape of
            the letter encodes how the sound is articulated.
          </p>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            These categories leak. Hebrew and Arabic mark vowels optionally, so
            Peter Daniels calls them impure abjads. Canadian syllabics indicate
            the vowel by rotating the consonant, which is either a featural
            syllabary or an abugida with a geometric twist depending on whom you
            ask. Thaana derives its consonants from Arabic numerals. The tree
            colours structural type as a filter rather than a verdict.
          </p>

          <Rubric>Materials leave marks on letterforms</Rubric>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            Cuneiform is wedge-shaped because a reed stylus pressed into clay
            makes wedges. Runes have no horizontal strokes because a horizontal
            cut follows the grain of wood and splits it. Odia, Burmese, Sinhala
            and Malayalam are built from arcs because a straight stylus stroke
            tears a palm leaf along its fibres. Egyptian hieratic is cursive
            because it was written with a brush on papyrus while hieroglyphs were
            cut in stone. The physical act of writing is legible in the letters
            centuries after the material was abandoned.
          </p>

          <Rubric>Someone invented these, and we often know who</Rubric>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            The romantic picture of scripts evolving anonymously over millennia
            is only half the story. Mesrop Mashtots designed the Armenian
            alphabet in AD 405 and it has needed two letters added since. Bishop
            Wulfila built the Gothic alphabet around 350 to translate the Bible.
            Sejong the Great promulgated Hangul in 1443 and published a treatise
            explaining his reasoning — the only major script whose design
            principles come to us from its inventor. Sequoyah, who could not read
            any language, worked out the Cherokee syllabary between 1809 and 1824
            by reasoning from the observation that marks on paper could carry
            speech.
          </p>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            It has continued into living memory. Solomana Kanté created N'Ko in
            1949 after being told African languages were unwritable. Raghunath
            Murmu designed Ol Chiki for Santali in 1925. Ibrahima and Abdoulaye
            Barry, aged fourteen and ten, began Adlam for Fula in 1989; it is now
            on Android keyboards. Herman Mongrain Lookout built the Osage script
            from 2006. In every case the motive was the same: an orthography of
            one's own, as an instrument of survival.
          </p>

          <Rubric>What the chart cannot tell you</Rubric>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            A tree diagram implies more confidence than the evidence supports, so
            the line styles carry the doubt. Brahmi's descent from Aramaic has
            been argued since 1856 and remains probable rather than proven, with
            Richard Salomon observing that both the Semitic-origin and
            indigenous-origin camps show national bias. Georgian's model is
            disputed between Greek, Aramaic and Armenian. The Indus script,
            Linear A, Cypro-Minoan, Rongorongo and the Voynich manuscript are
            undeciphered, and in several cases it is not certain they encode
            language at all.
          </p>
          <p className="mb-4 text-[16.5px] leading-[1.68]">
            Nor does a genealogy show loss. Egyptian hieroglyphs went unread from
            the fourth century AD until Champollion in 1822. Brahmi was
            illegible for fourteen centuries until James Prinsep recovered it in
            the 1830s. Nüshu, the syllabary used only by women in one county of
            Hunan, lost its last native writer in 2004. Of the{" "}
            {allScripts.length - 1} scripts here, {living} are in everyday use;
            the rest survive in liturgy, in scholarship, or not at all.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
            <Link
              href="/"
              className="caption inline-flex items-center gap-1.5 border border-border px-2.5 py-1 hover:border-[var(--rubric)] hover:text-[var(--rubric)]">
              <ArrowLeft size={11} /> Return to the chart
            </Link>
            <Link
              href="/specimens"
              className="caption inline-flex items-center gap-1.5 border border-border px-2.5 py-1 hover:border-[var(--rubric)] hover:text-[var(--rubric)]">
              The specimen sheet
            </Link>
            <a
              href="https://lukesteuber.com"
              target="_blank"
              rel="noopener noreferrer"
              className="caption inline-flex items-center gap-1 hover:text-[var(--rubric)]">
              lukesteuber.com <ArrowUpRight size={11} />
            </a>
            <a
              href="https://dr.eamer.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="caption inline-flex items-center gap-1 hover:text-[var(--rubric)]">
              dr.eamer.dev <ArrowUpRight size={11} />
            </a>
          </div>
        </article>

        {/* Marginal tally */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="specimen px-4 py-3.5">
            <div className="caption mb-2.5">The corpus, by branch</div>
            <dl className="grid gap-1">
              {order.map((f) => (
                <div key={f} className="flex items-baseline gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: familyColors[f] }}
                  />
                  <dt className="min-w-0 flex-1 truncate text-[13.5px] text-[var(--ink-mid)]">
                    {familyLabels[f]}
                  </dt>
                  <dd
                    className="text-[13px] text-[var(--ink)]"
                    style={{ fontFamily: "var(--font-mono)" }}>
                    {counts[f]}
                  </dd>
                </div>
              ))}
              <div className="mt-1.5 flex items-baseline gap-2 border-t border-border pt-1.5">
                <dt className="flex-1 text-[13.5px]">Total</dt>
                <dd
                  className="text-[13px] text-[var(--rubric)]"
                  style={{ fontFamily: "var(--font-mono)" }}>
                  {allScripts.length - 1}
                </dd>
              </div>
            </dl>
          </div>
          <p className="mt-3 text-[12.5px] leading-snug text-[var(--ink-faint)]">
            This is a curated selection, not a census. Roughly 300 scripts have
            been encoded in Unicode and the Brahmic family alone accounts for
            nearly 200 by one survey; the entries here were chosen to show every
            major branch point and every structural type.
          </p>
        </aside>
      </div>
    </div>
  );
}
