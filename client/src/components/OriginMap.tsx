/**
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
import { transmissionRoutes, type RouteEvidence } from "@/data/routes";
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
type MarkerCluster = {
  id: string;
  x: number;
  y: number;
  members: RawPoint[];
};
type RenderRoute = (typeof transmissionRoutes)[number] & { path: string };

const routeStyle: Record<RouteEvidence, { dash: string; opacity: number }> = {
  attested: { dash: "", opacity: 0.7 },
  probable: { dash: "5 4", opacity: 0.62 },
  adaptation: { dash: "1.5 3", opacity: 0.74 },
};

function curveBetween(from: RawPoint, to: RawPoint, bend: number) {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const length = Math.hypot(deltaX, deltaY) || 1;
  const arc = Math.min(48, 15 + length * 0.105) * bend;
  const controlX = (from.x + to.x) / 2 - (deltaY / length) * arc;
  const controlY = (from.y + to.y) / 2 + (deltaX / length) * arc;
  return `Q ${controlX.toFixed(1)} ${controlY.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
}

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
  showRoutes = true,
  routeEvidence,
  activeRouteId,
  onRouteSelect,
  registerControls,
}: {
  /** Empty set means no current filter; otherwise only these scripts are foregrounded. */
  ids: Set<string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showRoutes?: boolean;
  routeEvidence: Set<RouteEvidence>;
  activeRouteId?: string | null;
  onRouteSelect?: (id: string) => void;
  registerControls?: (handle: OriginMapHandle) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const layerRef = useRef<SVGGElement | null>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [size, setSize] = useState({ width: 900, height: 560 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [mapScale, setMapScale] = useState(1);

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
    const pointById = new Map(raw.map((point) => [point.id, point]));
    const routes: RenderRoute[] = transmissionRoutes.flatMap((route, routeIndex) => {
      const stops = route.stops.map((id) => pointById.get(id));
      if (stops.some((point) => !point)) return [];
      const known = stops as RawPoint[];
      const path = known.reduce((drawing, point, index) => {
        if (!index) return `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
        return `${drawing} ${curveBetween(known[index - 1], point, (routeIndex + index) % 2 ? 1 : -1)}`;
      }, "");
      return [{ ...route, path }];
    });

    /** At overview scale, nearby historical origins are an honest cluster rather
        than a false suggestion that several developments happened at one exact
        point. Clicking a cluster zooms to separate its individual records. */
    const clusters = new Map<string, RawPoint[]>();
    for (const point of raw) {
      const key = `${Math.round(point.x / 16)}:${Math.round(point.y / 16)}`;
      const members = clusters.get(key) ?? [];
      members.push(point);
      clusters.set(key, members);
    }
    const clusterList: MarkerCluster[] = Array.from(clusters.entries()).map(([id, members]) => ({
      id,
      x: members.reduce((sum, point) => sum + point.x, 0) / members.length,
      y: members.reduce((sum, point) => sum + point.y, 0) / members.length,
      members,
    }));

    /** At close range, a small radial separation makes each member selectable
        without changing the location recorded in its metadata. */
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
      clusters: clusterList,
      routes,
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
        setMapScale((previous) =>
          Math.abs(previous - event.transform.k) > 0.025 ? event.transform.k : previous,
        );
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
  const clusterMode = mapScale < 2.15 && !selectedId;

  const zoomToCluster = (cluster: MarkerCluster) => {
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (!svg || !behavior) return;
    const scale = 3.15;
    select(svg)
      .transition()
      .duration(460)
      .call(
        behavior.transform,
        zoomIdentity
          .translate(size.width / 2 - cluster.x * scale, size.height / 2 - cluster.y * scale)
          .scale(scale),
      );
  };

  const renderPoint = (point: MapPoint) => {
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
  };

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
          {showRoutes && layout.routes.filter((route) => routeEvidence.has(route.evidence)).map((route) => {
            const style = routeStyle[route.evidence];
            const activeRoute = activeRouteId === route.id;
            return (
              <path
                key={route.id}
                d={route.path}
                fill="none"
                stroke={activeRoute ? "var(--rubric)" : "var(--ink-mid)"}
                strokeOpacity={activeRoute ? 0.92 : style.opacity}
                strokeWidth={activeRoute ? 2.25 : 1.25}
                strokeDasharray={style.dash || undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  onRouteSelect?.(route.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={`${route.label}: ${route.evidence} transmission route`}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onRouteSelect?.(route.id);
                  }
                }}
                style={{ cursor: "pointer", transition: "stroke 160ms var(--ease-out), stroke-width 160ms var(--ease-out)" }}>
                <title>{route.label} · {route.evidence}</title>
              </path>
            );
          })}
          {clusterMode
            ? layout.clusters.map((cluster) => {
                const visible = ids.size ? cluster.members.filter((point) => ids.has(point.id)) : cluster.members;
                if (!visible.length) return null;
                if (visible.length === 1) {
                  const point = layout.points.find((candidate) => candidate.id === visible[0].id);
                  return point ? renderPoint(point) : null;
                }
                return (
                  <g
                    key={`cluster-${cluster.id}`}
                    transform={`translate(${cluster.x},${cluster.y})`}
                    onClick={() => zoomToCluster(cluster)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${visible.length} historical script origins. Activate to zoom in and separate them.`}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        zoomToCluster(cluster);
                      }
                    }}
                    style={{ cursor: "zoom-in" }}>
                    <title>{visible.length} historical origins — activate to expand</title>
                    <circle r={12.5} fill="var(--vellum)" fillOpacity="0.95" stroke="var(--ink)" strokeOpacity="0.68" strokeWidth="1" />
                    <circle r={9.5} fill="none" stroke="var(--rubric)" strokeOpacity="0.72" strokeWidth="1.1" strokeDasharray="2 1.5" />
                    <text y="3.5" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-mono)" fontSize="8.5" fontWeight="700">{visible.length}</text>
                  </g>
                );
              })
            : layout.points.map(renderPoint)}
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
