/**
 * The running head of a bound volume. Four plates in one codex: the chart,
 * the specimen sheet, the essay, and the origin map. Vermilion marks the leaf
 * you are on; the rest
 * is ink at low emphasis. Hairline rules, no boxes, no buttons.
 */
import { Link, useLocation } from "wouter";
import { assetUrl } from "@/lib/asset";

const LOGO = assetUrl("media/writing-mark.svg");

const PLATES = [
  { href: "/", label: "The chart", roman: "I" },
  { href: "/specimens", label: "The specimens", roman: "II" },
  { href: "/about", label: "The essay", roman: "III" },
  { href: "/origins", label: "The origins", roman: "IV" },
] as const;

export default function PlateNav({ dense = false }: { dense?: boolean }) {
  const [path] = useLocation();
  return (
    <nav
      aria-label="Plates"
      className={`flex items-center gap-4 ${dense ? "" : "gap-5"}`}>
      <Link href="/" className="flex shrink-0 items-center gap-2">
        <img src={LOGO} alt="The Tree of Writing" className="h-7 w-7" />
        {!dense && (
          <span
            className="hidden text-[0.72rem] uppercase leading-none lg:inline"
            style={{
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.2em",
            }}>
            The Tree of Writing
          </span>
        )}
      </Link>
      <span className="field-rule hidden flex-1 sm:block" />
      <ul className="flex items-baseline gap-4">
        {PLATES.map((p) => {
          const on = path === p.href;
          return (
            <li key={p.href}>
              <Link
                href={p.href}
                aria-current={on ? "page" : undefined}
                className="group inline-flex items-baseline gap-1.5">
                <span
                  className="text-[9px] leading-none"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: on ? "var(--rubric)" : "var(--ink-faint)",
                  }}>
                  {p.roman}
                </span>
                <span
                  className="whitespace-nowrap pb-0.5 text-[0.68rem] uppercase leading-none"
                  style={{
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.15em",
                    color: on ? "var(--rubric)" : "var(--ink-mid)",
                    borderBottom: on
                      ? "1px solid var(--rubric)"
                      : "1px solid transparent",
                    transition: "color 160ms var(--ease-out)",
                  }}>
                  {p.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
