/**
 * The manuscript's gutter. Controls read as marginal annotation, never chrome.
 * Filters DIM non-matches rather than removing them — the page stays intact.
 */
import { Search, X } from "lucide-react";
import {
  familyColors,
  familyLabels,
  statusLabels,
  typologyLabels,
  type Family,
  type Status,
  type Typology,
} from "@/data";

export interface Filters {
  query: string;
  families: Set<Family>;
  typologies: Set<Typology>;
  statuses: Set<Status>;
}

const FAMILY_ORDER: Family[] = [
  "origins",
  "mesopotamian",
  "egyptian",
  "aegean",
  "mesoamerican",
  "semitic",
  "aramaic",
  "brahmic",
  "greek",
  "latin",
  "cyrillic",
  "sinitic",
  "independent",
  "undeciphered",
];

const TYPOLOGY_ORDER: Typology[] = [
  "proto-writing",
  "logographic",
  "logosyllabic",
  "syllabary",
  "semi-syllabary",
  "abjad",
  "alphabet",
  "abugida",
  "featural",
  "undeciphered",
];

const STATUS_ORDER: Status[] = [
  "living",
  "liturgical",
  "revived",
  "historical",
  "extinct",
];

function Chip({
  on,
  onClick,
  children,
  swatch,
  coarse,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  swatch?: string;
  coarse?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`flex w-full items-center gap-2 border-l-2 pl-2 pr-1 text-left leading-tight ${
        coarse ? "min-h-[38px] py-2 text-[14px]" : "py-[3px] text-[13px]"
      }`}
      style={{
        borderColor: on ? "var(--rubric)" : "transparent",
        color: on ? "var(--ink)" : "var(--ink-faint)",
        background: on ? "oklch(0.512 0.176 32 / 0.055)" : "transparent",
        transition: "all 150ms var(--ease-out)",
      }}>
      {swatch && (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: swatch, opacity: on ? 1 : 0.45 }}
        />
      )}
      <span className="truncate">{children}</span>
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative border-t border-border px-4 py-3.5">
      {/* Running head in the gutter, as a manuscript section mark. */}
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-[var(--rubric)]" style={{ fontSize: "0.7rem" }}>
          ¶
        </span>
        <span className="caption">{label}</span>
        <span className="field-rule mb-[3px] ml-1 flex-1" />
      </div>
      {children}
    </div>
  );
}

