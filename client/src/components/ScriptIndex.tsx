/**
 * STYLE REMINDER — Scriptorium Vellum
 * The index of the plate, as a manuscript carries its own table. This is the
 * primary way in on a phone: a 164-node radial chart cannot be navigated by
 * pinching alone, so the corpus is also offered as a ruled, grouped list with
 * every script's specimen shown at readable size.
 *
 * Rubric vermilion marks only structure and active state.
 */
import { useMemo } from "react";
import {
  allScripts,
  familyColors,
  familyLabels,
  typologyLabels,
  type Family,
  type ScriptNode,
} from "@/data";

function formatYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `AD ${y}`;
}

export default function ScriptIndex({
  matchIds,
  cutoffYear,
  onSelect,
  selectedId,
}: {
  matchIds: Set<string>;
  cutoffYear: number | null;
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  // Grouped by family, chronological within each group: the order a scholar
  // would shelve them in.
  const groups = useMemo(() => {
    const visible = allScripts.filter((s) => {
      if (s.id === "root") return false;
      if (matchIds.size > 0 && !matchIds.has(s.id)) return false;
      if (cutoffYear !== null && s.yearStart > cutoffYear) return false;
      return true;
    });
    const byFamily = new Map<Family, ScriptNode[]>();
    for (const s of visible) {
      const list = byFamily.get(s.family) ?? [];
      list.push(s);
      byFamily.set(s.family, list);
    }
    return Array.from(byFamily.entries())
      .map(([family, list]) => ({
        family,
        list: list.slice().sort((a, b) => a.yearStart - b.yearStart),
      }))
      .sort((a, b) => a.list[0].yearStart - b.list[0].yearStart);
  }, [matchIds, cutoffYear]);

  const total = groups.reduce((n, g) => n + g.list.length, 0);

  if (total === 0) {
    return (
      <div className="px-5 py-14 text-center">
        <p className="gloss text-[0.95rem] italic text-[var(--ink-faint)]">
          Nothing in the corpus answers to that. Clear a filter and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {groups.map((g) => (
        <section key={g.family}>
          {/* Running head, sticky like a page header in a printed corpus. */}
          <div className="sticky top-0 z-10 flex items-baseline gap-2 border-b border-border bg-[var(--vellum)]/94 px-4 py-2 backdrop-blur-[2px]">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: familyColors[g.family] }}
            />
            <span className="caption text-[9.5px]">
              {familyLabels[g.family] ?? g.family}
            </span>
            <span className="field-rule mb-[3px] flex-1" />
            <span
              className="shrink-0 text-[9.5px] text-[var(--ink-faint)]"
              style={{ fontFamily: "var(--font-mono)" }}>
              {g.list.length}
            </span>
          </div>

          <ul>
            {g.list.map((s) => {
              const on = s.id === selectedId;
              return (
                <li key={s.id} className="border-b border-border/55">
                  <button
                    onClick={() => onSelect(s.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[var(--vellum-deep)]"
                    style={{
                      borderLeft: `2px solid ${on ? "var(--rubric)" : "transparent"}`,
                      transition: "border-color 160ms var(--ease-out)",
                    }}>
                    {/* Specimen at a size you can actually read on a phone. */}
                    {/* Specimen at a size you can actually read on a phone. An
                        unencoded script gets a ruled blank rather than a dot, so
                        the column stays aligned without implying a glyph. */}
                    {s.sample ? (
                      <span
                        className="w-[3.1rem] shrink-0 truncate text-[1.55rem] leading-none"
                        style={{
                          fontFamily: s.fontHint ?? "serif",
                          color: on ? "var(--rubric)" : "var(--ink)",
                        }}
                        aria-hidden>
                        {s.sample}
                      </span>
                    ) : (
                      <span
                        className="flex w-[3.1rem] shrink-0 items-center"
                        aria-hidden>
                        <span className="h-px w-5 bg-[var(--ink-faint)]/40" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate text-[1.02rem] leading-tight"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: on ? "var(--rubric)" : undefined,
                        }}>
                        {s.name}
                      </span>
                      <span className="mt-0.5 flex items-baseline gap-1.5">
                        <span
                          className="shrink-0 text-[9.5px] text-[var(--ink-faint)]"
                          style={{
                            fontFamily: "var(--font-mono)",
                            letterSpacing: "0.08em",
                          }}>
                          {formatYear(s.yearStart)}
                        </span>
                        <span className="truncate text-[11.5px] italic text-[var(--ink-faint)]">
                          {typologyLabels[s.typology]}
                          {s.status === "living" ? " · living" : ""}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
    const byFamily = new Map<Family, ScriptNode[]>();
