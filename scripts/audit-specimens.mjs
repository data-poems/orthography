/**
 * Reports, for every script in the corpus:
 *   - whether it has a `sample` (the specimen shown in the plate and index)
 *   - whether it has an `endonym` (the script's own name in its own orthography)
 *   - whether the sample equals the endonym (the ideal: the script spelling itself)
 *
 * Run: node scripts/audit-specimens.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "client/src/data";
const files = readdirSync(dir).filter(
  (f) => f.startsWith("scripts-") && f.endsWith(".ts"),
);
const src = files.map((f) => readFileSync(join(dir, f), "utf8")).join("\n");

// Split on entry starts. Each entry begins `id: "..."` at a fixed indent.
const parts = src.split(/\n  \{\n/).slice(1);
const rows = [];
for (const p of parts) {
  const id = p.match(/id: "([^"]+)"/)?.[1];
  if (!id) continue;
  const body = p.split(/\n  \},/)[0];
  const name = body.match(/\n    name: "((?:[^"\\]|\\.)*)"/)?.[1] ?? "";
  const endonym = body.match(/\n    endonym: "((?:[^"\\]|\\.)*)"/)?.[1] ?? null;
  const sample = body.match(/\n    sample: "((?:[^"\\]|\\.)*)"/)?.[1] ?? null;
  const font = body.match(/\n    fontHint: "((?:[^"\\]|\\.)*)"/)?.[1] ?? null;
  const status = body.match(/\n    status: "([^"]+)"/)?.[1] ?? "";
  rows.push({ id, name, endonym, sample, font, status });
}

const noSample = rows.filter((r) => !r.sample);
const noEndonym = rows.filter((r) => !r.endonym);
const sampleIsEndonym = rows.filter(
  (r) => r.sample && r.endonym && r.sample === r.endonym,
);
const sampleNotEndonym = rows.filter(
  (r) => r.sample && r.endonym && r.sample !== r.endonym,
);

console.log(`entries parsed: ${rows.length}`);
console.log(`has sample:         ${rows.length - noSample.length}`);
console.log(`missing sample:     ${noSample.length}`);
console.log(`missing endonym:    ${noEndonym.length}`);
console.log(`sample == endonym:  ${sampleIsEndonym.length}`);
console.log(`sample != endonym:  ${sampleNotEndonym.length}`);

console.log(`\n── MISSING SAMPLE (${noSample.length}) ──`);
for (const r of noSample) {
  console.log(
    `  ${r.id.padEnd(26)} ${r.status.padEnd(12)} endonym=${r.endonym ?? "—"}`,
  );
}

console.log(`\n── MISSING ENDONYM (${noEndonym.length}) ──`);
for (const r of noEndonym) {
  console.log(`  ${r.id.padEnd(26)} ${r.status.padEnd(12)} ${r.name}`);
}

console.log(`\n── SAMPLE IS NOT THE ENDONYM (${sampleNotEndonym.length}) ──`);
for (const r of sampleNotEndonym) {
  console.log(
    `  ${r.id.padEnd(26)} sample=${JSON.stringify(r.sample)} endonym=${JSON.stringify(r.endonym)}`,
  );
}
