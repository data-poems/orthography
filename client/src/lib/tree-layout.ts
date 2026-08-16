/**
 * STYLE REMINDER — Scriptorium Vellum
 * Geometry only. Radial dendrogram, rooted at the invention of writing.
 * Angular space is allocated proportionally by leaf count with a floor, and
 * heavy branches are woven between light ones so no half of the plate starves.
 */
import { allScripts, type ScriptNode } from "@/data";

export interface LaidOutNode {
  data: ScriptNode;
  /** radians, 0 = up, increasing clockwise */
  angle: number;
  radius: number;
  x: number;
  y: number;
  depth: number;
  parentId: string | null;
  /** angular width of this node's sector */
  span: number;
  leaves: number;
}

export interface LaidOutLink {
  source: LaidOutNode;
  target: LaidOutNode;
  path: string;
  certainty: string;
}

export interface Layout {
  nodes: LaidOutNode[];
  links: LaidOutLink[];
  byId: Map<string, LaidOutNode>;
  extent: number;
  /** Bounding box over every plotted node, so fit-to-view is honest. */
  bbox: { minX: number; maxX: number; minY: number; maxY: number };
}

const RINGS = [0, 150, 300, 448, 592, 734, 872, 1008, 1142];
function ringRadius(depth: number): number {
  return RINGS[depth] ?? 1142 + (depth - 8) * 132;
}

interface RawNode {
  data: ScriptNode;
  children: RawNode[];
  leaves: number;
  depth: number;
  a0: number;
  a1: number;
}

const ROOT: ScriptNode = {
  id: "root",
  name: "The invention of writing",
  parent: null,
  family: "origins",
  typology: "proto-writing",
  direction: "unknown",
  status: "extinct",
  yearStart: -3400,
  yearEnd: null,
  period: "",
  region: "",
  languages: [],
  tagline: "",
  detail: [],
};

function buildRaw(): RawNode {
  const byParent = new Map<string, ScriptNode[]>();
  for (const s of allScripts) {
    if (!s.parent) continue;
    const list = byParent.get(s.parent) ?? [];
    list.push(s);
    byParent.set(s.parent, list);
  }
  const make = (data: ScriptNode, depth: number): RawNode => {
    const kids = (byParent.get(data.id) ?? [])
      .slice()
      .sort((a, b) => a.yearStart - b.yearStart || a.name.localeCompare(b.name))
      .map((k) => make(k, depth + 1));
    const leaves = kids.length ? kids.reduce((n, k) => n + k.leaves, 0) : 1;
    return { data, children: kids, leaves, depth, a0: 0, a1: 0 };
  };
  return make(ROOT, 0);
}

/**
 * Give each child a sector proportional to its leaf count, but never narrower
 * than a floor; the shortfall is recovered from the wide sectors in proportion
 * to their surplus, so the circle stays exactly filled.
 */
function allocate(node: RawNode, a0: number, a1: number) {
  node.a0 = a0;
  node.a1 = a1;
  const kids = node.children;
  if (!kids.length) return;
  const span = a1 - a0;
  const total = kids.reduce((n, k) => n + k.leaves, 0);
  const raw = kids.map((k) => (span * k.leaves) / total);
  const floor = Math.min((4 * Math.PI) / 180, span / (kids.length * 1.5));
  let deficit = 0;
  for (const v of raw) if (v < floor) deficit += floor - v;
  const surplus = raw.reduce((n, v) => n + Math.max(v - floor, 0), 0);
  const widths = raw.map((v) =>
    v < floor
      ? floor
      : surplus > 0
        ? v - (deficit * (v - floor)) / surplus
        : v,
  );
  let cursor = a0;
  for (let i = 0; i < kids.length; i++) {
    allocate(kids[i], cursor, cursor + widths[i]);
    cursor += widths[i];
  }
}

