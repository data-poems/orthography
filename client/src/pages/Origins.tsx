/**
 * Plate IV is a historical atlas leaf: no contemporary tiles, no territorial
 * claims. Its quiet map base is an engraved field; inked points show historical
 * places of development or first secure attestation, and their precision is
 * always declared.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Crosshair, MapPinned, Minus, Plus, Route as RouteIcon, X } from "lucide-react";
import DetailLeaf from "@/components/DetailLeaf";
import OriginMap, { type OriginMapHandle } from "@/components/OriginMap";
import PlateNav from "@/components/PlateNav";
import { allScripts, familyColors, familyLabels, scriptById, type Family } from "@/data";
import { ORIGIN_MAP_STATS, originByScriptId } from "@/data/origins";
import { transmissionRoutes, type RouteEvidence } from "@/data/routes";
import { useViewport } from "@/hooks/useViewport";

const families = Array.from(
  new Set(allScripts.filter((script) => script.id !== "root").map((script) => script.family)),
) as Family[];
const routeEvidenceOptions: { id: RouteEvidence; label: string; gloss: string }[] = [
  { id: "attested", label: "Attested", gloss: "documented transmission" },
  { id: "probable", label: "Proposed", gloss: "qualified proposal" },
  { id: "adaptation", label: "Adapted", gloss: "cultural adaptation" },
];

export default function Origins() {
  const viewport = useViewport();
  const isPhone = viewport === "phone";
  const controlsRef = useRef<OriginMapHandle | null>(null);
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<Family | "all">("all");
  const [showRoutes, setShowRoutes] = useState(true);
  const [routeEvidence, setRouteEvidence] = useState<Set<RouteEvidence>>(
    () => new Set(routeEvidenceOptions.map((option) => option.id)),
  );
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
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
    controlsRef.current?.focus(id);
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
  useEffect(() => {
    if (!selectedId) return;
    const frame = requestAnimationFrame(() => controlsRef.current?.focus(selectedId));
    return () => cancelAnimationFrame(frame);
  }, [selectedId, viewport]);
  useEffect(() => {
    if (!activeRouteId) return;
    const route = transmissionRoutes.find((candidate) => candidate.id === activeRouteId);
    if (route && !routeEvidence.has(route.evidence)) setActiveRouteId(null);
  }, [activeRouteId, routeEvidence]);

  const visibleIds = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const ids = new Set<string>();
    for (const script of allScripts) {
      if (script.id === "root" || !originByScriptId.get(script.id)?.latitude) continue;
      if (family !== "all" && script.family !== family) continue;
      const origin = originByScriptId.get(script.id)!;
      const text = [script.name, script.endonym ?? "", script.region, origin.label, ...script.languages].join(" ").toLowerCase();
      if (needle && !text.includes(needle)) continue;
      ids.add(script.id);
    }
    return ids;
  }, [query, family]);

  const filtered = query.trim() !== "" || family !== "all";
  const activeRoute = activeRouteId ? transmissionRoutes.find((route) => route.id === activeRouteId) : undefined;
  const routeLegend: Record<RouteEvidence, string> = { attested: "solid", probable: "dashed", adaptation: "dotted" };
  const toggleRouteEvidence = (evidence: RouteEvidence) => {
    setRouteEvidence((current) => {
      const next = new Set(current);
      if (next.has(evidence)) next.delete(evidence);
      else next.add(evidence);
      return next;
    });
  };
  return (
    <div className="atlas-leaf grain flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-[var(--vellum-deep)]/95 px-4 py-2.5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[96rem] items-center gap-4">
          {isPhone ? (
            <Link href="/" className="caption inline-flex items-center gap-1.5 hover:text-[var(--rubric)]">
              <ArrowLeft size={12} /> Chart
            </Link>
          ) : (
            <PlateNav />
          )}
          <span className="caption ml-auto shrink-0 text-[9px]">{ORIGIN_MAP_STATS.mapped} mapped origins</span>
        </div>
      </header>

      <section className="border-b border-border bg-[var(--vellum-wash)]">
        <div className="mx-auto max-w-[96rem] px-5 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-12">
          <div className="caption mb-3 text-[10px]">Plate IV · geographic origins</div>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.72fr)] lg:items-end">
            <div className="max-w-[48rem]">
              <h1 className="text-[2.1rem] leading-[1.02] sm:text-[3.1rem]">
                Places where writing
                <br />
                <span className="text-[var(--rubric)]">took form.</span>
              </h1>
              <p className="mt-4 max-w-[41rem] text-[1.02rem] leading-[1.5] text-[var(--ink-mid)]">
                {ORIGIN_MAP_STATS.mapped} records locate a script’s historically attested development or first secure corpus — not its present-day territory. {ORIGIN_MAP_STATS.withheld} are deliberately left unpinned where the evidence cannot support a single honest location.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <label className="relative block">
                <span className="sr-only">Search origins</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find a script, place, or language"
                  className="atlas-slip h-10 w-full px-3 text-[0.95rem] outline-none focus:border-[var(--rubric)]"
                />
              </label>
              <select
                value={family}
                onChange={(event) => setFamily(event.target.value as Family | "all")}
                aria-label="Limit map to a writing-system family"
                className="atlas-register h-10 px-3 outline-none focus:border-[var(--rubric)]"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
                <option value="all">All branches</option>
                {families.map((id) => <option value={id} key={id}>{familyLabels[id]}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-[96rem] flex-1 flex-col px-4 pb-8 pt-4 sm:px-8 sm:pt-6">
        <div className="atlas-frame pricked relative min-h-[30rem] flex-1 overflow-hidden border border-border bg-[var(--vellum)] sm:min-h-[36rem]">
          <OriginMap
            ids={filtered ? visibleIds : new Set()}
            selectedId={selectedId}
            onSelect={openScript}
            showRoutes={showRoutes}
            routeEvidence={routeEvidence}
            activeRouteId={activeRouteId}
            onRouteSelect={(id) => setActiveRouteId((current) => current === id ? null : id)}
            registerControls={(controls) => { controlsRef.current = controls; }}
          />
          <div className="absolute bottom-3 left-3 z-10 max-w-[17rem] border border-border bg-[var(--vellum)]/95 px-3 py-2 backdrop-blur-sm">
            <div className="caption text-[9px]">How to read the marks</div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.78rem] text-[var(--ink-mid)]">
              <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--ink)] align-[1px]" />site</span>
              <span><i className="mr-1 inline-block h-2 w-2 rounded-full border border-[var(--ink)] bg-[var(--vellum)] align-[1px]" />region</span>
              <span><i className="mr-1 inline-block h-2 w-2 rounded-full border border-dashed border-[var(--ink)] align-[1px]" />broad</span>
            </div>
            {showRoutes && <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 border-t border-border/70 pt-1.5 text-[0.68rem] text-[var(--ink-mid)]"><span><i className="mr-1 inline-block w-3 border-t border-[var(--ink-mid)] align-[3px]" />attested route</span><span><i className="mr-1 inline-block w-3 border-t border-dashed border-[var(--ink-mid)] align-[3px]" />qualified proposal</span><span><i className="mr-1 inline-block w-3 border-t border-dotted border-[var(--ink-mid)] align-[3px]" />cultural adaptation</span></div>}
            {showRoutes && <div className="mt-1.5 border-t border-border/70 pt-1.5"><div className="caption mb-1 text-[8px]">Route evidence</div><div className="flex flex-wrap"><span className="sr-only">Filter historical routes by evidence</span>{routeEvidenceOptions.map((option) => <button key={option.id} onClick={() => toggleRouteEvidence(option.id)} aria-pressed={routeEvidence.has(option.id)} title={option.gloss} className={`apparatus px-1.5 py-1 text-[8px] ${routeEvidence.has(option.id) ? "text-[var(--rubric)]" : "line-through opacity-45"}`}>{option.label}</button>)}</div></div>}
            <p className="mt-1.5 text-[0.72rem] italic leading-snug text-[var(--ink-faint)]">Clusters carry a count at overview; tap one to separate its records. Drag to inspect dense areas; a point is a historical reference, not a boundary.</p>
          </div>
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
            <button onClick={() => controlsRef.current?.zoomBy(1.4)} className="atlas-tool rail-btn" aria-label="Zoom in"><Plus size={15} /></button>
            <button onClick={() => controlsRef.current?.zoomBy(0.72)} className="atlas-tool rail-btn" aria-label="Zoom out"><Minus size={15} /></button>
            <button onClick={() => controlsRef.current?.reset()} className="atlas-tool rail-btn" aria-label="Reset map"><Crosshair size={15} /></button>
            <button onClick={() => setShowRoutes((value) => !value)} className={`atlas-tool rail-btn ${showRoutes ? "text-[var(--rubric)]" : ""}`} aria-label={showRoutes ? "Hide historical transmission routes" : "Show historical transmission routes"}><RouteIcon size={15} /></button>
          </div>
          {activeRoute && (
            <aside className="absolute bottom-3 right-3 z-10 max-w-[20rem] border border-border bg-[var(--vellum)]/95 px-3 py-2.5 shadow-[0_8px_20px_-14px_oklch(0.28_0.022_55/0.55)] backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="caption text-[9px]">{routeLegend[activeRoute.evidence]} historical route · {activeRoute.period}</div>
                  <h2 className="mt-0.5 font-[var(--font-display)] text-[1.08rem] leading-tight">{activeRoute.label}</h2>
                </div>
                <button onClick={() => setActiveRouteId(null)} className="atlas-tool -mr-1 -mt-1 flex h-7 w-7 items-center justify-center" aria-label="Close route annotation"><X size={13} /></button>
              </div>
              <p className="mt-1.5 text-[0.8rem] italic leading-snug text-[var(--ink-mid)]">{activeRoute.note}</p>
              <a href={activeRoute.source} target="_blank" rel="noopener noreferrer" className="caption mt-2 inline-block border-b border-border pb-px text-[9px] hover:border-[var(--rubric)] hover:text-[var(--rubric)]">Route basis ↗</a>
            </aside>
          )}
        </div>

        <footer className="flex flex-col gap-3 border-b border-border py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="caption text-[9px]">Historical mapping register</div>
            <p className="mt-1 max-w-[52rem] text-[0.88rem] leading-snug text-[var(--ink-mid)]">The map works from specific sites where the record permits, regional centroids where development is geographically distributed, and broad cultural zones where a single origin would overstate the evidence. Historical corridors distinguish attested transmission, qualified proposals, and cultural adaptation. Branch color follows the genealogy plate.</p>
          </div>
          <span className="caption whitespace-nowrap text-[9px]">{filtered ? `${visibleIds.size} shown` : `${ORIGIN_MAP_STATS.mapped} shown`} · {ORIGIN_MAP_STATS.withheld} withheld</span>
        </footer>
      </main>

      {selected && (
        <>
          <button aria-label="Close detail" onClick={closeScript} className="fixed inset-0 z-40 bg-[oklch(0.28_0.022_55)]/20" style={{ animation: "fade-in 160ms var(--ease-out)" }} />
          <div className={isPhone ? "fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col rounded-t-[3px] border-t border-border" : "fixed bottom-0 right-0 top-0 z-50 flex w-[min(28rem,42vw)] flex-col border-l border-border"} style={{ animation: isPhone ? "sheet-up 260ms var(--ease-out)" : "leaf-in-right 240ms var(--ease-out)" }}>
            <DetailLeaf node={selected} onClose={closeScript} onNavigate={openScript} handle={isPhone} />
          </div>
        </>
      )}
    </div>
  );
}