export default function MarginColumn({
  filters,
  setFilters,
  cutoffYear,
  setCutoffYear,
  showInfluences,
  setShowInfluences,
  showLabels,
  setShowLabels,
  matchCount,
  corpusCount = 164,
  coarse = false,
  hideSearch = false,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  cutoffYear: number | null;
  setCutoffYear: React.Dispatch<React.SetStateAction<number | null>>;
  showInfluences: boolean;
  setShowInfluences: (v: boolean) => void;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
  matchCount: number | null;
  corpusCount?: number;
  /** Coarse pointer: enlarge hit targets and lay chips out in two columns. */
  coarse?: boolean;
  /** The phone header owns the search field, so the panel omits its own. */
  hideSearch?: boolean;
}) {
  const toggle = <T,>(set: Set<T>, v: T) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };

  const anyFilter =
    filters.query.length > 0 ||
    filters.families.size > 0 ||
    filters.typologies.size > 0 ||
    filters.statuses.size > 0;

  const YEAR_MIN = -3400;
  const YEAR_MAX = 2026;
  const year = cutoffYear ?? YEAR_MAX;

  const fmtYear = (y: number) =>
    y < 0 ? `${Math.abs(y).toLocaleString()} BC` : `AD ${y}`;

  return (
    <div className="quire-scroll flex h-full flex-col overflow-y-auto">
      {/* Search — omitted on a phone, where the header carries it. */}
      {!hideSearch ? (
      <div className="px-4 pb-3.5 pt-4">
        <div className="mb-1.5 flex items-baseline gap-2">
          <label className="caption" htmlFor="script-search">
            Find a script
          </label>
          <span className="field-rule mb-[3px] flex-1" />
        </div>
        <div className="relative">
          <Search
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
          />
          <input
            id="script-search"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder="Phoenician, abugida, Kerala…"
            className="w-full border-0 border-b border-[var(--ink)]/30 bg-transparent py-1.5 pl-8 pr-7 text-[15px] italic placeholder:not-italic placeholder:text-[var(--ink-faint)]/65 focus:border-[var(--rubric)] focus:outline-none"
            style={{ transition: "border-color 150ms var(--ease-out)" }}
          />
          {filters.query && (
            <button
              onClick={() => setFilters({ ...filters, query: "" })}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--rubric)]">
              <X size={12} />
            </button>
          )}
        </div>
        {matchCount !== null && (
          <div className="gloss caption mt-2 text-[10px]">
            {matchCount} of {corpusCount} scripts shown in ink
          </div>
        )}
      </div>
      ) : (
        matchCount !== null && (
          <div className="gloss caption px-4 pb-1 pt-3 text-[10px]">
            {matchCount} of {corpusCount} scripts shown in ink
          </div>
        )
      )}

      {/* Timeline scrub */}
      <Section label="Trace to a year">
        <input
          type="range"
          min={YEAR_MIN}
          max={YEAR_MAX}
          step={10}
          value={year}
          onChange={(e) => {
            const v = Number(e.target.value);
            setCutoffYear(v >= YEAR_MAX ? null : v);
          }}
          aria-label="Timeline cutoff year"
          className={`w-full accent-[var(--rubric)] ${coarse ? "h-6" : ""}`}
        />
        <div className="mt-1 flex items-baseline justify-between">
          <span
            className="text-[15px] text-[var(--rubric)]"
            style={{ fontFamily: "var(--font-mono)" }}>
            {cutoffYear === null ? "present day" : fmtYear(year)}
          </span>
          {cutoffYear !== null && (
            <button
              onClick={() => setCutoffYear(null)}
              className="caption text-[10px] hover:text-[var(--rubric)]">
              reset
            </button>
          )}
        </div>
        <p className="gloss mt-2 text-[12.5px] italic leading-snug text-[var(--ink-faint)]">
          Scripts not yet invented at this date fade from the page.
        </p>
      </Section>

      {/* Families — doubles as the legend */}
      <Section label="Branch · legend">
        <div className={`grid gap-px ${coarse ? "grid-cols-2 gap-x-2" : ""}`}>
          {FAMILY_ORDER.map((f) => (
            <Chip
              key={f}
              coarse={coarse}
              on={filters.families.size === 0 || filters.families.has(f)}
              swatch={familyColors[f]}
              onClick={() =>
                setFilters({ ...filters, families: toggle(filters.families, f) })
              }>
              {familyLabels[f]}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Typology */}
      <Section label="Structural type">
        <div className={`grid gap-px ${coarse ? "grid-cols-2 gap-x-2" : ""}`}>
          {TYPOLOGY_ORDER.map((t) => (
            <Chip
              key={t}
              coarse={coarse}
              on={filters.typologies.size === 0 || filters.typologies.has(t)}
              onClick={() =>
                setFilters({ ...filters, typologies: toggle(filters.typologies, t) })
              }>
              {typologyLabels[t]}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Vitality */}
      <Section label="Vitality today">
        <div className={`grid gap-px ${coarse ? "grid-cols-2 gap-x-2" : ""}`}>
          {STATUS_ORDER.map((s) => (
            <Chip
              key={s}
              coarse={coarse}
              on={filters.statuses.size === 0 || filters.statuses.has(s)}
              onClick={() =>
                setFilters({ ...filters, statuses: toggle(filters.statuses, s) })
              }>
              {statusLabels[s]}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Line conventions — the plate key */}
      <Section label="Line conventions">
        <svg width="100%" height="76" role="img" aria-label="Key to line styles">
          {[
            ["Attested descent", undefined],
            ["Probable descent", "9 4"],
            ["Disputed descent", "5 4"],
            ["Stimulus diffusion", "1 5"],
          ].map(([label, dash], i) => (
            <g key={label as string} transform={`translate(0,${i * 19 + 8})`}>
              <line
                x1={2}
                x2={30}
                y1={0}
                y2={0}
                stroke="var(--ink-mid)"
                strokeWidth={1.5}
                strokeDasharray={dash as string | undefined}
              />
              <text
                x={38}
                y={0}
                dy="0.34em"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12.5,
                  fill: "var(--ink-faint)",
                }}>
                {label as string}
              </text>
            </g>
          ))}
        </svg>
        <div className="mt-1 grid gap-1.5">
          <div className="flex items-center gap-2 text-[12.5px] text-[var(--ink-faint)]">
            <svg width="30" height="10">
              <circle cx={9} cy={5} r={3.6} fill="var(--ink-mid)" />
            </svg>
            Filled — in everyday use
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-[var(--ink-faint)]">
            <svg width="30" height="10">
              <circle
                cx={9}
                cy={5}
                r={3.6}
                fill="var(--vellum)"
                stroke="var(--ink-mid)"
                strokeWidth={1.2}
              />
            </svg>
            Hollow — no longer in daily use
          </div>
        </div>
      </Section>

      {/* Display */}
      <Section label="Display">
        <div className="grid gap-px">
          <Chip coarse={coarse} on={showLabels} onClick={() => setShowLabels(!showLabels)}>
            Script names
          </Chip>
          <Chip
            coarse={coarse}
            on={showInfluences}
            onClick={() => setShowInfluences(!showInfluences)}>
            Secondary influence chords
          </Chip>
        </div>
      </Section>

      {anyFilter && (
        <div className="border-t border-border px-4 py-3">
          <button
            onClick={() =>
              setFilters({
                query: "",
                families: new Set(),
                typologies: new Set(),
                statuses: new Set(),
              })
            }
            className="apparatus">
            Clear all filters
          </button>
        </div>
      )}

      <div className="mt-auto border-t border-border px-4 py-3.5">
        <p className="gloss text-[12.5px] italic leading-snug text-[var(--ink-faint)]">
          {coarse
            ? "Drag to pan, pinch to zoom. Tap a node to illuminate its descent to the point of invention and open the leaf."
            : "Drag to pan, scroll to zoom. Hover a node to illuminate its descent to the point of invention; click to open the leaf."}
        </p>
      </div>
    </div>
  );
}
