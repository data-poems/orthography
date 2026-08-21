/**
 * Geometry only. A tidy radial tree rooted at the invention of writing.
 *
 * WHY NOT A CLASSIC DENDROGRAM: in the usual construction a child's angular
 * sector is carved out of its parent's, which fails badly on this corpus. The
 * genealogy is a long thin chain that explodes at the end — depths 2, 3 and 5
 * hold only four to six nodes (the single-file descent Egyptian → Hieratic →
 * Proto-Sinaitic → Proto-Canaanite → Phoenician), while depths 9 and 10 hold 65
 * of the 164 scripts. Inherited sectors therefore force 74 scripts to share
 * whatever slice the Egyptian node received, collapsing the outer rings to
 * fractions of a degree and leaving most of the plate blank.
 *
 * Instead angle is assigned by LEAF ORDER: the leaves of the tree are spread at
 * equal angular intervals around the full circle, and every internal node is
 * placed at the mean angle of its own descendants. Radius still encodes
 * generation, so descent still reads outward, but every script gets an equal
 * share of the rim and the plate is fully occupied.
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
  /** angular width attributable to this node — its share of the rim */
  span: number;
  leaves: number;
  /**
   * True for the independent inventions: first-generation scripts with no
   * descendants, drawn out on their own ring so they are legible. The renderer
   * uses this to draw their stem as a long dashed stroke rather than a solid
   * line of descent, since no transmission is being claimed.
   */
  origin?: boolean;
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
  bbox: { minX: number; maxX: number; minY: number; maxY: number };
}

/**
 * Ring radii. Generous early spacing so the long single-file Semitic descent
 * reads as a deliberate trunk, then tightening as the rings crowd.
 */
const RINGS = [0, 132, 236, 332, 424, 512, 596, 678, 758, 836, 912, 986, 1058];
function ringRadius(depth: number): number {
  // Fractional depths are interpolated: childless first-ring nodes are placed
  // between rings so they clear the root without pretending to a generation.
  if (depth >= RINGS.length - 1) return 1058 + (depth - 12) * 68;
  const lo = Math.floor(depth);
  const t = depth - lo;
  if (t === 0) return RINGS[lo];
  return RINGS[lo] + (RINGS[lo + 1] - RINGS[lo]) * t;
}

interface RawNode {
  data: ScriptNode;
  children: RawNode[];
  leaves: number;
  depth: number;
  angle: number;
  span: number;
  origin?: boolean;
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
    return { data, children: kids, leaves, depth, angle: 0, span: 0 };
  };
  return make(ROOT, 0);
}

/**
 * Order the first ring. Because angle follows leaf order, the arrangement alone
 * decides the composition of the plate.
 *
 * There are only two genuinely heavy branches — Egyptian (74 leaves) and Oracle
 * Bone (11) — against twenty-two solitary inventions. Interleaving at the first
 * ring therefore cannot spread the weight: Egyptian alone claims about half the
 * circle in one unbroken sweep, and the solitary scripts queue up behind it.
 *
 * The solitary scripts are instead SPLIT INTO TWO RUNS placed before and after
 * the heavy branches, so the plate opens with independent inventions, sweeps
 * through the inherited world, and closes with more inventions. Within each run
 * chronology is preserved, which means the rim reads roughly oldest to newest.
 */
function arrangeFirstRing(root: RawNode) {
  const kids = root.children.slice();
  const heavy = kids
    .filter((n) => n.leaves > 3)
    .sort((a, b) => b.leaves - a.leaves);
  const light = kids
    .filter((n) => n.leaves <= 3)
    .sort((a, b) => a.data.yearStart - b.data.yearStart);

  // Split the solitary run in proportion to the heavy branches it brackets, so
  // both flanks of the plate carry a comparable amount of light material.
  // Half and half: the solitary inventions then form one continuous arc that
  // wraps the plate on the side the lineages leave open, and the plate reads as
  // a full circle rather than a fan with a gap.
  const cut = Math.round(light.length * 0.5);
  root.children = [
    ...light.slice(0, cut),
    heavy[0],
    ...light.slice(cut),
    ...heavy.slice(1),
  ].filter(Boolean);
}

