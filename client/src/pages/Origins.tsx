/**
 * STYLE REMINDER — Scriptorium Vellum
 * Plate IV is a historical atlas leaf: no contemporary tiles, no territorial
 * claims. Its quiet map base is an engraved field; inked points show historical
 * places of development or first secure attestation, and their precision is
 * always declared.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Crosshair, MapPinned, Minus, Plus } from "lucide-react";
import DetailLeaf from "@/components/DetailLeaf";
import OriginMap, { type OriginMapHandle } from "@/components/OriginMap";
import PlateNav from "@/components/PlateNav";
import { allScripts, familyColors, familyLabels, scriptById, type Family } from "@/data";
import { ORIGIN_MAP_STATS, originByScriptId } from "@/data/origins";
import { useViewport } from "@/hooks/useViewport";

const families = Array.from(
  new Set(allScripts.filter((script) => script.id !== "root").map((script) => script.family)),
) as Family[];

export default function Origins() {
  const viewport = useViewport();
  const isPhone = viewport === "phone";
  const controlsRef = useRef<OriginMapHandle | null>(null);
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<Family | "all">("all");
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
            registerControls={(controls) => { controlsRef.current = controls; }}
          />
          <div className="absolute bottom-3 left-3 z-10 max-w-[17rem] border border-border bg-[var(--vellum)]/95 px-3 py-2 backdrop-blur-sm">
            <div className="caption text-[9px]">How to read the marks</div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.78rem] text-[var(--ink-mid)]">
              <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--ink)] align-[1px]" />site</span>
              <span><i className="mr-1 inline-block h-2 w-2 rounded-full border border-[var(--ink)] bg-[var(--vellum)] align-[1px]" />region</span>
              <span><i className="mr-1 inline-block h-2 w-2 rounded-full border border-dashed border-[var(--ink)] align-[1px]" />broad</span>
            </div>
            <p className="mt-1.5 text-[0.72rem] italic leading-snug text-[var(--ink-faint)]">Tap a point for the source-aware record. Drag to inspect dense areas; the point position is a historical reference, not a boundary.</p>
          </div>
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
            <button onClick={() => controlsRef.current?.zoomBy(1.4)} className="atlas-tool rail-btn" aria-label="Zoom in"><Plus size={15} /></button>
            <button onClick={() => controlsRef.current?.zoomBy(0.72)} className="atlas-tool rail-btn" aria-label="Zoom out"><Minus size={15} /></button>
            <button onClick={() => controlsRef.current?.reset()} className="atlas-tool rail-btn" aria-label="Reset map"><Crosshair size={15} /></button>
          </div>
        </div>

        <footer className="flex flex-col gap-3 border-b border-border py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="caption text-[9px]">Historical mapping register</div>
            <p className="mt-1 max-w-[52rem] text-[0.88rem] leading-snug text-[var(--ink-mid)]">The map works from specific sites where the record permits, regional centroids where development is geographically distributed, and broad cultural zones where a single origin would overstate the evidence. Branch color follows the genealogy plate.</p>
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
