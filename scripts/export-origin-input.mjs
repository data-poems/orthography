/** Export the existing corpus as compact structured input for origin research. */
import { writeFileSync } from "node:fs";
import { allScripts } from "../client/src/data/index.ts";

const rows = allScripts
  .filter((script) => script.id !== "root")
  .map(({ id, name, family, region, yearStart, source, tagline }) => ({
    id,
    name,
    family,
    region,
    yearStart,
    source: source ?? null,
    tagline,
  }));

writeFileSync(
  "scripts/origin-research-input.json",
  `${JSON.stringify(rows, null, 2)}\n`,
);
console.log(`Exported ${rows.length} script records for origin research.`);
