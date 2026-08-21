/**
 * Plate II is a type foundry's specimen sheet, not a card grid. The glyph is the
 * only thing that carries size; every caption drops to mono at 9–10px so the
 * writing itself does the talking. Rules divide, boxes do not: cells are
 * separated by hairlines on a shared vellum ground, the way a broadside is set.
 * Vermilion only for the running rubric, the active arrangement, and hover.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Download, Loader2, Printer } from "lucide-react";
import DetailLeaf from "@/components/DetailLeaf";
import PlateNav from "@/components/PlateNav";
import { specimenOf } from "@/lib/specimen";
import { downloadPosterPdf } from "@/lib/poster-download";
import { useViewport } from "@/hooks/useViewport";
import {
  allScripts,
  familyColors,
  familyLabels,
  scriptById,
  typologyLabels,
  type Family,
  type ScriptNode,
  type Typology,
} from "@/data";

type Arrangement = "family" | "date" | "typology";

const ARRANGEMENTS: { id: Arrangement; label: string; gloss: string }[] = [
  {
    id: "family",
    label: "By descent",
    gloss: "Grouped by the branch each script belongs to.",
  },
  {
    id: "date",
    label: "By date",
    gloss: "Oldest first, from Uruk to the twenty-first century.",
  },
  {
    id: "typology",
    label: "By structure",
    gloss: "Grouped by what a single sign stands for.",
  },
];

/** Chronological ordering, oldest first, ties broken by name. */
const byDate = (a: ScriptNode, b: ScriptNode) =>
  a.yearStart - b.yearStart || a.name.localeCompare(b.name);

/** Century bands for the date arrangement — coarse enough to be readable. */
function era(year: number): string {
  if (year < -3000) return "Before 3000 BC";
  if (year < -1000) return "3000 – 1000 BC";
  if (year < 0) return "1000 BC – AD 1";
  if (year < 500) return "First five centuries AD";
  if (year < 1000) return "AD 500 – 1000";
  if (year < 1500) return "AD 1000 – 1500";
  if (year < 1800) return "AD 1500 – 1800";
  if (year < 1900) return "The nineteenth century";
  if (year < 2000) return "The twentieth century";
  return "Living memory";
}

interface Group {
  key: string;
  label: string;
  color: string | null;
  gloss: string | null;
  items: ScriptNode[];
}

