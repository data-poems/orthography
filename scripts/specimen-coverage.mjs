/**
 * What the reader actually sees, per script, after the resolver runs.
 * Mirrors client/src/lib/specimen.ts. Run: node scripts/specimen-coverage.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "client/src/data";
const src = readdirSync(dir)
  .filter((f) => f.startsWith("scripts-") && f.endsWith(".ts"))
  .map((f) => readFileSync(join(dir, f), "utf8"))
  .join("\n");

const field = (body, key) =>
  body.match(new RegExp(`\\n    ${key}: "((?:[^"\\\\]|\\\\.)*)"`))?.[1] ?? null;

const rows = [];
for (const part of src.split(/\n  \{\n/).slice(1)) {
  const body = "\n" + part.split(/\n  \},/)[0];
  const id = field(body, "id");
  if (!id || id === "root") continue;
  const endonym = field(body, "endonym");
  const sample = field(body, "sample");
  const kind = endonym ? "autonym" : sample ? "sample" : "none";
  rows.push({ id, kind, shown: endonym ?? sample ?? "—" });
}

const tally = rows.reduce((a, r) => ((a[r.kind] = (a[r.kind] ?? 0) + 1), a), {});
console.log(`scripts: ${rows.length}`);
console.log(`  autonym (script writes its own name): ${tally.autonym ?? 0}`);
console.log(`  attested specimen / letter run:       ${tally.sample ?? 0}`);
console.log(`  no specimen possible:                 ${tally.none ?? 0}`);
const covered = (tally.autonym ?? 0) + (tally.sample ?? 0);
console.log(
  `  coverage: ${covered}/${rows.length} = ${((covered / rows.length) * 100).toFixed(1)}%`,
);
console.log(`\nno specimen (${tally.none ?? 0}):`);
for (const r of rows.filter((r) => r.kind === "none")) console.log(`  ${r.id}`);
