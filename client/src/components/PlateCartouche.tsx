/**
 * STYLE REMINDER — Scriptorium Vellum
 * The plate's own titling block, as an engraved corpus would carry it: plate
 * number, title, a rule, and the four inventions listed as the key. Sits in the
 * dead upper-left corner of the canvas where no branch reaches.
 */
import { scriptById } from "@/data";

const FOUR = [
  { id: "cuneiform", place: "Mesopotamia", year: "c. 3400 BC" },
  { id: "egyptian-hieroglyphs", place: "Egypt", year: "c. 3250 BC" },
  { id: "oracle-bone", place: "China", year: "c. 1250 BC" },
  { id: "zapotec", place: "Mesoamerica", year: "c. 500 BC" },
];

export default function PlateCartouche({
  onSelect,
  activeId,
}: {
  onSelect: (id: string) => void;
  activeId: string | null;
}) {
  return (
    <div className="pointer-events-none absolute left-6 top-5 max-w-[19rem]">
      <div
        className="settle"
        style={{ ["--delay" as string]: "260ms" }}>
        <div className="caption mb-1 text-[10px]">Plate I · radial genealogy</div>
        <h1 className="text-[1.72rem] leading-[1.06]">
          The descent of the
          <br />
          world's writing systems
        </h1>
        <div className="field-rule mt-2.5 w-full" />
      </div>

      <div
        className="settle pointer-events-auto mt-3"
        style={{ ["--delay" as string]: "420ms" }}>
        <div className="caption mb-1.5 text-[10px]">
          <span className="mr-1.5 text-[var(--rubric)]">¶</span>
          Invented from nothing
        </div>
        <ul className="grid gap-[3px]">
          {FOUR.map((f) => {
            const s = scriptById.get(f.id);
            if (!s) return null;
            const on = activeId === f.id;
            return (
              <li key={f.id}>
                <button
                  onClick={() => onSelect(f.id)}
                  className="group flex w-full items-baseline gap-2 border-l-2 pl-2 text-left"
                  style={{
                    borderColor: on ? "var(--rubric)" : "transparent",
                    transition: "border-color 160ms var(--ease-out)",
                  }}>
                  <span
                    className="w-[5.6rem] shrink-0 text-[12.5px] italic leading-tight text-[var(--ink-faint)]">
                    {f.place}
                  </span>
                  <span
                    className="text-[14.5px] leading-tight group-hover:text-[var(--rubric)]"
                    style={{ color: on ? "var(--rubric)" : undefined }}>
                    {s.name}
                  </span>
                  <span className="caption ml-auto shrink-0 text-[9.5px]">
                    {f.year}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="gloss mt-2.5 text-[12.5px] italic leading-snug text-[var(--ink-faint)]">
          Whether Egypt invented or inherited the idea is still argued. Everything
          on the outer rings was learned from something already written.
        </p>
      </div>
    </div>
  );
}
