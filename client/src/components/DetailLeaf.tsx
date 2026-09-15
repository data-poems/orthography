/**
 * The detail leaf is a page laid down from the right. Opens with a rubricated
 * versal initial set in the script being described where Unicode permits.
 * The specimen block is the hero; prose is body text, not marketing.
 */
import { ArrowUpRight, Check, Link2, Network, X } from "lucide-react";
import { useState } from "react";
import CharacterInventory from "@/components/CharacterInventory";
import { specimenOf } from "@/lib/specimen";
import {
  ancestryOf,
  certaintyLabels,
  childrenOf,
  directionLabels,
  familyColors,
  familyLabels,
  scriptById,
  statusLabels,
  typologyGloss,
  typologyLabels,
  type ScriptNode,
} from "@/data";
import { originByScriptId } from "@/data/origins";

function Versal({ node }: { node: ScriptNode }) {
  // Prefer a glyph from the script itself; fall back to the Latin initial.
  const glyph = node.endonym?.[0] ?? node.sample?.[0] ?? node.name[0];
  return (
    <span
      aria-hidden
      className="float-left mr-3 mt-1 leading-[0.78]"
      style={{
        fontFamily: node.fontHint ?? "var(--font-display)",
        fontSize: "3.4rem",
        color: "var(--rubric)",
      }}>
      {glyph}
    </span>
  );
}

