/**
 * An inventory is an exemplar sheet: ruled, exact, and quiet. It gives every
 * assigned Unicode character its own small cell, so the visitor reads a script
 * as a system rather than as one decorative sample.
 */
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Inventory } from "@/data/inventories";

const GROUP_LABELS: Record<string, string> = {
  letters: "Letters",
  modifiers: "Modifiers",
  marks: "Marks & vowels",
  numerals: "Numerals",
  punctuation: "Punctuation",
  signs: "Signs",
  other: "Other characters",
};

const GROUP_ORDER = [
  "letters",
  "modifiers",
  "marks",
  "numerals",
  "punctuation",
  "signs",
  "other",
];

function codepoint(cp: number) {
  return `U+${cp.toString(16).toUpperCase().padStart(cp > 0xffff ? 6 : 4, "0")}`;
}

function CharacterCell({ cp, font }: { cp: number; font: string }) {
  const glyph = String.fromCodePoint(cp);
  return (
    <div
      className="group relative flex aspect-square min-h-10 items-center justify-center border-b border-r border-border/85 bg-[oklch(1_0_0/0.16)] px-1 text-center transition-colors hover:z-10 hover:bg-[var(--rubric-pale)]"
      title={`${codepoint(cp)} · ${glyph}`}
      aria-label={codepoint(cp)}>
      <span
        aria-hidden
        className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[1.16rem] leading-none group-hover:text-[var(--rubric)]"
        style={{ fontFamily: font }}>
        {glyph}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0.5 left-1/2 -translate-x-1/2 font-mono text-[7px] tracking-[-0.08em] text-[var(--ink-faint)] opacity-0 transition-opacity group-hover:opacity-100">
        {cp.toString(16).toUpperCase()}
      </span>
    </div>
  );
}

function InventoryGroup({
  group,
  characters,
  font,
}: {
  group: string;
  characters: number[];
  font: string;
}) {
  const [limit, setLimit] = useState(120);
  const visible = characters.slice(0, limit);
  const remaining = characters.length - visible.length;
  return (
    <section className="mt-5 first:mt-0" aria-label={`${GROUP_LABELS[group] ?? group} inventory`}>
      <div className="mb-2 flex items-end justify-between gap-3">
        <h4 className="caption text-[9.5px]">{GROUP_LABELS[group] ?? group}</h4>
        <span className="caption-tight text-[9px] text-[var(--ink-faint)]">
          {characters.length.toLocaleString()}
        </span>
      </div>
      <div className="grid grid-cols-8 border-l border-t border-border sm:grid-cols-10">
        {visible.map((cp) => (
          <CharacterCell key={cp} cp={cp} font={font} />
        ))}
      </div>
      {remaining > 0 && (
        <button
          onClick={() => setLimit((n) => n + 240)}
          className="mt-2 flex min-h-10 w-full items-center justify-center gap-1.5 border-b border-[var(--ink)]/25 py-2 text-[10px] uppercase tracking-[0.13em] text-[var(--ink-mid)] hover:border-[var(--rubric)] hover:text-[var(--rubric)]"
          style={{ fontFamily: "var(--font-mono)" }}>
          Show 240 more · {remaining.toLocaleString()} remain
        </button>
      )}
    </section>
  );
}

export default function CharacterInventory({
  scriptId,
  fontHint,
  defaultOpen = false,
}: {
  scriptId: string;
  fontHint?: string;
  /** Allows a direct URL to open straight to the exemplar sheet. */
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [inventory, setInventory] = useState<Inventory | null | undefined>(undefined);

  useEffect(() => {
    if (!open || inventory !== undefined) return;
    let cancelled = false;
    // This 2.7 MB Unicode-derived sheet is deliberately a separate Vite chunk;
    // a reader who only follows the tree never pays to download the world's
    // ideographs. It is fetched only when the accordion opens.
    import("@/data/inventories").then(({ inventories }) => {
      if (!cancelled) setInventory(inventories[scriptId] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [open, inventory, scriptId]);

  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  const groups = useMemo(() => {
    if (!inventory) return [];
    return GROUP_ORDER.filter((group) => inventory.groups[group]?.length).map((group) => [
      group,
      inventory.groups[group],
    ] as const);
  }, [inventory]);

  return (
    <section className="mb-6 border-y border-border py-3">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-10 w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
        aria-controls={`inventory-${scriptId}`}>
        <span>
          <span className="caption block text-[10px]">Character inventory</span>
          <span className="mt-0.5 block text-[13px] italic leading-snug text-[var(--ink-mid)]">
            {inventory && inventory.total
              ? `${inventory.total.toLocaleString()} assigned Unicode characters`
              : "Unicode code chart"}
          </span>
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-border text-[var(--ink-mid)]">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {open && (
        <div id={`inventory-${scriptId}`} className="mt-4 border-t border-border pt-4">
          {inventory === undefined ? (
            <div className="flex min-h-24 items-center gap-2 text-[13px] italic text-[var(--ink-faint)]">
              <Loader2 size={14} className="animate-spin" /> Loading the code chart…
            </div>
          ) : inventory === null ? (
            <p className="text-[13.5px] italic leading-snug text-[var(--ink-mid)]">
              Unicode does not assign this historical or undeciphered writing system
              its own Script property, so a complete character inventory cannot be
              stated responsibly.
            </p>
          ) : (
            <>
              <p className="mb-4 text-[12.5px] italic leading-snug text-[var(--ink-mid)]">
                Every assigned character Unicode attributes to <em>{inventory.script.replaceAll("_", " ")}</em>,
                in codepoint order. Hover a cell for its Unicode value. Large charts
                reveal progressively so the leaf remains usable.
              </p>
              <div style={{ fontFamily: fontHint ?? "serif" }}>
                {groups.map(([group, characters]) => (
                  <InventoryGroup
                    key={group}
                    group={group}
                    characters={characters}
                    font={fontHint ?? "serif"}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
