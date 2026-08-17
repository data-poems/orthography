/** Generate the static, typed geographic-origin data used by Plate IV. */
import { readFileSync, writeFileSync } from "node:fs";
import { allScripts } from "../client/src/data/index.ts";

const candidateRows = JSON.parse(readFileSync("scripts/origin-candidates.json", "utf8"));
const overrides = JSON.parse(readFileSync("scripts/origin-overrides.json", "utf8"));
const records = new Map(candidateRows.map((row) => [row.id, row]));
for (const override of overrides) records.set(override.id, override);

const corpus = allScripts.filter((script) => script.id !== "root");
const missing = corpus.filter((script) => !records.has(script.id)).map((script) => script.id);
if (missing.length) throw new Error(`Origin records missing: ${missing.join(", ")}`);

const normalized = corpus.map((script) => {
  const row = records.get(script.id);
  return {
    id: script.id,
    latitude: row.latitude,
    longitude: row.longitude,
    precision: row.precision,
    label: row.origin_label,
    note: row.origin_note,
    source: row.source_url || script.source || null,
  };
});

const mapped = normalized.filter((record) => record.precision !== "withheld");
const output = `/**\n * Geographic origin data for Plate IV. Coordinates describe historical\n * development or first secure attestation, not a script's full area of use.\n * See research/geographic-origin-policy.md for evidence and precision rules.\n */\n\nexport type OriginPrecision = "site" | "region" | "broad" | "withheld";\n\nexport interface OriginRecord {\n  id: string;\n  latitude: number | null;\n  longitude: number | null;\n  precision: OriginPrecision;\n  label: string;\n  note: string;\n  source: string | null;\n}\n\nexport const originRecords: OriginRecord[] = ${JSON.stringify(normalized, null, 2)} as OriginRecord[];\n\nexport const mappedOrigins = originRecords.filter(\n  (record): record is OriginRecord & { latitude: number; longitude: number } =>\n    record.latitude !== null && record.longitude !== null,\n);\n\nexport const originByScriptId = new Map(originRecords.map((record) => [record.id, record]));\n\nexport const ORIGIN_MAP_STATS = { mapped: ${mapped.length}, withheld: ${normalized.length - mapped.length}, total: ${normalized.length} } as const;\n`;
writeFileSync("client/src/data/origins.ts", output);
console.log(`Generated ${normalized.length} origin records: ${mapped.length} mapped, ${normalized.length - mapped.length} withheld.`);
