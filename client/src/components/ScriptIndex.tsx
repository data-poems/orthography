/**
 * The index of the plate, as a manuscript carries its own table. This is the
 * primary way in on a phone: a 164-node radial chart cannot be navigated by
 * pinching alone, so the corpus is also offered as a ruled, grouped list with
 * every script's specimen shown at readable size.
 *
 * Rubric vermilion marks only structure and active state.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  allScripts,
  familyColors,
  familyLabels,
  typologyLabels,
  type Family,
  type ScriptNode,
} from "@/data";
import { shortSpecimen } from "@/lib/specimen";

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
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef(new Map<string, HTMLElement>());
  const railRefs = useRef(new Map<string, HTMLButtonElement>());
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  /** Set while a tap-scroll is in flight, so the spy does not fight the animation. */
  const jumpingTo = useRef<string | null>(null);

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

  /* The rail earns its space only when there is real scrolling to skip. Under
     three groups, a tap target per group is noise. */
  const showRail = groups.length >= 3;

  /* Scroll spy: whichever running head is nearest under the rail wins. Cheaper
     and more predictable here than an IntersectionObserver, because the sticky
     heads mean several sections can be "intersecting" at once. */
  const syncActive = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const top = scroller.getBoundingClientRect().top;
    let current: string | null = null;
    for (const g of groups) {
      const el = sectionRefs.current.get(g.family);
      if (!el) continue;
      // 4px of tolerance: a section counts as current once its head reaches the top.
      if (el.getBoundingClientRect().top - top <= 4) current = g.family;
      else break;
    }
    setActiveFamily(current ?? groups[0]?.family ?? null);
  }, [groups]);

  useEffect(() => {
    syncActive();
  }, [syncActive]);

  /* Keep the active chip in view as you scroll the list, so the rail always shows
     where you are without the reader having to scroll the rail itself. */
  useEffect(() => {
    if (!activeFamily) return;
    const chip = railRefs.current.get(activeFamily);
    chip?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeFamily]);

  const jumpTo = (family: string) => {
    const el = sectionRefs.current.get(family);
    const scroller = scrollRef.current;
    if (!el || !scroller) return;
    jumpingTo.current = family;
    setActiveFamily(family);
    const offset =
      el.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    scroller.scrollTo({ top: scroller.scrollTop + offset, behavior: "smooth" });
    window.setTimeout(() => {
      jumpingTo.current = null;
      syncActive();
    }, 420);
  };

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
    <div className="flex h-full flex-col">
      {/* ── Family rail: a tab index cut into the edge of the quire, so any branch
          is one tap away instead of sixty rows of scrolling. ─────────────────── */}
      {showRail && (
        <div className="relative shrink-0 border-b border-border bg-[var(--vellum-deep)]">
          <div
            className="quire-scroll flex gap-0 overflow-x-auto px-3 py-1.5"
            style={{ scrollbarWidth: "none" }}>
            {groups.map((g) => {
              const on = g.family === activeFamily;
              return (
                <button
                  key={g.family}
                  ref={(el) => {
                    if (el) railRefs.current.set(g.family, el);
                    else railRefs.current.delete(g.family);
                  }}
                  onClick={() => jumpTo(g.family)}
                  aria-current={on ? "true" : undefined}
                  className="flex h-9 shrink-0 items-center gap-1.5 px-2.5 active:scale-[0.97]"
                  style={{
                    transition: "transform 160ms var(--ease-out)",
                    borderBottom: `2px solid ${on ? "var(--rubric)" : "transparent"}`,
                  }}>
                  <span
                    className="h-[7px] w-[7px] shrink-0 rounded-full"
                    style={{
                      background: familyColors[g.family],
                      opacity: on ? 1 : 0.55,
                    }}
                  />
                  <span
                    className="whitespace-nowrap text-[9.5px] uppercase"
                    style={{
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.12em",
                      color: on ? "var(--rubric)" : "var(--ink-mid)",
                    }}>
                    {familyLabels[g.family] ?? g.family}
                  </span>
                  <span
                    className="text-[9px] text-[var(--ink-faint)]"
                    style={{ fontFamily: "var(--font-mono)" }}>
                    {g.list.length}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Hairline fades, so a scrollable rail looks scrollable. */}
          <span className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[var(--vellum-deep)] to-transparent" />
          <span className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[var(--vellum-deep)] to-transparent" />
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={() => {
          if (!jumpingTo.current) syncActive();
        }}
        className="quire-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pb-24">
      {groups.map((g) => (
        <section
          key={g.family}
          ref={(el) => {
            if (el) sectionRefs.current.set(g.family, el);
            else sectionRefs.current.delete(g.family);
          }}>
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
              const spec = shortSpecimen(s, 7);
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
                    {/* The script writing its own name, at a size you can read.
                        Where nothing can honestly be drawn — unencoded or
                        undeciphered — a ruled blank stands in, and the detail leaf
                        explains why, rather than borrowing another script's glyphs. */}
                    {spec.kind !== "none" ? (
                      <span
                        className="w-[4.4rem] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-[1.5rem] leading-[1.35]"
                        style={{
                          fontFamily: spec.font,
                          color: on ? "var(--rubric)" : "var(--ink)",
                        }}
                        aria-hidden>
                        {spec.text}
                      </span>
                    ) : (
                      <span
                        className="flex w-[4.4rem] shrink-0 items-center justify-center"
                        aria-hidden
                        title="No specimen: unencoded or undeciphered">
                        <span className="h-px w-4 bg-[var(--ink-faint)]/45" />
                        <span className="ml-1 text-[9px] italic text-[var(--ink-faint)]/70">
                          n.e.
                        </span>
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
    </div>
  );
}
