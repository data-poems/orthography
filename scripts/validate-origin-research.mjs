/**
 * Validate the tracked geographic claims against the current atlas corpus.
 */
import { readFileSync } from "node:fs";
import { allScripts } from "../client/src/data/index.ts";

const candidates = JSON.parse(
  readFileSync("scripts/origin-candidates.json", "utf8"),
);
const overrides = JSON.parse(
  readFileSync("scripts/origin-overrides.json", "utf8"),
);
const corpus = allScripts.filter((script) => script.id !== "root");
const byId = new Map(corpus.map((script) => [script.id, script]));
const allowedPrecision = new Set(["site", "region", "broad", "withheld"]);
const seen = new Set();
const issues = [];

function validatePoint(row, label) {
  if (!allowedPrecision.has(row.precision)) {
    issues.push(`${label}: invalid precision ${row.precision}`);
  }
  const hasPoint = Number.isFinite(row.latitude) && Number.isFinite(row.longitude);
  if (row.precision === "withheld" && hasPoint) {
    issues.push(`${label}: withheld point must not carry coordinates`);
  }
  if (row.precision !== "withheld" && !hasPoint) {
    issues.push(`${label}: mapped point is missing coordinates`);
  }
  if (hasPoint && (Math.abs(row.latitude) > 90 || Math.abs(row.longitude) > 180)) {
    issues.push(`${label}: coordinates outside WGS84 bounds`);
  }
  if (!row.origin_label || !row.origin_note || !row.source_url) {
    issues.push(`${label}: label, note, and source URL are required`);
  }
}

for (const row of candidates) {
  if (seen.has(row.id)) issues.push(`Duplicate id: ${row.id}`);
  seen.add(row.id);
  const script = byId.get(row.id);
  if (!script) {
    issues.push(`Unknown id: ${row.id}`);
    continue;
  }
  validatePoint(row, row.id);
}

for (const row of overrides) {
  if (!byId.has(row.id)) {
    issues.push(`Override references unknown id: ${row.id}`);
    continue;
  }
  validatePoint(row, `override ${row.id}`);
}

const missing = corpus.filter((script) => !seen.has(script.id)).map((script) => script.id);
if (missing.length) issues.push(`Missing (${missing.length}): ${missing.join(", ")}`);

console.log(`CANDIDATES ${candidates.length}`);
console.log(`MAPPED ${candidates.filter((candidate) => candidate.precision !== "withheld").length}`);
console.log(`WITHHELD ${candidates.filter((candidate) => candidate.precision === "withheld").length}`);
console.log(`ISSUES ${issues.length}`);
for (const issue of issues) console.log(`- ${issue}`);
if (issues.length) process.exitCode = 1;
