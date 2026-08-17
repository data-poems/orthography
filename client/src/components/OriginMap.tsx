/**
 * STYLE REMINDER — Scriptorium Vellum
 * Plate IV is a copperplate atlas, not a contemporary GIS dashboard. The sea
 * stays vellum, land is a quiet wash, and branch pigments identify only the
 * small historical points. A point names a place of development or first secure
 * attestation; it never claims a modern border as the script's territory.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { geoEqualEarth, geoGraticule10, geoPath } from "d3-geo";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from "d3-zoom";
import "d3-transition";
import { feature } from "topojson-client";
import worldTopology from "world-atlas/countries-110m.json";
import { familyColors, scriptById, type ScriptNode } from "@/data";
import { mappedOrigins, type OriginRecord } from "@/data/origins";
import { shortSpecimen, specimenOf } from "@/lib/specimen";

export interface OriginMapHandle {
  focus: (id: string) => void;
  reset: () => void;
  zoomBy: (factor: number) => void;
}

type MapPoint = OriginRecord & {
  node: ScriptNode;
  x: number;
  y: number;
  dx: number;
  dy: number;
};
type RawPoint = Omit<MapPoint, "dx" | "dy">;

const topology = worldTopology as any;
const countries = feature(topology, topology.objects.countries) as any;
const graticule = geoGraticule10();

function PrecisionMark({ precision }: { precision: OriginRecord["precision"] }) {
  if (precision === "site") return "site";
  if (precision === "region") return "region";
  return "broad";
}

export default function OriginMap({
  ids,
  selectedId,
  onSelect,
  registerControls,
}: {
  /** Empty set means no current filter; otherwise only these scripts are foregrounded. */
  ids: Set<string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  registerControls?: (handle: OriginMapHandle) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const layerRef = useRef<SVGGElement | null>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [size, setSize] = useState({ width: 900, height: 560 });
  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width && rect.height) {
        setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    const { width, height } = size;
    const projection = geoEqualEarth().fitExtent(
      [
        [18, 28],
        [width - 18, height - 26],
      ],
      countries,
    );
    const path = geoPath(projection);
    const raw: RawPoint[] = mappedOrigins.flatMap((origin) => {
        const node = scriptById.get(origin.id);
        const point = projection([origin.longitude, origin.latitude]);
        return node && point ? [{ ...origin, node, x: point[0], y: point[1] }] : [];
      });

    /** A visible, reversible nudge prevents otherwise coincident historical
        regions from becoming a false single point. The metadata keeps the true
        coordinate and describes the precision level. */
    const clusters = new Map<string, RawPoint[]>();
    for (const point of raw) {
      const key = `${Math.round(point.x / 9)}:${Math.round(point.y / 9)}`;
      const members = clusters.get(key) ?? [];
      members.push(point);
      clusters.set(key, members);
    }
    const points: MapPoint[] = [];
    for (const members of Array.from(clusters.values())) {
      members.forEach((point, index) => {
        const count = members.length;
        const radius = count > 1 ? Math.min(15, 5 + count * 1.1) : 0;
        const angle = count > 1 ? (Math.PI * 2 * index) / count - Math.PI / 2 : 0;
        points.push({
          ...point,
          dx: Math.cos(angle) * radius,
          dy: Math.sin(angle) * radius,
        });
      });
    }
    return {
      countriesPath: path(countries) ?? "",
      graticulePath: path(graticule) ?? "",
      points,
      positions: new Map(points.map((point) => [point.id, point])),
    };
  }, [size]);

  useEffect(() => {
    const svg = svgRef.current;
    const layer = layerRef.current;
    if (!svg || !layer) return;
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 7])
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        layer.setAttribute("transform", event.transform.toString());
      });
    zoomRef.current = behavior;
    const selection = select(svg);
    selection.call(behavior);
    selection.on("dblclick.zoom", null);

    const reset = () => selection.transition().duration(280).call(behavior.transform, zoomIdentity);
    registerControls?.({
      reset,
      zoomBy: (factor) => selection.transition().duration(180).call(behavior.scaleBy, factor),
      focus: (id) => {
        const point = layout.positions.get(id);
        if (!point) return;
        const scale = 3.05;
        const transform = zoomIdentity
          .translate(size.width / 2 - (point.x + point.dx) * scale, size.height / 2 - (point.y + point.dy) * scale)
          .scale(scale);
        selection.transition().duration(520).call(behavior.transform, transform);
      },
    });
    return () => {
      selection.on(".zoom", null);
    };
  }, [layout, registerControls, size]);

  const activeId = hoverId ?? selectedId;
  const active = activeId ? layout.positions.get(activeId) : undefined;

  return (
    <div ref={hostRef} className="relative h-full w-full overflow-hidden">
      <svg
        ref={svgRef}
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        className="h-full w-full select-none"
        style={{ touchAction: "none", cursor: "grab" }}
        role="img"
        aria-label="World map locating the historical development of writing systems">
        <defs>
          <filter id="map-inkbite" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.45" />
          </filter>
        </defs>
        <g ref={layerRef}>
          <path d={layout.graticulePath} fill="none" stroke="var(--ink)" strokeOpacity="0.08" strokeWidth="0.6" strokeDasharray="1.5 5" />
          <path d={layout.countriesPath} fill="var(--vellum-deep)" fillOpacity="0.74" stroke="var(--ink)" strokeOpacity="0.28" strokeWidth="0.72" filter="url(#map-inkbite)" />
          {layout.points.map((point) => {
            const focused = activeId === point.id;
            const dimmed = ids.size > 0 && !ids.has(point.id);
            const color = familyColors[point.node.family];
            const radius = focused ? 7.5 : point.precision === "site" ? 4.2 : 3.8;
            return (
              <g
                key={point.id}
                transform={`translate(${point.x + point.dx},${point.y + point.dy})`}
                opacity={dimmed ? 0.13 : activeId && !focused ? 0.53 : 1}
                onPointerEnter={() => setHoverId(point.id)}
                onPointerLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(point.id)}
                onBlur={() => setHoverId(null)}
                onClick={() => onSelect(point.id)}
                role="button"
                tabIndex={0}
                aria-label={`${point.node.name}: ${point.label}`}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(point.id);
                  }
                }}
                style={{ cursor: "pointer" }}>
                <circle r={13} fill="transparent" />
                {point.precision === "broad" && <circle r={radius + 2.4} fill="none" stroke={color} strokeWidth="1.1" strokeDasharray="1.5 2" />}
                {point.precision === "region" && <circle r={radius + 1.3} fill="var(--vellum)" stroke={color} strokeWidth="1.2" />}
                <circle r={radius} fill={point.precision === "region" ? "var(--vellum)" : color} stroke={color} strokeWidth={point.precision === "site" ? 1.1 : 1.45} />
                {focused && <circle r={radius + 5} fill="none" stroke="var(--rubric)" strokeWidth="1.2" />}
              </g>
            );
          })}
          {selectedId && active && (
            <text
              x={active.x + active.dx + 11}
              y={active.y + active.dy - 9}
              fill="var(--ink)"
              fontFamily="var(--font-display)"
              fontSize="15"
              style={{ paintOrder: "stroke", stroke: "var(--vellum)", strokeWidth: 4 }}>
              {shortSpecimen(active.node).text || active.node.name}
            </text>
          )}
        </g>
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute z-10 max-w-[13.5rem] border border-border bg-[var(--vellum)]/95 px-3 py-2 shadow-[0_8px_20px_-14px_oklch(0.28_0.022_55/0.55)]"
          style={{
            left: Math.min(size.width - 210, Math.max(12, active.x + active.dx + 12)),
            top: Math.max(12, active.y + active.dy + 12),
          }}>
          <div className="caption flex items-center gap-1.5 text-[9px]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: familyColors[active.node.family] }} />
            <span>{PrecisionMark({ precision: active.precision })} origin</span>
          </div>
          <div className="mt-0.5 font-[var(--font-display)] text-[1.1rem] leading-tight">{active.node.name}</div>
          <div className="caption-tight mt-1 text-[10px] text-[var(--ink-mid)]">{active.label}</div>
        </div>
      )}
    </div>
  );
}