function radialElbow(s: LaidOutNode, t: LaidOutNode): string {
  const pt = (a: number, r: number) =>
    [Math.sin(a) * r, -Math.cos(a) * r] as const;
  const [sx, sy] = pt(s.angle, s.radius);
  const [mx, my] = pt(t.angle, s.radius);
  const [tx, ty] = pt(t.angle, t.radius);
  if (s.radius < 1) return `M${sx},${sy}L${tx},${ty}`;
  const delta = t.angle - s.angle;
  const sweep = delta > 0 ? 1 : 0;
  const large = Math.abs(delta) > Math.PI ? 1 : 0;
  return `M${sx},${sy}A${s.radius},${s.radius} 0 ${large} ${sweep} ${mx},${my}L${tx},${ty}`;
}

export function buildLayout(): Layout {
  const raw = buildRaw();

  // Weave heavy branches between light ones so the mass is spread around the
  // circle rather than collecting in one sector.
  const byWeight = raw.children.slice().sort((a, b) => b.leaves - a.leaves);
  const woven: RawNode[] = [];
  let lo = 0;
  let hi = byWeight.length - 1;
  while (lo <= hi) {
    woven.push(byWeight[lo++]);
    if (lo <= hi) woven.push(byWeight[hi--]);
  }
  raw.children = woven;

  const gap = (6 * Math.PI) / 180;
  allocate(raw, gap / 2, 2 * Math.PI - gap / 2);

  const nodes: LaidOutNode[] = [];
  const byId = new Map<string, LaidOutNode>();
  let extent = 0;
  const bbox = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

  const walk = (n: RawNode, parentId: string | null) => {
    const angle = n.depth === 0 ? 0 : (n.a0 + n.a1) / 2;
    const radius = ringRadius(n.depth);
    const out: LaidOutNode = {
      data: n.data,
      angle,
      radius,
      x: Math.sin(angle) * radius,
      y: -Math.cos(angle) * radius,
      depth: n.depth,
      parentId,
      span: n.a1 - n.a0,
      leaves: n.leaves,
    };
    nodes.push(out);
    byId.set(n.data.id, out);
    if (radius > extent) extent = radius;
    if (out.x < bbox.minX) bbox.minX = out.x;
    if (out.x > bbox.maxX) bbox.maxX = out.x;
    if (out.y < bbox.minY) bbox.minY = out.y;
    if (out.y > bbox.maxY) bbox.maxY = out.y;
    for (const k of n.children) walk(k, n.data.id);
  };
  walk(raw, null);

  const links: LaidOutLink[] = [];
  for (const n of nodes) {
    if (!n.parentId) continue;
    const s = byId.get(n.parentId);
    if (!s) continue;
    links.push({
      source: s,
      target: n,
      path: radialElbow(s, n),
      certainty: n.data.certainty ?? "attested",
    });
  }

  return { nodes, links, byId, extent, bbox };
}

/** Influence chords: secondary descent, bowed toward the centre. */
export function influenceArcs(byId: Map<string, LaidOutNode>) {
  const out: { id: string; from: string; to: string; path: string }[] = [];
  for (const s of allScripts) {
    if (!s.influences) continue;
    const t = byId.get(s.id);
    if (!t) continue;
    for (const infId of s.influences) {
      const f = byId.get(infId);
      if (!f) continue;
      const mx = (f.x + t.x) / 2;
      const my = (f.y + t.y) / 2;
      const k = 0.4;
      out.push({
        id: `${infId}->${s.id}`,
        from: infId,
        to: s.id,
        path: `M${f.x},${f.y}Q${mx * k},${my * k} ${t.x},${t.y}`,
      });
    }
  }
  return out;
}

/** Labels radiate outward; flip on the left half so nothing reads upside down. */
export function labelTransform(n: LaidOutNode, pad = 13) {
  const deg = (n.angle * 180) / Math.PI;
  const flip = n.angle > Math.PI;
  const r = n.radius + pad;
  return {
    transform: `rotate(${deg - 90}) translate(${r},0)${flip ? " rotate(180)" : ""}`,
    anchor: flip ? ("end" as const) : ("start" as const),
  };
}
