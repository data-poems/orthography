/**
 * The plate owns the page. Chrome is reduced to a hairline apparatus rail and a
 * floating wordmark; the margin apparatus and the detail leaf are summoned, not
 * permanently mounted. On a phone the plate stays full-bleed and everything
 * else arrives as a sheet from the foot of the page.
 * Vermilion is reserved for structure and active state.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  Crosshair,
  HelpCircle,
  LayoutGrid,
  List,
  MapPinned,
  Maximize2,
  Minimize2,
  Minus,
  Network,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Dendrogram from "@/components/Dendrogram";
import DetailLeaf from "@/components/DetailLeaf";
import MarginColumn, { type Filters } from "@/components/MarginColumn";
import HelpDialog from "@/components/HelpDialog";
import PlateCartouche from "@/components/PlateCartouche";
import ScriptIndex from "@/components/ScriptIndex";
import { allScripts, scriptById, typologyLabels } from "@/data";
import { useViewport } from "@/hooks/useViewport";
import { assetUrl } from "@/lib/asset";

const LOGO = assetUrl("media/writing-mark.svg");
const CORPUS_COUNT = allScripts.filter((s) => s.id !== "root").length;

export default function Home() {
  const viewport = useViewport();
  const isPhone = viewport === "phone";
  const isDesktop = viewport === "desktop";

  /** A selected script is addressable: `/?script=devanagari`, for example. */
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const id = new URLSearchParams(window.location.search).get("script");
    return id && id !== "root" && scriptById.has(id) ? id : null;
  });
  const [filters, setFilters] = useState<Filters>({
    query: "",
    families: new Set(),
    typologies: new Set(),
    statuses: new Set(),
  });
  const [cutoffYear, setCutoffYear] = useState<number | null>(null);
  const [showInfluences, setShowInfluences] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [apparatusOpen, setApparatusOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [animate, setAnimate] = useState(true);
  /**
   * Phone view mode. The radial plate is the argument, but 164 nodes cannot be
   * found by pinching on a 390px screen, so the corpus is equally available as a
   * ruled index. The index is the default entry on a phone: it answers "what is
   * here" immediately, and the plate answers "how is it related" once a script
   * has been chosen.
   */
  const [phoneMode, setPhoneMode] = useState<"index" | "plate">(() =>
    new URLSearchParams(window.location.search).has("script") ? "plate" : "index",
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<{
    focus: (id: string) => void;
    reset: () => void;
    zoomBy: (k: number) => void;
  } | null>(null);

  const registerControls = useCallback(
    (c: {
      focus: (id: string) => void;
      reset: () => void;
      zoomBy: (k: number) => void;
    }) => {
      controlsRef.current = c;
    },
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => setAnimate(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const matchIds = useMemo(() => {
    const { query, families, typologies, statuses } = filters;
    const q = query.trim().toLowerCase();
    if (
      q === "" &&
      families.size === 0 &&
      typologies.size === 0 &&
      statuses.size === 0
    )
      return new Set<string>();
    const out = new Set<string>();
    for (const s of allScripts) {
      if (s.id === "root") continue;
      if (families.size > 0 && !families.has(s.family)) continue;
      if (typologies.size > 0 && !typologies.has(s.typology)) continue;
      if (statuses.size > 0 && !statuses.has(s.status)) continue;
      if (q) {
        const hay = [
          s.name,
          s.endonym ?? "",
          s.region,
          s.period,
          s.tagline,
          s.iso ?? "",
          typologyLabels[s.typology],
          s.languages.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) continue;
      }
      out.add(s.id);
    }
    return out;
  }, [filters]);

  const matchCount = matchIds.size > 0 ? matchIds.size : null;
  const selected = selectedId ? scriptById.get(selectedId) : undefined;
  const anyFilter =
    filters.query.length > 0 ||
    filters.families.size > 0 ||
    filters.typologies.size > 0 ||
    filters.statuses.size > 0 ||
    cutoffYear !== null;

  const writeScriptToUrl = useCallback((id: string | null) => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("script", id);
    else url.searchParams.delete("script");
    window.history.pushState({}, "", url);
  }, []);

  const openScript = useCallback((id: string) => {
    setSelectedId(id);
    writeScriptToUrl(id);
    controlsRef.current?.focus(id);
  }, [writeScriptToUrl]);

  const closeScript = useCallback(() => {
    setSelectedId(null);
    writeScriptToUrl(null);
  }, [writeScriptToUrl]);

  /** Browser Back/Forward follows the reader's inspection trail. */
  useEffect(() => {
    const onPopState = () => {
      const id = new URLSearchParams(window.location.search).get("script");
      setSelectedId(id && id !== "root" && scriptById.has(id) ? id : null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /** A cold deep link should bring its script into the plate's field. */
  useEffect(() => {
    if (!selectedId) return;
    const frame = requestAnimationFrame(() => controlsRef.current?.focus(selectedId));
    return () => cancelAnimationFrame(frame);
  }, [selectedId, viewport]);

  const toggleFullscreen = useCallback(async () => {
    const el = shellRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {
      setFullscreen((v) => !v);
      setApparatusOpen(false);
    }
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedId) closeScript();
        else if (apparatusOpen) setApparatusOpen(false);
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setApparatusOpen(true);
        requestAnimationFrame(() =>
          document.getElementById("script-search")?.focus(),
        );
      }
      if (e.key === "?") setHelpOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, apparatusOpen, closeScript]);

  /* ── Apparatus rail: hairline, vertical, hugging the right edge ────── */
  const rail = (
    <div
      className="pointer-events-auto absolute right-4 top-4 z-20 flex flex-col gap-1">
      <button
        onClick={() => setApparatusOpen(true)}
        aria-label="Search and filter"
        className="rail-btn">
        <Search size={15} />
      </button>
      <button
        onClick={() => setApparatusOpen(true)}
        aria-label="Open apparatus"
        className="rail-btn relative">
        <SlidersHorizontal size={15} />
        {anyFilter && (
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[var(--rubric)]" />
        )}
      </button>
      <span className="my-0.5 h-px w-5 bg-border" />
      <button
        onClick={() => controlsRef.current?.zoomBy(1.3)}
        aria-label="Zoom in"
        className="rail-btn">
        <Plus size={15} />
      </button>
      <button
        onClick={() => controlsRef.current?.zoomBy(0.77)}
        aria-label="Zoom out"
        className="rail-btn">
        <Minus size={15} />
      </button>
      <button
        onClick={() => controlsRef.current?.reset()}
        aria-label="Reset view"
        className="rail-btn">
        <Crosshair size={15} />
      </button>
      <span className="my-0.5 h-px w-5 bg-border" />
      <button
        onClick={toggleFullscreen}
        aria-label={fullscreen ? "Exit full screen" : "Full screen"}
        className="rail-btn">
        {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>
      <Link
        href="/specimens"
        aria-label="The specimen sheet"
        title="Plate II — every specimen on one sheet"
        className="rail-btn">
        <LayoutGrid size={15} />
      </Link>
      <Link
        href="/origins"
        aria-label="Plate IV — geographic origins"
        title="Plate IV — places where writing took form"
        className="rail-btn">
        <MapPinned size={15} />
      </Link>
      <button
        onClick={() => setHelpOpen(true)}
        aria-label="How to read this chart"
        className="rail-btn">
        <HelpCircle size={15} />
      </button>
    </div>
  );

  // A chrome-free plate for gallery embeds and captures, using the same renderer.
  if (document.documentElement.dataset.bare === "true") {
    return <main className="h-[100dvh] w-full bg-background"><Dendrogram selectedId={null} onSelect={openScript} matchIds={matchIds} cutoffYear={null} showInfluences showLabels animate={false} /></main>;
  }

  /* ── Phone: a different application, not a squeezed desktop ─────────── */
  if (isPhone) {
    return (
      <div
        ref={shellRef}
        className="grain relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background">
        {/* Fixed head: wordmark, count, essay. Always present, so a phone
            visitor is never lost inside a zoomed chart. */}
        <header className="relative z-20 shrink-0 border-b border-border bg-[var(--vellum)]/95 backdrop-blur-[2px]">
          <div className="flex items-center gap-2.5 px-4 pb-2 pt-3">
            <img src={LOGO} alt="" className="h-[26px] w-[26px] shrink-0" />
            <div className="min-w-0 flex-1">
              <h1
                className="truncate text-[0.9rem] uppercase leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.14em",
                  fontWeight: 600,
                }}>
                The Tree of Writing
              </h1>
              <p className="caption mt-1 text-[9px]">
                {matchCount ?? CORPUS_COUNT} of {CORPUS_COUNT} scripts
                {anyFilter ? " · filtered" : ""}
              </p>
            </div>
            <Link
              href="/about"
              className="caption shrink-0 border-b border-border pb-0.5 text-[9.5px]">
              Essay
            </Link>
            <Link
              href="/specimens"
              className="caption shrink-0 border-b border-border pb-0.5 text-[9.5px]">
              Sheet
            </Link>
            <Link
              href="/origins"
              className="caption shrink-0 border-b border-border pb-0.5 text-[9.5px]">
              Map
            </Link>
          </div>

          {/* Search is a first-class control on a phone, not buried in a sheet. */}
          <div className="flex items-center gap-2 px-4 pb-2.5">
            <div className="relative flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
              />
              <input
                id="script-search"
                value={filters.query}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, query: e.target.value }))
                }
                placeholder="Search scripts, regions, languages"
                className="h-11 w-full rounded-[2px] border border-border bg-[var(--vellum-deep)] pl-8 pr-9 text-[0.88rem] outline-none focus:border-[var(--rubric)]"
                style={{ fontFamily: "var(--font-body)" }}
              />
              {filters.query && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, query: "" }))}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 flex h-9 w-8 -translate-y-1/2 items-center justify-center">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setApparatusOpen(true)}
              aria-label="Filters"
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[2px] border border-border bg-[var(--vellum-deep)] active:scale-[0.97]"
              style={{ transition: "transform 160ms var(--ease-out)" }}>
              <SlidersHorizontal size={16} />
              {anyFilter && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--rubric)]" />
              )}
            </button>
          </div>
        </header>

        {/* Body: index or plate. Both stay mounted, so the chart keeps its zoom
            state when you switch back to it. */}
        <main className="relative min-h-0 flex-1">
          <div
            className={`absolute inset-0 ${
              phoneMode === "index" ? "" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={phoneMode !== "index"}>
            <ScriptIndex
              matchIds={matchIds}
              cutoffYear={cutoffYear}
              onSelect={openScript}
              selectedId={selectedId}
            />
          </div>
          <div
            className={`absolute inset-0 ${
              phoneMode === "plate" ? "" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={phoneMode !== "plate"}>
            <Dendrogram
              selectedId={selectedId}
              onSelect={openScript}
              matchIds={matchIds}
              cutoffYear={cutoffYear}
              showInfluences={showInfluences}
              showLabels={showLabels}
              animate={animate}
              compact
              registerControls={registerControls}
            />
          </div>
        </main>

        {/* Foot: mode switch and chart controls, inside thumb reach. */}
        <nav className="relative z-20 shrink-0 border-t border-border bg-[var(--vellum)]/95 backdrop-blur-[2px]">
          <div className="flex items-stretch gap-1.5 px-3 py-2">
            <div className="flex flex-1 rounded-[2px] border border-border bg-[var(--vellum-deep)] p-0.5">
              {(
                [
                  { id: "index", label: "Index", Icon: List },
                  { id: "plate", label: "Plate", Icon: Network },
                ] as const
              ).map(({ id, label, Icon }) => {
                const on = phoneMode === id;
                return (
                  <button
                    key={id}
                    onClick={() => setPhoneMode(id)}
                    aria-pressed={on}
                    className="flex h-10 flex-1 items-center justify-center gap-1.5"
                    style={{
                      background: on ? "var(--vellum)" : "transparent",
                      color: on ? "var(--rubric)" : "var(--ink-faint)",
                      boxShadow: on
                        ? "0 1px 3px oklch(0.28 0.022 55 / 0.1)"
                        : undefined,
                      transition:
                        "background 160ms var(--ease-out), color 160ms var(--ease-out)",
                    }}>
                    <Icon size={15} />
                    <span
                      className="text-[10px] uppercase"
                      style={{
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.15em",
                      }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
            {phoneMode === "plate" && (
              <>
                <button
                  onClick={() => controlsRef.current?.zoomBy(1.35)}
                  aria-label="Zoom in"
                  className="phone-btn">
                  <Plus size={17} />
                </button>
                <button
                  onClick={() => controlsRef.current?.zoomBy(0.74)}
                  aria-label="Zoom out"
                  className="phone-btn">
                  <Minus size={17} />
                </button>
                <button
                  onClick={() => controlsRef.current?.reset()}
                  aria-label="Reset view"
                  className="phone-btn">
                  <Crosshair size={17} />
                </button>
              </>
            )}
            <button
              onClick={() => setHelpOpen(true)}
              aria-label="How to read this"
              className="phone-btn">
              <HelpCircle size={17} />
            </button>
          </div>
        </nav>

        {/* Filters sheet */}
        {apparatusOpen && (
          <>
            <button
              aria-label="Close filters"
              onClick={() => setApparatusOpen(false)}
              className="fixed inset-0 z-30 bg-[oklch(0.28_0.022_55)]/25"
              style={{ animation: "fade-in 160ms var(--ease-out)" }}
            />
            <div
              className="pricked fixed inset-x-0 bottom-0 z-40 flex max-h-[86dvh] flex-col rounded-t-[3px] border-t border-border bg-[var(--vellum-deep)] shadow-[0_-2px_28px_oklch(0.28_0.022_55/0.18)]"
              style={{ animation: "sheet-up 260ms var(--ease-out)" }}>
              <div className="flex shrink-0 justify-center pb-1 pt-2.5">
                <span className="h-1 w-9 rounded-full bg-border" />
              </div>
              <div className="flex shrink-0 items-baseline gap-2 border-b border-border px-4 pb-2.5">
                <span className="text-[var(--rubric)]">¶</span>
                <span className="caption">Apparatus</span>
                <span className="field-rule mb-[3px] flex-1" />
                <button
                  onClick={() => setApparatusOpen(false)}
                  aria-label="Close"
                  className="phone-btn -my-1.5">
                  <X size={16} />
                </button>
              </div>
              <MarginColumn
                filters={filters}
                setFilters={setFilters}
                cutoffYear={cutoffYear}
                setCutoffYear={setCutoffYear}
                showInfluences={showInfluences}
                setShowInfluences={setShowInfluences}
                showLabels={showLabels}
                setShowLabels={setShowLabels}
                matchCount={matchCount}
                corpusCount={CORPUS_COUNT}
                coarse
                hideSearch
              />
            </div>
          </>
        )}

        {/* Detail sheet */}
        {selected && (
          <>
            <button
              aria-label="Close detail"
              onClick={closeScript}
              className="fixed inset-0 z-30 bg-[oklch(0.28_0.022_55)]/25"
              style={{ animation: "fade-in 160ms var(--ease-out)" }}
            />
            <div
              className="fixed inset-x-0 bottom-0 z-40 flex max-h-[90dvh] flex-col rounded-t-[3px] border-t border-border"
              style={{ animation: "sheet-up 260ms var(--ease-out)" }}>
              <DetailLeaf
                node={selected}
                onClose={closeScript}
                onNavigate={openScript}
                handle
                onShowInTree={(id) => {
                  setPhoneMode("plate");
                  openScript(id);
                }}
              />
            </div>
          </>
        )}

        <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
      </div>
    );
  }

  /* ── Desktop and tablet: the plate owns the page ─────────────────────── */
  return (
    <div
      ref={shellRef}
      className="grain relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background">
      <main className="relative min-h-0 flex-1">
        <Dendrogram
          selectedId={selectedId}
          onSelect={openScript}
          matchIds={matchIds}
          cutoffYear={cutoffYear}
          showInfluences={showInfluences}
          showLabels={showLabels}
          animate={animate}
          registerControls={registerControls}
        />

        {/* On desktop the cartouche carries the wordmark. On a tablet, where the
            cartouche is suppressed, the wordmark stands alone in the corner. */}
        {viewport === "tablet" && (
          <Link
            href="/about"
            className="group absolute left-5 top-4 z-20 flex items-center gap-2.5">
            <img src={LOGO} alt="" className="h-6 w-6 shrink-0" />
            <span
              className="text-[0.72rem] uppercase leading-none group-hover:text-[var(--rubric)]"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.2em",
                transition: "color 160ms var(--ease-out)",
              }}>
              The Tree of Writing
            </span>
          </Link>
        )}

        {rail}

        {/* Titling block and key to the four inventions — desktop only. */}
        {isDesktop && !selected && (
          <PlateCartouche
            onSelect={openScript}
            activeId={selectedId}
            corpusCount={CORPUS_COUNT}
          />
        )}

        {isDesktop && !selected && (
          <div className="pointer-events-none absolute bottom-6 left-6 max-w-[20rem]">
            <p
              className="settle text-[1.26rem] leading-[1.28]"
              style={{
                fontFamily: "var(--font-display)",
                ["--delay" as string]: "500ms",
              }}>
              Four times, independently, humans invented writing.
              <span className="text-[var(--rubric)]">
                {" "}
                Everything else is inheritance.
              </span>
            </p>
          </div>
        )}
      </main>

      {/* ── Apparatus: a leaf that slides in from the ruled margin ───────── */}
      {apparatusOpen && (
        <>
          <button
            aria-label="Close apparatus"
            onClick={() => setApparatusOpen(false)}
            className="fixed inset-0 z-30 bg-[oklch(0.28_0.022_55)]/15"
            style={{ animation: "fade-in 160ms var(--ease-out)" }}
          />
          <div
            className="pricked fixed bottom-0 left-0 top-0 z-40 flex w-[19rem] flex-col border-r border-border bg-[var(--vellum-deep)] shadow-[0_-2px_28px_oklch(0.28_0.022_55/0.14)]"
            style={{ animation: "leaf-in 240ms var(--ease-out)" }}>
            <div className="flex shrink-0 items-baseline gap-2 border-b border-border px-4 py-3">
              <span className="text-[var(--rubric)]">¶</span>
              <span className="caption">Apparatus</span>
              <span className="field-rule mb-[3px] flex-1" />
              <button
                onClick={() => setApparatusOpen(false)}
                aria-label="Close"
                className="rail-btn -my-1">
                <X size={15} />
              </button>
            </div>
            <MarginColumn
              filters={filters}
              setFilters={setFilters}
              cutoffYear={cutoffYear}
              setCutoffYear={setCutoffYear}
              showInfluences={showInfluences}
              setShowInfluences={setShowInfluences}
              showLabels={showLabels}
              setShowLabels={setShowLabels}
              matchCount={matchCount}
              corpusCount={CORPUS_COUNT}
            />
          </div>
        </>
      )}

      {/* ── Detail leaf: a panel on the right ───────────────────────────── */}
      {selected && (
        <div
          className="fixed bottom-0 right-0 top-0 z-40 flex w-[min(28rem,40vw)] flex-col border-l border-border"
          style={{ animation: "leaf-in-right 240ms var(--ease-out)" }}>
          <DetailLeaf
            node={selected}
            onClose={closeScript}
            onNavigate={openScript}
          />
        </div>
      )}

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
