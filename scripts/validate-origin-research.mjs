/**
 * Combine the family research output with atlas records and validate geographic
 * claims before any candidate is allowed into the public map data.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { allScripts } from "../client/src/data/index.ts";

const research = JSON.parse(
  readFileSync("/home/ubuntu/origin_coordinate_research.json", "utf8"),
);
const overrides = JSON.parse(
  readFileSync("scripts/origin-overrides.json", "utf8"),
);
const corpus = allScripts.filter((script) => script.id !== "root");
const byId = new Map(corpus.map((script) => [script.id, script]));
const allowedPrecision = new Set(["site", "region", "broad", "withheld"]);
const candidates = [];
const seen = new Set();
const issues = [];

for (const group of research.results) {
  let rows;
  try {
    rows = JSON.parse(group.output.origins_json);
  } catch (error) {
    issues.push(`Cannot parse ${group.input}: ${error.message}`);
    continue;
  }
  for (const row of rows) {
    if (seen.has(row.id)) issues.push(`Duplicate id: ${row.id}`);
    seen.add(row.id);
    const script = byId.get(row.id);
    if (!script) {
      issues.push(`Unknown id: ${row.id}`);
      continue;
    }
    if (!allowedPrecision.has(row.precision)) {
      issues.push(`${row.id}: invalid precision ${row.precision}`);
    }
    const hasPoint = Number.isFinite(row.latitude) && Number.isFinite(row.longitude);
    if (row.precision === "withheld" && hasPoint) {
      issues.push(`${row.id}: withheld point must not carry coordinates`);
    }
    if (row.precision !== "withheld" && !hasPoint) {
      issues.push(`${row.id}: mapped point is missing coordinates`);
    }
    if (hasPoint && (Math.abs(row.latitude) > 90 || Math.abs(row.longitude) > 180)) {
      issues.push(`${row.id}: coordinates outside WGS84 bounds`);
    }
    candidates.push({
      ...row,
      name: script.name,
      family: script.family,
      region: script.region,
      yearStart: script.yearStart,
      source: script.source ?? null,
    });
  }
}

for (const row of overrides) {
  if (seen.has(row.id)) issues.push(`Override duplicates researched id: ${row.id}`);
  seen.add(row.id);
  const script = byId.get(row.id);
  if (!script) {
    issues.push(`Override references unknown id: ${row.id}`);
    continue;
  }
  candidates.push({
    ...row,
    name: script.name,
    family: script.family,
    region: script.region,
    yearStart: script.yearStart,
    source: script.source ?? null,
  });
}

const missing = corpus.filter((script) => !seen.has(script.id)).map((script) => script.id);
if (missing.length) issues.push(`Missing (${missing.length}): ${missing.join(", ")}`);

writeFileSync(
  "scripts/origin-candidates.json",
  `${JSON.stringify(candidates.sort((a, b) => a.id.localeCompare(b.id)), null, 2)}\n`,
);
console.log(`CANDIDATES ${candidates.length}`);
console.log(`MAPPED ${candidates.filter((candidate) => candidate.precision !== "withheld").length}`);
console.log(`WITHHELD ${candidates.filter((candidate) => candidate.precision === "withheld").length}`);
console.log(`ISSUES ${issues.length}`);
for (const issue of issues) console.log(`- ${issue}`);
