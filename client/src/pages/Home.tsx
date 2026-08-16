/**
 * STYLE REMINDER — Scriptorium Vellum
 * Three-column asymmetric page: ruled margin (controls) | full-bleed tree |
 * detail leaf sliding from the right. Never a centred hero. Vermilion is
 * reserved for structure and state.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ChevronsLeft,
  ChevronsRight,
  HelpCircle,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Crosshair,
} from "lucide-react";
import Dendrogram from "@/components/Dendrogram";
import DetailLeaf from "@/components/DetailLeaf";
import MarginColumn, { type Filters } from "@/components/MarginColumn";
import HelpDialog from "@/components/HelpDialog";
import PlateCartouche from "@/components/PlateCartouche";
import { allScripts, scriptById, typologyLabels } from "@/data";

const LOGO = "/manus-storage/aleph-mark-web_d69c2b44.png";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    query: "",
    families: new Set(),
    typologies: new Set(),
    statuses: new Set(),
  });
  const [cutoffYear, setCutoffYear] = useState<number | null>(null);
  const [showInfluences, setShowInfluences] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [marginOpen, setMarginOpen] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [animate, setAnimate] = useState(true);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<{
    focus: (id: string) => void;
    reset: () => void;
    zoomBy: (k: number) => void;
  } | null>(null);

  const registerControls = useCallback(
    (c: { focus: (id: string) => void; reset: () => void; zoomBy: (k: number) => void }) => {
      controlsRef.current = c;
    },
    [],
  );

  // Entrance draw happens once.
  useEffect(() => {
    const t = setTimeout(() => setAnimate(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const matchIds = useMemo(() => {
    const { query, families, typologies, statuses } = filters;
    const q = query.trim().toLowerCase();
    const noFilter =
      q === "" && families.size === 0 && typologies.size === 0 && statuses.size === 0;
    if (noFilter) return new Set<string>();
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

  const openScript = useCallback((id: string) => {
    setSelectedId(id);
    controlsRef.current?.focus(id);
  }, []);

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
      // Fullscreen can be blocked by permissions policy; fall back to a
      // layout-level expansion so the control is never dead.
      setFullscreen((v) => !v);
      setMarginOpen(false);
    }
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        document.getElementById("script-search")?.focus();
      }
      if (e.key === "?") setHelpOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={shellRef} className="grain flex h-screen w-full flex-col overflow-hidden bg-background">
      {/* Head band — the manuscript's running title */}
      <header className="relative z-20 flex shrink-0 items-center gap-4 border-b border-border bg-[var(--vellum-deep)] px-4 py-2.5">
        <button
          onClick={() => setMarginOpen((v) => !v)}
          aria-label={marginOpen ? "Collapse margin" : "Open margin"}
          className="apparatus flex items-center">
          {marginOpen ? <ChevronsLeft size={14} /> : <ChevronsRight size={14} />}
        </button>

        <Link href="/" className="flex items-baseline gap-2.5">
          <img src={LOGO} alt="" className="h-8 w-8 shrink-0 self-center" />
          <span
            className="text-[1.06rem] uppercase leading-none"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "0.17em",
              fontWeight: 600,
            }}>
            The Tree of Writing
          </span>
        </Link>

        <span className="caption hidden text-[10px] lg:inline">
          A genealogy of 127 scripts · 3400 BC – present
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href="/about"
            className="caption hidden px-2 py-1 hover:text-[var(--rubric)] sm:inline">
            Essay
          </Link>
          <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <button
            onClick={() => controlsRef.current?.zoomBy(0.8)}
            aria-label="Zoom out"
            className="apparatus flex items-center">
            <Minus size={13} />
          </button>
          <button
            onClick={() => controlsRef.current?.zoomBy(1.25)}
            aria-label="Zoom in"
            className="apparatus flex items-center">
            <Plus size={13} />
          </button>
          <button
            onClick={() => controlsRef.current?.reset()}
            aria-label="Reset view"
            className="apparatus flex items-center">
            <Crosshair size={13} />
          </button>
          <button
            onClick={toggleFullscreen}
            aria-label={fullscreen ? "Exit full screen" : "Full screen"}
            className="apparatus flex items-center">
            {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button
            onClick={() => setHelpOpen(true)}
            aria-label="How to read this chart"
            className="apparatus flex items-center">
            <HelpCircle size={13} />
          </button>
        </div>
      </header>

      {/* The page: margin | tree | leaf */}
      <div className="relative flex min-h-0 flex-1">
        {/* Ruled left margin */}
        <div
          className="pricked relative z-10 shrink-0 overflow-hidden border-r border-border bg-[var(--vellum-deep)]"
          style={{
            width: marginOpen ? 258 : 0,
            transition: "width 260ms var(--ease-out)",
          }}>
          <div style={{ width: 258 }} className="h-full">
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
            />
          </div>
        </div>

        {/* Full-bleed tree */}
        <main className="relative min-w-0 flex-1">
          <Dendrogram
            selectedId={selectedId}
            onSelect={setSelectedId}
            matchIds={matchIds}
            cutoffYear={cutoffYear}
            showInfluences={showInfluences}
            showLabels={showLabels}
            animate={animate}
            registerControls={registerControls}
          />

          {/* The plate's own titling block and key to the four inventions. */}
          {!selected && (
            <PlateCartouche onSelect={openScript} activeId={selectedId} />
          )}

          {/* Standing epigraph, bottom-left, out of the tree's way */}
          {!selected && (
            <div className="pointer-events-none absolute bottom-6 left-6 max-w-[21rem]">
              <p
                className="settle text-[1.32rem] leading-[1.28]"
                style={{ fontFamily: "var(--font-display)", ["--delay" as string]: "500ms" }}>
                Four times, independently, humans invented writing.
                <span className="text-[var(--rubric)]"> Everything else is inheritance.</span>
              </p>
              <p
                className="settle mt-2 text-[13.5px] italic leading-snug text-[var(--ink-faint)]"
                style={{ ["--delay" as string]: "700ms" }}>
                Hover any node to illuminate its line of descent back to the
                point of invention. Click to open the leaf.
              </p>
            </div>
          )}
        </main>

        {/* Detail leaf */}
        <div
          className="relative z-10 shrink-0 overflow-hidden"
          style={{
            width: selected ? "min(30rem, 42vw)" : 0,
            transition: "width 260ms var(--ease-out)",
          }}>
          {selected && (
            <DetailLeaf
              node={selected}
              onClose={() => setSelectedId(null)}
              onNavigate={openScript}
            />
          )}
        </div>
      </div>

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
