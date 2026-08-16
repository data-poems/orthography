/**
 * Layout diagnostic. Prints the first-ring sector allocation and the geometry
 * bounding box so the balance of the plate can be checked without eyeballing a
 * screenshot. Run with: node scripts/inspect-layout.mjs
 */
import { readFileSync, readdirSync } from "node:fs";

const DIR = new URL("../client/src/data/", import.meta.url);

// Parse the dataset out of the TS sources: enough for id/parent/name.
const nodes = [];
for (const f of readdirSync(DIR)) {
  if (!f.startsWith("scripts-") || !f.endsWith(".ts")) continue;
  const src = readFileSync(new URL(f, DIR), "utf8");
  const re =
    /id:\s*"([^"]+)",[\s\S]*?name:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?parent:\s*(?:"([^"]+)"|null)[\s\S]*?yearStart:\s*(-?\d+)/g;
  let m;
  while ((m = re.exec(src))) {
    nodes.push({
      id: m[1],
      name: m[2],
      parent: m[3] ?? null,
      yearStart: Number(m[4]),
    });
  }
}

const byParent = new Map();
for (const n of nodes) {
  if (!n.parent) continue;
  if (!byParent.has(n.parent)) byParent.set(n.parent, []);
  byParent.get(n.parent).push(n);
}

function leaves(id) {
  const kids = byParent.get(id) ?? [];
  if (!kids.length) return 1;
  return kids.reduce((a, k) => a + leaves(k.id), 0);
}

const first = (byParent.get("root") ?? []).map((n) => ({
  name: n.name,
  id: n.id,
  yearStart: n.yearStart,
  leaves: leaves(n.id),
}));
const total = first.reduce((a, n) => a + n.leaves, 0);

console.log(`nodes parsed: ${nodes.length}`);
console.log(`first ring: ${first.length} branches, ${total} leaves total\n`);

// Mirror tree-layout.ts: chronological order, sqrt-compressed sector widths.
const woven = first.slice().sort((a, b) => a.yearStart - b.yearStart);
const weightTotal = woven.reduce((a, n) => a + Math.sqrt(n.leaves), 0);

let cursor = 0;
const quadrant = [0, 0, 0, 0];
for (const n of woven) {
  const span = (Math.sqrt(n.leaves) / weightTotal) * 360;
  const mid = cursor + span / 2;
  quadrant[Math.floor(mid / 90) % 4] += span;
  console.log(
    `${String(Math.round(cursor)).padStart(4)}\u00b0-${String(
      Math.round(cursor + span),
    ).padStart(4)}\u00b0  ${String(n.leaves).padStart(3)} leaves  ${n.name}`,
  );
  cursor += span;
}

console.log("\ndegrees of sector per quadrant (want roughly 90 each):");
quadrant.forEach((q, i) =>
  console.log(
    `  Q${i + 1}  ${String(Math.round(q)).padStart(3)}\u00b0  ${((q / 360) * 100).toFixed(1)}%`,
  ),
);
