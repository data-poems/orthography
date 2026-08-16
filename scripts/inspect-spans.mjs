/**
 * Per-depth angular span diagnostic. Reproduces allocate() exactly and reports
 * the min/median span at each depth, plus the widest and narrowest branches, so
 * a collapsing sector can be found without reading a screenshot.
 * Run: node scripts/inspect-spans.mjs
 */
import { readFileSync, readdirSync } from "node:fs";

const DIR = new URL("../client/src/data/", import.meta.url);
const nodes = [];
for (const f of readdirSync(DIR)) {
  if (!f.startsWith("scripts-") || !f.endsWith(".ts")) continue;
  const src = readFileSync(new URL(f, DIR), "utf8");
  const re =
    /id:\s*"([^"]+)",[\s\S]*?name:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?parent:\s*(?:"([^"]+)"|null)[\s\S]*?yearStart:\s*(-?\d+)/g;
  let m;
  while ((m = re.exec(src)))
    nodes.push({
      id: m[1],
      name: m[2],
      parent: m[3] ?? null,
      yearStart: Number(m[4]),
    });
}

const byParent = new Map();
for (const n of nodes) {
  if (!n.parent) continue;
  if (!byParent.has(n.parent)) byParent.set(n.parent, []);
  byParent.get(n.parent).push(n);
}

const make = (data, depth) => {
  const kids = (byParent.get(data.id) ?? [])
    .slice()
    .sort((a, b) => a.yearStart - b.yearStart || a.name.localeCompare(b.name))
    .map((k) => make(k, depth + 1));
  const leaves = kids.length ? kids.reduce((n, k) => n + k.leaves, 0) : 1;
  return { data, children: kids, leaves, depth, a0: 0, a1: 0 };
};
const root = make({ id: "root", name: "root", yearStart: -3400 }, 0);

function allocate(node, a0, a1) {
  node.a0 = a0;
  node.a1 = a1;
  const kids = node.children;
  if (!kids.length) return;
  const span = a1 - a0;
  const weight = (k) => Math.sqrt(k.leaves);
  const total = kids.reduce((n, k) => n + weight(k), 0);
  const raw = kids.map((k) => (span * weight(k)) / total);
  const floor = Math.min((3.5 * Math.PI) / 180, span / kids.length);
  let deficit = 0;
  for (const v of raw) if (v < floor) deficit += floor - v;
  const surplus = raw.reduce((n, v) => n + Math.max(v - floor, 0), 0);
  const widths = raw.map((v) =>
    v < floor ? floor : surplus > 0 ? v - (deficit * (v - floor)) / surplus : v,
  );
  let cursor = a0;
  for (let i = 0; i < kids.length; i++) {
    allocate(kids[i], cursor, cursor + widths[i]);
    cursor += widths[i];
  }
}

const gap = (6 * Math.PI) / 180;
allocate(root, gap / 2, 2 * Math.PI - gap / 2);

const RINGS = [0, 150, 300, 448, 592, 734, 872, 1008, 1142];
const flat = [];
(function walk(n) {
  flat.push(n);
  n.children.forEach(walk);
})(root);

const deg = (r) => (r * 180) / Math.PI;
const byDepth = new Map();
for (const n of flat) {
  if (!byDepth.has(n.depth)) byDepth.set(n.depth, []);
  byDepth.get(n.depth).push(n);
}

console.log("depth  count   min span   median   max span   min arc px @ring");
for (const [d, list] of [...byDepth].sort((a, b) => a[0] - b[0])) {
  const spans = list.map((n) => deg(n.a1 - n.a0)).sort((a, b) => a - b);
  const ring = RINGS[d] ?? 1142;
  const minArc = ((spans[0] * Math.PI) / 180) * ring;
  console.log(
    `${String(d).padStart(5)}  ${String(list.length).padStart(5)}   ${spans[0]
      .toFixed(3)
      .padStart(8)}°  ${spans[Math.floor(spans.length / 2)]
      .toFixed(3)
      .padStart(7)}°  ${spans[spans.length - 1].toFixed(2).padStart(8)}°  ${minArc
      .toFixed(1)
      .padStart(8)}px`,
  );
}

// Angular occupancy: how much of the circle actually carries drawn nodes at the
// outer rings. If this is far below 360, the plate reads as a wedge.
for (const d of [1, 2, 3, 4]) {
  const list = byDepth.get(d) ?? [];
  if (!list.length) continue;
  const mids = list.map((n) => deg((n.a0 + n.a1) / 2)).sort((a, b) => a - b);
  const bins = new Set(mids.map((m) => Math.floor(m / 10)));
  console.log(
    `depth ${d}: nodes occupy ${bins.size}/36 ten-degree bins (${(
      (bins.size / 36) *
      100
    ).toFixed(0)}% of the rim)`,
  );
}