/**
 * Assign each leaf an equal slice of the circle in traversal order, then set
 * every internal node to the mean of its children's angles. This is the radial
 * form of a tidy tree layout.
 */
function assignAngles(root: RawNode, a0: number, a1: number) {
  // Every first-ring branch is given a share of the circle. A descended lineage
  // is weighted by its leaf count; a solitary invention counts as a fixed weight
  // of several leaves, so it keeps enough of the rim for its own name and
  // specimen instead of being squeezed to a single leaf-width.
  // 22 solitary inventions against 112 leaves of descended lineage. Legibility
  // is now carried by their large radius (see the origin ring below) rather than
  // by angle, so a weight near 2 is enough — the descended lineages keep the
  // majority of the plate, which is the honest proportion.
  const SOLITARY_WEIGHT = 2;
  const total = a1 - a0;
  const weightOf = (n: RawNode) =>
    n.children.length ? n.leaves : SOLITARY_WEIGHT;
  const totalWeight = root.children.reduce((a, n) => a + weightOf(n), 0);
  const step = total / totalWeight;

  const walk = (n: RawNode, cursor: { v: number }): void => {
    if (!n.children.length) {
      n.angle = cursor.v + step / 2;
      n.span = step;
      cursor.v += step;
      return;
    }
    for (const k of n.children) walk(k, cursor);
    const first = n.children[0];
    const last = n.children[n.children.length - 1];
    n.angle = (first.angle + last.angle) / 2;
    // A node's share of the rim is the whole arc its descendants occupy, which
    // is what the renderer needs to decide whether a label fits.
    n.span = last.angle - first.angle + step;
  };

  const cursor = { v: a0 };
  for (const branch of root.children) {
    if (!branch.children.length) {
      const w = step * SOLITARY_WEIGHT;
      branch.angle = cursor.v + w / 2;
      branch.span = w;
      // Legibility on a radial plate is a function of ARC LENGTH, not angle:
      // at ring I (132px) even an eight-degree slice is only ~18px of rim, which
      // is why these nodes read as a collar however much angle they are given.
      // They are therefore set out on their own ring at a large radius, where
      // the same slice becomes ~120px and carries a name and a specimen. The
      // renderer marks their stem dashed so the long stroke is not misread as
      // generations of descent.
      branch.depth = 4.6;
      branch.origin = true;
      cursor.v += w;
    } else {
      walk(branch, cursor);
    }
  }

  root.angle = 0;
  root.span = total;
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
  arrangeFirstRing(raw);

  // The plate is rotated so the descended lineages sweep the right and lower
  // half while the solitary inventions occupy the upper left, with a small wedge
  // left open at the top for the ring captions.
  const gap = (7 * Math.PI) / 180;
  // The Egyptian sweep occupies roughly the middle 175° of the allocation, with
  // the solitary arcs bracketing it. Rotating by -75° carries that sweep down the
  // right and across the bottom, and closes the circle with the solitary arcs on
  // the upper and lower left — leaving the far left clear for the cartouche.
  const rotate = (-75 * Math.PI) / 180;
  assignAngles(raw, gap / 2 + rotate, 2 * Math.PI - gap / 2 + rotate);

  const nodes: LaidOutNode[] = [];
  const byId = new Map<string, LaidOutNode>();
  let extent = 0;
  const bbox = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
  };

  const walk = (n: RawNode, parentId: string | null) => {
    const radius = ringRadius(n.depth);
    const out: LaidOutNode = {
      data: n.data,
      angle: n.angle,
      radius,
      x: Math.sin(n.angle) * radius,
      y: -Math.cos(n.angle) * radius,
      depth: n.depth,
      parentId,
      span: n.span,
      leaves: n.leaves,
      origin: n.origin,
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