export default function Gallery() {
  const viewport = useViewport();
  const isPhone = viewport === "phone";
  const sheetRef = useRef<HTMLElement | null>(null);
  const [arrangement, setArrangement] = useState<Arrangement>("family");
  const [downloading, setDownloading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const id = new URLSearchParams(window.location.search).get("script");
    return id && id !== "root" && scriptById.has(id) ? id : null;
  });
  const selected = selectedId ? scriptById.get(selectedId) : undefined;

  const writeScriptToUrl = useCallback((id: string | null) => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("script", id);
    else url.searchParams.delete("script");
    window.history.pushState({}, "", url);
  }, []);
  const openScript = useCallback((id: string) => {
    setSelectedId(id);
    writeScriptToUrl(id);
  }, [writeScriptToUrl]);
  const closeScript = useCallback(() => {
    setSelectedId(null);
    writeScriptToUrl(null);
  }, [writeScriptToUrl]);
  useEffect(() => {
    const onPopState = () => {
      const id = new URLSearchParams(window.location.search).get("script");
      setSelectedId(id && id !== "root" && scriptById.has(id) ? id : null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /** Everything that can honestly be shown, and the register that cannot. */
  const { shown, absent } = useMemo(() => {
    const shown: ScriptNode[] = [];
    const absent: ScriptNode[] = [];
    for (const s of allScripts) {
      if (s.id === "root") continue;
      (specimenOf(s).kind === "none" ? absent : shown).push(s);
    }
    return { shown, absent: absent.sort(byDate) };
  }, []);

  const groups = useMemo<Group[]>(() => {
    if (arrangement === "date") {
      const sorted = [...shown].sort(byDate);
      const out: Group[] = [];
      for (const s of sorted) {
        const key = era(s.yearStart);
        const last = out[out.length - 1];
        if (last?.key === key) last.items.push(s);
        else out.push({ key, label: key, color: null, gloss: null, items: [s] });
      }
      return out;
    }
    if (arrangement === "typology") {
      const map = new Map<Typology, ScriptNode[]>();
      for (const s of shown) {
        const arr = map.get(s.typology) ?? [];
        arr.push(s);
        map.set(s.typology, arr);
      }
      return Array.from(map.entries())
        .sort((a, b) => b[1].length - a[1].length)
        .map(([k, items]) => ({
          key: k,
          label: typologyLabels[k],
          color: null,
          gloss: null,
          items: items.sort(byDate),
        }));
    }
    const map = new Map<Family, ScriptNode[]>();
    for (const s of shown) {
      const arr = map.get(s.family) ?? [];
      arr.push(s);
      map.set(s.family, arr);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .map(([k, items]) => ({
        key: k,
        label: familyLabels[k],
        color: familyColors[k],
        gloss: null,
        items: items.sort(byDate),
      }));
  }, [arrangement, shown]);

  const activeGloss = ARRANGEMENTS.find((a) => a.id === arrangement)!.gloss;

  const downloadPoster = useCallback(async () => {
    if (!sheetRef.current || downloading) return;
    setDownloading(true);
    try {
      await downloadPosterPdf(sheetRef.current);
    } finally {
      setDownloading(false);
    }
  }, [downloading]);

  return (
    <div className="grain min-h-screen bg-background">
      {/* ── Running head ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-[var(--vellum-deep)]/95 px-4 py-2.5 backdrop-blur-sm print:hidden">
        <div className="mx-auto flex max-w-[92rem] items-center gap-4">
          {isPhone ? (
            <Link
              href="/"
              className="caption inline-flex items-center gap-1.5 hover:text-[var(--rubric)]">
              <ArrowLeft size={12} /> Chart
            </Link>
          ) : (
            <PlateNav />
          )}
          <span className="caption ml-auto shrink-0 text-[9px]">
            {shown.length} specimens
          </span>
        </div>
      </header>

      {/* ── Titling block ────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-[var(--vellum-wash)]">
        <div className="mx-auto max-w-[92rem] px-5 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-12">
          <div className="caption mb-3 text-[10px]">
            Plate II · specimen sheet
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[42rem]">
              <h1 className="text-[2.1rem] leading-[1.02] sm:text-[3.1rem]">
                Every script,
                <br />
                <span className="text-[var(--rubric)]">writing its own name</span>
              </h1>
              <p
                className="mt-4 max-w-[34rem] text-[1.02rem] leading-[1.5] text-[var(--ink-mid)]"
                style={{ fontFamily: "var(--font-body)" }}>
                {shown.length} specimens drawn from the corpus of{" "}
                {allScripts.length - 1}. Where a script has a name for itself, that
                name is the specimen — देवनागरी, ⠃⠗⠁⠊⠇⠇⠑, 𒅴𒂠. Where none survives,
                an attested word or the canonical letter run stands in its place.
              </p>
            </div>

            {/* Arrangement: three ways to read one sheet. */}
            <div className="shrink-0 lg:text-right">
              <div className="caption mb-2 text-[9px]">Arrangement</div>
              <div className="inline-flex flex-wrap items-stretch border border-border bg-[var(--vellum)]">
                {ARRANGEMENTS.map((a, i) => {
                  const on = arrangement === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setArrangement(a.id)}
                      aria-pressed={on}
                      className="px-3.5 py-2.5 text-[0.68rem] uppercase leading-none"
                      style={{
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.14em",
                        borderLeft: i > 0 ? "1px solid var(--border)" : undefined,
                        background: on ? "var(--vellum-wash)" : "transparent",
                        color: on ? "var(--rubric)" : "var(--ink-mid)",
                        transition:
                          "background 160ms var(--ease-out), color 160ms var(--ease-out)",
                      }}>
                      {a.label}
                    </button>
                  );
                })}
              </div>
              <p className="gloss mt-2 max-w-[15rem] text-[11.5px] italic leading-snug lg:ml-auto lg:text-left">
                {activeGloss}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── The sheet ────────────────────────────────────────────────────── */}
      <main
        id="specimen-sheet-export"
        ref={sheetRef}
        className="mx-auto max-w-[92rem] px-5 pb-24 sm:px-8">
        {groups.map((g, gi) => (
          <section key={g.key} className="pt-9 first:pt-7">
            {/* Running head for the group: rule, mark, count. */}
            <div className="mb-4 flex items-baseline gap-2.5">
              {g.color ? (
                <span
                  className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full"
                  style={{ background: g.color }}
                />
              ) : (
                <span className="text-[var(--rubric)]">¶</span>
              )}
              <h2
                className="shrink-0 text-[0.78rem] uppercase leading-none"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.18em",
                }}>
                {g.label}
              </h2>
              <span className="field-rule mb-[4px] min-w-6 flex-1" />
              <span className="caption shrink-0 text-[9px]">
                {g.items.length}
              </span>
            </div>

            {/* Specimen cells: hairline-ruled, no boxes. */}
            <ul
              className="grid border-l border-t border-border"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(" +
                  (isPhone ? "9.5rem" : "13rem") +
                  ", 1fr))",
              }}>
              {g.items.map((s, i) => {
                const spec = specimenOf(s);
                const on = selectedId === s.id;
                return (
                  <li key={s.id} className="border-b border-r border-border">
                    <button
                      onClick={() => openScript(s.id)}
                      className="group relative flex h-full min-h-[10.5rem] w-full flex-col items-start gap-2.5 px-3.5 py-4 text-left sm:min-h-[11.5rem]"
                      style={{
                        background: on ? "var(--vellum-wash)" : "transparent",
                        animation:
                          gi < 2
                            ? `fade-in 420ms var(--ease-out) ${Math.min(i * 24, 420)}ms both`
                            : undefined,
                        transition: "background 160ms var(--ease-out)",
                      }}>
                      {/* Family pigment: a hairline at the head of the cell. */}
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 h-[2px] w-0 group-hover:w-full"
                        style={{
                          background: familyColors[s.family],
                          width: on ? "100%" : undefined,
                          transition: "width 260ms var(--ease-out)",
                        }}
                      />
                      {/* The glyph. The only element allowed real size. */}
                      <span
                        className="flex w-full flex-1 items-center break-words text-[1.9rem] leading-[1.3] sm:text-[2.2rem]"
                        style={{
                          fontFamily: spec.font,
                          color: on ? "var(--rubric)" : "var(--ink)",
                          transition: "color 160ms var(--ease-out)",
                        }}>
                        {spec.text}
                      </span>
                      {/* Apparatus below the glyph, deliberately quiet. */}
                      <span className="mt-auto w-full">
                        <span
                          className="block truncate text-[0.92rem] leading-tight"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: on ? "var(--rubric)" : "var(--ink)",
                          }}>
                          {s.name}
                        </span>
                        <span className="caption-tight mt-1 flex items-baseline gap-1.5 text-[9.5px]">
                          <span>{s.period.split("–")[0].trim()}</span>
                          {s.iso && (
                            <>
                              <span className="text-[var(--ink-faint)]">·</span>
                              <span className="text-[var(--ink-faint)]">
                                {s.iso}
                              </span>
                            </>
                          )}
                        </span>
                        {spec.kind === "sample" && (
                          <span className="caption mt-1 block text-[8px]">
                            attested text
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        {/* ── Closing register: what cannot be shown, and why ─────────────── */}
        <section className="mt-14 border-t-2 border-[var(--ink)] pt-7">
          <div className="mb-3 flex items-baseline gap-2.5">
            <span className="text-[var(--rubric)]">¶</span>
            <h2
              className="shrink-0 text-[0.78rem] uppercase leading-none"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.18em",
              }}>
              No specimen possible
            </h2>
            <span className="field-rule mb-[4px] min-w-6 flex-1" />
            <span className="caption shrink-0 text-[9px]">{absent.length}</span>
          </div>
          <p
            className="mb-5 max-w-[40rem] text-[1rem] leading-[1.55] text-[var(--ink-mid)]"
            style={{ fontFamily: "var(--font-body)" }}>
            These {absent.length} scripts are absent from the sheet by choice. Some
            are undeciphered, so no one knows what their signs say. Some have no
            Unicode block, so a browser cannot draw them. Substituting another
            script's glyphs would make the sheet look complete and be a lie, so the
            names stand alone.
          </p>
          <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {absent.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => openScript(s.id)}
                  className="group flex w-full items-baseline gap-2.5 border-b border-dashed border-border pb-2 text-left">
                  <span
                    className="shrink-0 text-[1.02rem] italic leading-tight group-hover:text-[var(--rubric)]"
                    style={{
                      fontFamily: "var(--font-display)",
                      transition: "color 160ms var(--ease-out)",
                    }}>
                    {s.name}
                  </span>
                  <span className="field-rule mb-[5px] min-w-4 flex-1" />
                  <span className="caption-tight shrink-0 text-[9px] text-[var(--ink-faint)]">
                    {s.typology === "undeciphered" ? "undeciphered" : "unencoded"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Colophon */}
        <footer className="mt-16 border-t border-border pt-5">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="caption text-[9px]">
              Plate II · {shown.length} specimens · {absent.length} withheld
            </span>
            <span className="field-rule mb-[4px] min-w-6 flex-1" />
            <button
              onClick={() => window.print()}
              className="caption inline-flex items-center gap-1.5 text-[9px] hover:text-[var(--rubric)] print:hidden">
              <Printer size={11} /> Print this sheet
            </button>
            <button
              onClick={downloadPoster}
              disabled={downloading}
              className="caption inline-flex items-center gap-1.5 text-[9px] hover:text-[var(--rubric)] disabled:cursor-wait disabled:text-[var(--ink-faint)] print:hidden">
              {downloading ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
              {downloading ? "Building PDF…" : "Download poster PDF"}
            </button>
            <Link
              href="/about"
              className="caption text-[9px] hover:text-[var(--rubric)]">
              Read the essay
            </Link>
          </div>
          <p
            className="mt-3 max-w-[44rem] text-[0.92rem] italic leading-snug text-[var(--ink-faint)]"
            style={{ fontFamily: "var(--font-body)" }}>
            Specimens render in the fonts your system provides. Every string was
            checked codepoint by codepoint against its Unicode block; if a cell
            shows an empty box, the font for that script is missing rather than the
            data being wrong.
          </p>
        </footer>
      </main>

      {/* ── Detail: a leaf from the right, a sheet from the foot ─────────── */}
      {selected && (
        <>
          <button
            aria-label="Close detail"
            onClick={closeScript}
            className="fixed inset-0 z-40 bg-[oklch(0.28_0.022_55)]/20 print:hidden"
            style={{ animation: "fade-in 160ms var(--ease-out)" }}
          />
          <div
            className={
              isPhone
                ? "fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col rounded-t-[3px] border-t border-border print:hidden"
                : "fixed bottom-0 right-0 top-0 z-50 flex w-[min(28rem,42vw)] flex-col border-l border-border print:hidden"
            }
            style={{
              animation: isPhone
                ? "sheet-up 260ms var(--ease-out)"
                : "leaf-in-right 240ms var(--ease-out)",
            }}>
            <DetailLeaf
              node={selected}
              onClose={closeScript}
              onNavigate={openScript}
              handle={isPhone}
            />
          </div>
        </>
      )}
    </div>
  );
}