export default function DetailLeaf({
  node,
  onClose,
  onNavigate,
  handle = false,
  onShowInTree,
}: {
  node: ScriptNode;
  onClose: () => void;
  onNavigate: (id: string) => void;
  /** Phone sheet: show a drag handle and tighten the gutters. */
  handle?: boolean;
  /**
   * Phone only: leave the index and open the plate with this script focused, so
   * a reader who arrived by list can still see where it sits in the genealogy.
   */
  onShowInTree?: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const line = ancestryOf(node.id).filter((id) => id !== "root" && id !== node.id);
  const kids = childrenOf.get(node.id) ?? [];
  const parent = node.parent ? scriptById.get(node.parent) : undefined;
  const origin = originByScriptId.get(node.id);

  return (
    <aside
      key={node.id}
      className={`grain pricked relative flex h-full w-full flex-col bg-card ${
        handle ? "" : "leaf-enter border-l border-border"
      }`}
      aria-label={`${node.name} — detail`}>
      {handle && (
        <div className="flex shrink-0 justify-center pb-1 pt-2.5">
          <span className="h-1 w-10 rounded-full bg-[var(--ink-faint)]/35" />
        </div>
      )}
      {/* Head band */}
      <header
        className={`relative shrink-0 border-b border-border ${
          handle ? "px-5 pb-3 pt-2" : "px-7 pb-4 pt-5"
        }`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="caption flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: familyColors[node.family] }}
              />
              {familyLabels[node.family]}
              {node.iso && <span className="text-[var(--ink-faint)]">· {node.iso}</span>}
            </div>
            <h2
              className={`mt-1.5 leading-[1.05] ${
                handle ? "text-[1.6rem]" : "text-[2rem]"
              }`}>
              {node.name}
            </h2>
            {node.endonym && (
              <div
                className={`mt-0.5 text-[var(--ink-mid)] ${
                  handle ? "text-[1rem]" : "text-[1.15rem]"
                }`}
                style={{ fontFamily: node.fontHint ?? "serif" }}>
                {node.endonym}
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-start gap-1">
            <button
              onClick={async () => {
                const url = new URL(window.location.href);
                url.searchParams.set("script", node.id);
                try {
                  await navigator.clipboard.writeText(url.toString());
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1800);
                } catch {
                  // Embedded browsers can deny clipboard access. Keep the shareable
                  // URL in the location bar so it remains copyable by other means.
                  window.history.replaceState({}, "", url);
                }
              }}
              aria-label={copied ? "Link copied" : `Copy a direct link to ${node.name}`}
              className="rail-btn -mr-1.5 mt-0.5 shrink-0">
              {copied ? <Check size={handle ? 18 : 15} /> : <Link2 size={handle ? 18 : 15} />}
            </button>
            <button
              onClick={onClose}
              aria-label="Close detail"
              className="rail-btn -mr-1.5 mt-0.5 shrink-0">
              <X size={handle ? 18 : 15} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`quire-scroll ruled min-h-0 flex-1 overflow-y-auto pt-5 ${
          handle ? "px-5 pb-10" : "px-7 pb-16"
        }`}>
        {/* The heading distinguishes an autonym from an attested text. */}
        {(() => {
          const spec = specimenOf(node);
          if (spec.kind === "none") {
            return (
              <figure className="specimen mb-6 px-5 py-4">
                <figcaption className="caption text-[10px]">
                  No specimen possible
                </figcaption>
                <div className="mt-2 text-[1.35rem] italic leading-tight text-[var(--ink-mid)]">
                  {node.name}
                </div>
                <figcaption className="caption-tight mt-2.5 border-t border-border pt-2 text-[10.5px] italic">
                  {spec.note}
                </figcaption>
              </figure>
            );
          }
          return (
            <figure className={`specimen mb-6 py-4 ${handle ? "px-4" : "px-5"}`}>
              <figcaption className="caption mb-2 text-[9.5px]">
                {spec.kind === "autonym"
                  ? "Written in itself"
                  : "Attested specimen"}
              </figcaption>
              <div
                className={`break-words leading-[1.5] ${
                  handle ? "text-[1.7rem]" : "text-[2rem]"
                }`}
                style={{ fontFamily: spec.font }}>
                {spec.text}
              </div>
              {/* Where the autonym leads, the letter run is still worth showing. */}
              {spec.kind === "autonym" && node.sample && (
                <div className="mt-3 border-t border-border pt-2.5">
                  <div className="caption mb-1 text-[9px]">Letters</div>
                  <div
                    className="break-words text-[1.1rem] leading-[1.5] text-[var(--ink-mid)]"
                    style={{ fontFamily: spec.font }}>
                    {node.sample}
                  </div>
                </div>
              )}
              {spec.note && (
                <figcaption className="caption-tight mt-2.5 border-t border-border pt-2 text-[10.5px] italic">
                  {spec.note}
                </figcaption>
              )}
            </figure>
          );
        })()}

        {/* Metadata table, set as a ledger. */}
        <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 border-y border-border py-3">
          {[
            ["Period", node.period],
            ["Region", node.region],
            ...(origin
              ? ([
                  ["Map origin", origin.label],
                  ["Map precision", origin.precision === "site" ? "Documented site" : origin.precision === "region" ? "Regional centroid" : origin.precision === "broad" ? "Broad historical zone" : "Intentionally withheld"],
                ] as [string, string][])
              : []),
            ["Type", `${typologyLabels[node.typology]} — ${typologyGloss[node.typology]}`],
            ["Direction", directionLabels[node.direction] ?? node.direction],
            ["Vitality", statusLabels[node.status]],
            ...(node.users ? ([["Users", node.users]] as [string, string][]) : []),
            ["Languages", node.languages.join(", ")],
          ].map(([k, v]) => (
            <div
              key={k}
              className={`col-span-2 grid gap-x-5 ${
                handle ? "grid-cols-[5.2rem_1fr]" : "grid-cols-[6.2rem_1fr]"
              }`}>
              <dt className="caption pt-[3px]">{k}</dt>
              <dd className="text-[14.5px] leading-snug text-[var(--ink-mid)]">{v}</dd>
            </div>
          ))}
        </dl>

        {origin && (
          <aside className="specimen mb-6 px-4 py-3" aria-label="Geographic origin note">
            <div className="caption mb-1.5 text-[9px]">Geographic record</div>
            <p className="text-[14px] italic leading-snug text-[var(--ink-mid)]">
              {origin.note}
            </p>
            {origin.source && origin.source !== node.source && (
              <a
                href={origin.source}
                target="_blank"
                rel="noopener noreferrer"
                className="caption mt-2 inline-flex items-center gap-1.5 border-b border-border pb-0.5 text-[9px] hover:border-[var(--rubric)] hover:text-[var(--rubric)]">
                Map basis <ArrowUpRight size={10} />
              </a>
            )}
          </aside>
        )}

        <CharacterInventory
          scriptId={node.id}
          fontHint={node.fontHint}
          defaultOpen={new URLSearchParams(window.location.search).get("inventory") === "1"}
        />

        {/* Descent statement. */}
        <div className="mb-6">
          <div className="caption mb-1.5">Descent</div>
          {parent && parent.id !== "root" ? (
            <p className="text-[14.5px] leading-snug text-[var(--ink-mid)]">
              From{" "}
              <button
                onClick={() => onNavigate(parent.id)}
                className="border-b border-[var(--rubric)]/40 text-[var(--rubric)] hover:border-[var(--rubric)]">
                {parent.name}
              </button>
              . {certaintyLabels[node.certainty ?? "attested"]}.
            </p>
          ) : (
            <p className="text-[14.5px] leading-snug text-[var(--ink-mid)]">
              No parent script. {node.influences?.length
                ? "Created with knowledge that writing existed, but not of how any existing script worked — stimulus diffusion."
                : "An independent invention of writing."}
            </p>
          )}
          {line.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
              {line.map((id, i) => {
                const s = scriptById.get(id);
                if (!s) return null;
                return (
                  <span key={id} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-[var(--ink-faint)]">→</span>}
                    <button
                      onClick={() => onNavigate(id)}
                      className="caption-tight border-b border-border pb-px hover:border-[var(--rubric)] hover:text-[var(--rubric)]">
                      {s.name}
                    </button>
                  </span>
                );
              })}
              <span className="text-[var(--ink-faint)]">→</span>
              <span className="caption-tight text-[var(--rubric)]">{node.name}</span>
            </div>
          )}
          {node.influences && node.influences.length > 0 && (
            <p className="mt-2 text-[13.5px] italic leading-snug text-[var(--ink-faint)]">
              Further influence from{" "}
              {node.influences
                .map((id) => scriptById.get(id)?.name ?? id)
                .join(", ")}
              .
            </p>
          )}
        </div>

        {/* Body prose, opened with the versal initial. */}
        <div className="mb-6">
          <p className="mb-3 text-[1.02rem] italic leading-snug text-[var(--ink-mid)]">
            {node.tagline}
          </p>
          {node.detail.map((para, i) => (
            <p
              key={i}
              className={`mb-3.5 leading-[1.66] ${
                handle ? "text-[15.5px]" : "text-[16.5px]"
              }`}>
              {i === 0 && <Versal node={node} />}
              {para}
            </p>
          ))}
        </div>

        {/* Pulled facts. */}
        {node.facts && node.facts.length > 0 && (
          <div className="specimen mb-6 px-5 py-3.5">
            <div className="caption mb-2">Noted</div>
            <dl className="grid gap-1.5">
              {node.facts.map((f) => (
                <div
                  key={f.label}
                  className={
                    handle
                      ? "grid gap-y-0.5"
                      : "grid grid-cols-[8.5rem_1fr] gap-x-4"
                  }>
                  <dt className="caption-tight pt-[1px] text-[10.5px] uppercase tracking-[0.09em]">
                    {f.label}
                  </dt>
                  <dd className="text-[14.5px] leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Progeny. */}
        {kids.length > 0 && (
          <div className="mb-6">
            <div className="caption mb-2">
              Descendants · {kids.length}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {kids.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onNavigate(c.id)}
                  className={`group flex items-center gap-1.5 border-b border-[var(--ink)]/25 px-1 text-[14px] transition-colors hover:border-[var(--rubric)] ${
                    handle ? "py-1.5" : "py-0.5"
                  }`}
                  style={{ transition: "all 160ms var(--ease-out)" }}>
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: familyColors[c.family] }}
                  />
                  <span className="group-hover:text-[var(--rubric)]">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {node.source && (
          <a
            href={node.source}
            target="_blank"
            rel="noopener noreferrer"
            className="caption inline-flex items-center gap-1.5 border-b border-border pb-0.5 hover:border-[var(--rubric)] hover:text-[var(--rubric)]">
            Source <ArrowUpRight size={11} />
          </a>
        )}
      </div>

      {/* Phone: a fixed foot action, so "where is this in the tree" is always
          one tap away rather than something to scroll for. */}
      {onShowInTree && (
        <div className="shrink-0 border-t border-border bg-[var(--vellum)] px-5 py-2.5">
          <button
            onClick={() => onShowInTree(node.id)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[2px] border border-[var(--rubric)]/45 bg-[oklch(0.512_0.176_32/0.055)] active:scale-[0.98]"
            style={{ transition: "transform 160ms var(--ease-out)" }}>
            <Network size={15} className="text-[var(--rubric)]" />
            <span
              className="text-[10.5px] uppercase text-[var(--rubric)]"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.16em",
              }}>
              Show in the plate
            </span>
          </button>
        </div>
      )}
    </aside>
  );
}
