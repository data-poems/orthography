/**
 * The tree is the page's illumination. Ink hierarchy carries structure;
 * vermilion marks ONLY the attended descent line. Hovering lifts a node and
 * illuminates its full lineage to the root, as a reader traces with a finger.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type ZoomBehavior, type D3ZoomEvent } from "d3-zoom";
import "d3-transition";
import {
  allScripts,
  ancestryOf,
  descendantsOf,
  familyColors,
  scriptById,
  type ScriptNode,
} from "@/data";
import { buildLayout, influenceArcs, labelTransform } from "@/lib/tree-layout";
import { shortSpecimen, specimenOf } from "@/lib/specimen";

export interface DendrogramProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Ids that pass the current filters. Non-matches fade to ghost ink. */
  matchIds: Set<string>;
  /** Timeline cutoff year; nodes originating later are dimmed. */
  cutoffYear: number | null;
  showInfluences: boolean;
  showLabels: boolean;
  animate: boolean;
  /** Phone: enlarge hit targets, drop hover annotation, tighten the fit. */
  compact?: boolean;
}

export interface DendrogramHandle {
  focus: (id: string) => void;
  reset: () => void;
}

export default function Dendrogram({
  selectedId,
  onSelect,
  matchIds,
  cutoffYear,
  showInfluences,
  showLabels,
  animate,
  compact = false,
  registerControls,
}: DendrogramProps & {
  registerControls?: (c: {
    focus: (id: string) => void;
    reset: () => void;
    zoomBy: (k: number) => void;
  }) => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; node: ScriptNode } | null>(null);
  const [k, setK] = useState(1);

  const layout = useMemo(() => buildLayout(), []);
  const arcs = useMemo(() => influenceArcs(layout.byId), [layout]);

  const activeId = hoverId ?? selectedId;
  const lineage = useMemo(
    () => new Set(activeId ? ancestryOf(activeId) : []),
    [activeId],
  );
  const progeny = useMemo(
    () => new Set(selectedId ? descendantsOf(selectedId) : []),
    [selectedId],
  );

  /* ── Zoom & pan, anchored at the cursor ─────────────────────── */
  useEffect(() => {
    const svg = svgRef.current;
    const g = gRef.current;
    if (!svg || !g) return;
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.12, 7])
      .on("zoom", (ev: D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.setAttribute("transform", ev.transform.toString());
        setK(ev.transform.k);
      });
    zoomRef.current = z;
    const sel = select(svg);
    sel.call(z);
    sel.on("dblclick.zoom", null);

    const fit = () => {
      const r = svg.getBoundingClientRect();
      // The plate is radial and the root sits at the origin, so the view is
      // centred on the origin rather than on the bounding box: centring on the
      // box would push the root off-centre whenever one side runs longer, which
      // reads as a broken plate rather than an asymmetric one.
      const labelPad = compact ? 54 : 148;
      const reach = layout.extent + labelPad;
      const scale = Math.min(r.width / (reach * 2), r.height / (reach * 2));
      const cx = 0;
      const cy = 0;
      const t = zoomIdentity
        .translate(r.width / 2 - cx * scale, r.height / 2 - cy * scale)
        .scale(scale);
      sel.call(z.transform, t);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(svg);

    registerControls?.({
      focus: (id: string) => {
        const n = layout.byId.get(id);
        if (!n) return;
        const r = svg.getBoundingClientRect();
        // On a phone the leaf covers the lower half of the screen, so the
        // focused node is pulled into the upper third instead of the centre.
        const target = compact ? 0.8 : 0.95;
        const anchorY = compact ? r.height * 0.26 : r.height / 2;
        const t = zoomIdentity
          .translate(r.width / 2 - n.x * target, anchorY - n.y * target)
          .scale(target);
        sel.transition().duration(520).call(z.transform, t);
      },
      reset: fit,
      zoomBy: (f: number) => {
        sel.transition().duration(220).call(z.scaleBy, f);
      },
    });

    return () => ro.disconnect();
  }, [layout, registerControls, compact]);

  /* ── Per-node visual state ──────────────────────────────────── */
  const stateOf = (n: ScriptNode) => {
    const filtered = matchIds.size > 0 && !matchIds.has(n.id);
    const future = cutoffYear !== null && n.yearStart > cutoffYear;
    const inLineage = lineage.has(n.id);
    const inProgeny = progeny.has(n.id);
    const isActive = n.id === activeId;
    const isSelected = n.id === selectedId;
    let opacity = 1;
    if (future) opacity = 0.07;
    else if (filtered) opacity = 0.13;
    else if (activeId && !inLineage && !inProgeny) opacity = 0.42;
    return { filtered, future, inLineage, inProgeny, isActive, isSelected, opacity };
  };

  /**
   * A label is legible when its node's angular sector, at the current radius
   * and zoom, is taller than a line of type. That gives an honest test instead
   * of a hard depth cutoff, so the sparse outer branches stay named while the
   * dense Brahmic fan thins out until you zoom in.
   */
  const labelFits = (n: { span: number; radius: number }) =>
    // Measured at the radius where the label actually sits, not at the node —
    // otherwise first-ring labels are judged on a much shorter arc than they get.
    n.span * Math.max(n.radius + (compact ? 12 : 14), 60) * k >
    (compact ? 17 : 14);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        ref={svgRef}
        className="h-full w-full"
        style={{ touchAction: "none", cursor: "grab" }}
        role="img"
        aria-label="Radial genealogy of the world's writing systems"
        onMouseLeave={() => {
          setHoverId(null);
          setTip(null);
        }}>
        <defs>
          <radialGradient id="vignette" cx="42%" cy="50%" r="72%">
            <stop offset="0%" stopColor="oklch(0.28 0.022 55)" stopOpacity="0" />
            <stop offset="78%" stopColor="oklch(0.28 0.022 55)" stopOpacity="0" />
            <stop offset="100%" stopColor="oklch(0.28 0.022 55)" stopOpacity="0.07" />
          </radialGradient>
          <filter id="inkbite" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="0.7" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g ref={gRef}>
          {/* Ruling rings: the concentric guides a scribe would prick out. */}
          {[132, 236, 332, 424, 512, 596, 678, 758, 836, 912, 986, 1058].map((r, i) => (
            <g key={r}>
              <circle
                r={r}
                fill="none"
                stroke="var(--ink)"
                strokeOpacity={i === 0 ? 0.13 : 0.075}
                strokeDasharray={i === 0 ? undefined : "1 9"}
              />
              {/* Ring caption: the generation of descent, as a plate would number it. */}
              <text
                x={5}
                y={-r - 5}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  fill: "var(--ink-faint)",
                  opacity: 0.55,
                }}>
                {i === 0
                  ? "I · INVENTED"
                  : [
                      "",
                      "II",
                      "III",
                      "IV",
                      "V",
                      "VI",
                      "VII",
                      "VIII",
                      "IX",
                      "X",
                      "XI",
                      "XII",
                    ][i]}
              </text>
            </g>
          ))}

          {/* Influence chords: secondary descent, dotted and inward-bowing. */}
          {showInfluences && (
            <g>
              {arcs.map((a) => {
                const lit = activeId === a.to || activeId === a.from;
                return (
                  <path
                    key={a.id}
                    d={a.path}
                    fill="none"
                    stroke={lit ? "var(--rubric)" : "var(--ink-mid)"}
                    strokeWidth={lit ? 1.4 : 0.7}
                    strokeDasharray="2 4"
                    strokeOpacity={lit ? 0.85 : 0.28}
                    style={{ transition: "stroke 180ms var(--ease-out), stroke-opacity 180ms" }}
                  />
                );
              })}
            </g>
          )}

          {/* Descent lines. */}
          <g fill="none">
            {layout.links.map((l, i) => {
              const st = stateOf(l.target.data);
              const lit =
                lineage.has(l.target.data.id) && lineage.has(l.source.data.id);
              const stroke = lit
                ? "var(--rubric)"
                : `var(--family-${l.target.data.family}, ${familyColors[l.target.data.family]})`;
              // An origin node's stem is a long open dash: it is a reach outward
              // for legibility, not a claim of transmission.
              const dash = l.target.origin
                ? "2 7"
                : l.certainty === "stimulus"
                  ? "1 5"
                  : l.certainty === "disputed"
                    ? "5 4"
                    : l.certainty === "probable"
                      ? "9 4"
                      : undefined;
              // Ink weight follows how much of the tree hangs below this line:
              // a trunk carrying 30 descendants is drawn like a trunk.
              const load = l.target.leaves;
              const trunk = l.target.origin
                ? 0.85
                : Math.min(1.1 + Math.log2(load + 1) * 0.72, 4.6);
              const weight = lit ? trunk + 1.1 : trunk;
              return (
                <path
                  key={`${l.source.data.id}-${l.target.data.id}`}
                  d={l.path}
                  stroke={stroke}
                  strokeWidth={weight}
                  strokeOpacity={
                    lit
                      ? 1
                      : l.target.origin
                        ? st.opacity * 0.42
                        : st.opacity * Math.min(0.42 + load * 0.035, 0.86)
                  }
                  strokeDasharray={dash}
                  strokeLinecap="round"
                  className={animate ? "draw-in" : undefined}
                  style={
                    {
                      transition: "stroke 180ms var(--ease-out), stroke-opacity 160ms",
                      "--len": 600,
                      "--delay": `${l.target.depth * 70 + (i % 9) * 8}ms`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </g>

          {/* Nodes. */}
          <g>
            {layout.nodes.map((n) => {
              if (n.data.id === "root") return null;
              const st = stateOf(n.data);
              const hasKids = descendantsOf(n.data.id).length > 0;
              // Node size follows the weight of what descends from it.
              const base =
                n.depth === 1 || n.origin
                  ? 6.4
                  : hasKids
                    ? Math.min(3.6 + Math.log2(n.leaves + 1) * 0.72, 6)
                    : 3.2;
              const r = st.isActive ? base + 2.6 : base;
              const fam = `var(--family-${n.data.family}, ${familyColors[n.data.family]})`;
              const living = n.data.status === "living";
              const lt = labelTransform(n, r + 6);
              const showLabel =
                showLabels &&
                !st.future &&
                (st.isActive ||
                  st.inLineage ||
                  labelFits(n) ||
                  (matchIds.size > 0 && matchIds.has(n.data.id)));
              return (
                <g
                  key={n.data.id}
                  style={{ opacity: st.opacity, transition: "opacity 140ms var(--ease-out)" }}>
                  <g transform={`rotate(${(n.angle * 180) / Math.PI - 90}) translate(${n.radius},0)`}>
                    <circle
                      r={compact ? Math.max(r + 13, 20) : Math.max(r + 7, 11)}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => {
                        if (compact) return;
                        setHoverId(n.data.id);
                        setTip({ x: e.clientX, y: e.clientY, node: n.data });
                      }}
                      onMouseMove={(e) => {
                        if (compact) return;
                        setTip({ x: e.clientX, y: e.clientY, node: n.data });
                      }}
                      onMouseLeave={() => {
                        if (compact) return;
                        setHoverId(null);
                        setTip(null);
                      }}
                      onClick={() => onSelect(n.data.id)}
                      tabIndex={-1}
                      aria-label={n.data.name}
                    />
                    <circle
                      r={r}
                      fill={living ? fam : "var(--vellum)"}
                      stroke={st.isActive ? "var(--rubric)" : fam}
                      strokeWidth={
                        st.isSelected ? 2.6 : n.depth <= 2 || n.origin ? 2 : 1.5
                      }
                      style={{
                        transition:
                          "r 140ms var(--ease-out), stroke 140ms var(--ease-out)",
                        pointerEvents: "none",
                      }}
                    />
                    {st.isSelected && (
                      <circle
                        r={r + 5}
                        fill="none"
                        stroke="var(--rubric)"
                        strokeWidth={0.9}
                        strokeDasharray="2 3"
                        style={{ pointerEvents: "none" }}
                      />
                    )}
                    {/* An independent invention is ringed: a separate origin,
                        set apart from the lines of descent. */}
                    {n.origin && (
                      <circle
                        r={r + 4.5}
                        fill="none"
                        stroke={st.isActive ? "var(--rubric)" : fam}
                        strokeWidth={0.7}
                        strokeOpacity={0.6}
                        style={{ pointerEvents: "none" }}
                      />
                    )}
                  </g>
                  {showLabel && (
                    <g transform={lt.transform} style={{ pointerEvents: "none" }}>
                      {/* Specimen glyph: the script writes its own name in the
                          plate. Only where the sector is wide enough to hold it. */}
                      {(() => {
                        const spec = shortSpecimen(
                          n.data,
                          n.depth <= 2 || n.origin ? 6 : 4,
                        );
                        if (spec.kind === "none") return null;
                        /**
                         * The specimen is the hero of this atlas, so it shares the
                         * label's gate rather than needing ~1.8x the arc. Any node
                         * whose name is drawn also shows its script writing itself;
                         * previously a whole band of nodes drew a Latin name with a
                         * conspicuous blank above it.
                         *
                         * Glyph SIZE, not visibility, absorbs the crowding: where
                         * the arc is tight the specimen sets smaller instead of
                         * vanishing.
                         */
                        const arc = n.span * Math.max(n.radius + 12, 60) * k;
                        const roomy = arc > 34;
                        const big = n.depth <= 2 || n.origin;
                        const size = compact
                          ? roomy
                            ? big
                              ? 24
                              : 18
                            : big
                              ? 18
                              : 13.5
                          : roomy
                            ? big
                              ? 20
                              : 15
                            : big
                              ? 15.5
                              : 12;
                        return (
                        <text
                          textAnchor={lt.anchor}
                          dy="-0.92em"
                          style={{
                            fontFamily: spec.font,
                            fontSize: size,
                            fill: st.isActive ? "var(--rubric)" : "var(--ink)",
                            fillOpacity: st.isActive ? 1 : 0.82,
                            paintOrder: "stroke",
                            stroke: "var(--vellum)",
                            strokeWidth: 3.4,
                            strokeLinejoin: "round",
                          }}>
                          {spec.text}
                        </text>
                        );
                      })()}
                      <text
                        textAnchor={lt.anchor}
                        dy="0.32em"
                        style={{
                          fontFamily: st.isActive
                            ? "var(--font-display)"
                            : "var(--font-body)",
                          fontSize: compact
                            ? n.depth <= 2
                              ? 19
                              : n.depth === 3
                                ? 16
                                : 14.5
                            : n.depth <= 2
                              ? 15.5
                              : n.depth === 3
                                ? 13
                                : 12,
                          fontWeight: st.isActive || n.depth <= 2 ? 600 : 500,
                          fill: st.isActive ? "var(--rubric)" : "var(--ink)",
                          paintOrder: "stroke",
                          stroke: "var(--vellum)",
                          strokeWidth: 3.6,
                          strokeLinejoin: "round",
                        }}>
                        {n.data.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* The conceptual root: an inked point with the four inventions around it. */}
          <g style={{ pointerEvents: "none" }}>
            <circle r={62} fill="var(--vellum)" fillOpacity={0.82} />
            <circle r={62} fill="none" stroke="var(--ink)" strokeOpacity={0.16} strokeWidth={0.7} />
            <circle r={9} fill="var(--ink)" />
            <circle r={17} fill="none" stroke="var(--ink)" strokeOpacity={0.42} strokeWidth={1} />
            <circle
              r={24}
              fill="none"
              stroke="var(--rubric)"
              strokeOpacity={0.5}
              strokeWidth={0.8}
              strokeDasharray="2 4"
            />
            <text
              y={-34}
              textAnchor="middle"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.2em",
                fill: "var(--rubric)",
                paintOrder: "stroke",
                stroke: "var(--vellum)",
                strokeWidth: 4,
                strokeLinejoin: "round",
              }}>
              INVENTION
            </text>
            <text
              y={40}
              textAnchor="middle"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 8.5,
                letterSpacing: "0.15em",
                fill: "var(--ink-faint)",
                paintOrder: "stroke",
                stroke: "var(--vellum)",
                strokeWidth: 3.4,
                strokeLinejoin: "round",
              }}>
              3400 BC — AD 2010
            </text>
          </g>
        </g>
        <rect width="100%" height="100%" fill="url(#vignette)" pointerEvents="none" />
      </svg>

      {/* Hover annotation — a marginal note, not a chrome tooltip. */}
      {tip && !compact && (
        <div
          className="pointer-events-none fixed z-40 max-w-[19rem] border border-border bg-card px-3 py-2 shadow-[0_10px_28px_-16px_oklch(0.28_0.022_55/0.6)]"
          style={{
            left: Math.min(tip.x + 16, window.innerWidth - 320),
            top: Math.min(tip.y + 12, window.innerHeight - 150),
          }}>
          <div className="flex items-baseline gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: familyColors[tip.node.family] }}
            />
            <span style={{ fontFamily: "var(--font-display)" }} className="text-[15px] font-semibold leading-tight">
              {tip.node.name}
            </span>
          </div>
          <div className="caption mt-1">{tip.node.period}</div>
          <p className="mt-1.5 text-[13.5px] leading-snug text-[var(--ink-mid)]">
            {tip.node.tagline}
          </p>
          {(() => {
            const spec = specimenOf(tip.node);
            if (spec.kind === "none") {
              return (
                <div className="caption mt-2 text-[9.5px] italic">
                  No specimen — unencoded or undeciphered
                </div>
              );
            }
            return (
              <div className="mt-2 border-t border-border pt-2">
                <div className="caption text-[9px]">
                  {spec.kind === "autonym" ? "Written in itself" : "Specimen"}
                </div>
                <div
                  className="mt-1 truncate text-[19px] leading-tight"
                  style={{ fontFamily: spec.font }}>
                  {spec.text}
                </div>
              </div>
            );
          })()}
          <div className="caption mt-2 text-[10px]">
            {scriptById.get(tip.node.parent ?? "")?.name
              ? `from ${scriptById.get(tip.node.parent!)!.name}`
              : "independent invention"}
            {" · click to open"}
          </div>
        </div>
      )}

      {/* Zoom readout, engraver's caption voice. */}
      <div
        className={`caption pointer-events-none absolute text-[10px] ${
          compact ? "bottom-2 right-3" : "bottom-3 right-4"
        }`}>
        {Math.round(k * 100)}% · {allScripts.filter((s) => s.id !== "root").length} scripts
      </div>
    </div>
  );
}
