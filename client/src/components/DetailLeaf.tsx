/**
 * STYLE REMINDER — Scriptorium Vellum
 * The detail leaf is a page laid down from the right. Opens with a rubricated
 * versal initial set in the script being described where Unicode permits.
 * The specimen block is the hero; prose is body text, not marketing.
 */
import { ArrowUpRight, X } from "lucide-react";
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
}: {
  node: ScriptNode;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const line = ancestryOf(node.id).filter((id) => id !== "root" && id !== node.id);
  const kids = childrenOf.get(node.id) ?? [];
  const parent = node.parent ? scriptById.get(node.parent) : undefined;

  return (
    <aside
      key={node.id}
      className="leaf-enter grain pricked relative flex h-full w-full flex-col border-l border-border bg-card"
      aria-label={`${node.name} — detail`}>
      {/* Head band */}
      <header className="relative shrink-0 border-b border-border px-7 pb-4 pt-5">
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
            <h2 className="mt-1.5 text-[2rem] leading-[1.05]">{node.name}</h2>
            {node.endonym && (
              <div
                className="mt-0.5 text-[1.15rem] text-[var(--ink-mid)]"
                style={{ fontFamily: node.fontHint ?? "serif" }}>
                {node.endonym}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close detail"
            className="apparatus mt-1 shrink-0">
            <X size={14} />
          </button>
        </div>
      </header>

      <div className="quire-scroll ruled min-h-0 flex-1 overflow-y-auto px-7 pb-16 pt-5">
        {/* Specimen block — the hero. */}
        {node.sample ? (
          <figure className="specimen mb-6 px-5 py-4">
            <div
              className="break-words text-[2rem] leading-[1.5]"
              style={{ fontFamily: node.fontHint ?? "serif" }}>
              {node.sample}
            </div>
            {node.sampleNote && (
              <figcaption className="caption-tight mt-2.5 border-t border-border pt-2 text-[10.5px] italic">
                {node.sampleNote}
              </figcaption>
            )}
          </figure>
        ) : (
          <figure className="specimen mb-6 px-5 py-4">
            <div className="caption text-[10px]">No Unicode representation</div>
            <figcaption className="mt-1.5 text-[13.5px] italic leading-snug text-[var(--ink-mid)]">
              This script is not encoded in a form the browser can render, or has
              no standard font. The glyphs survive only in facsimile.
            </figcaption>
          </figure>
        )}

        {/* Metadata table, set as a ledger. */}
        <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 border-y border-border py-3">
          {[
            ["Period", node.period],
            ["Region", node.region],
            ["Type", `${typologyLabels[node.typology]} — ${typologyGloss[node.typology]}`],
            ["Direction", directionLabels[node.direction] ?? node.direction],
            ["Vitality", statusLabels[node.status]],
            ...(node.users ? ([["Users", node.users]] as [string, string][]) : []),
            ["Languages", node.languages.join(", ")],
          ].map(([k, v]) => (
            <div key={k} className="col-span-2 grid grid-cols-[6.2rem_1fr] gap-x-5">
              <dt className="caption pt-[3px]">{k}</dt>
              <dd className="text-[14.5px] leading-snug text-[var(--ink-mid)]">{v}</dd>
            </div>
          ))}
        </dl>

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
            <p key={i} className="mb-3.5 text-[16.5px] leading-[1.66]">
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
                <div key={f.label} className="grid grid-cols-[8.5rem_1fr] gap-x-4">
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
                  className="group flex items-center gap-1.5 border-b border-[var(--ink)]/25 px-1 py-0.5 text-[14px] transition-colors hover:border-[var(--rubric)]"
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
    </aside>
  );
}
