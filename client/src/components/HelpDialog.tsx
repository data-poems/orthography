import { ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grain max-w-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-[1.6rem] leading-tight">
            How to read this chart
          </DialogTitle>
          <DialogDescription className="text-[14.5px] italic text-[var(--ink-mid)]">
            A radial genealogy. The centre is the moment of invention; each ring
            outward is one step of descent.
          </DialogDescription>
        </DialogHeader>

        <div className="quire-scroll max-h-[60vh] overflow-y-auto pr-1 text-[15.5px] leading-[1.62]">
          <p className="mb-3">
            The dark point at the centre is not a script. It stands for the act of
            invention itself. The scripts on the innermost ring — cuneiform,
            Egyptian hieroglyphs, the Shang oracle bones, the Mesoamerican
            systems, and the handful of later inventions such as Cherokee and
            Hangul — have no parent in this tree, because they had none in
            history. Everything on the rings beyond them was learned from
            something already written.
          </p>
          <p className="mb-3">
            <span className="text-[var(--rubric)]">Hovering</span> a node
            illuminates its full line of descent back to the centre in vermilion,
            the way a reader traces a genealogy with a finger. Clicking commits:
            the leaf on the right carries the specimen, the dates, and the
            history. Every node in the leaf is clickable, so you can walk a
            lineage entry by entry.
          </p>
          <div className="specimen mb-4 px-4 py-3">
            <div className="caption mb-2">Reading the marks</div>
            <dl className="grid gap-1.5 text-[14px]">
              {[
                ["Solid line", "Descent is attested — the transitional forms survive."],
                ["Long dashes", "Descent is probable and generally accepted, but the intermediate stages are missing."],
                ["Short dashes", "Descent is disputed among specialists."],
                ["Dotted line", "Stimulus diffusion: the inventor knew that writing existed, but not how any existing script worked."],
                ["Bowed dotted chord", "Secondary influence, cutting across the tree."],
                ["Filled node", "The script is in everyday use today."],
                ["Hollow node", "The script is liturgical, restricted, or extinct."],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[9.5rem_1fr] gap-x-4">
                  <dt className="caption-tight pt-[2px] text-[10.5px] uppercase tracking-[0.09em]">
                    {k}
                  </dt>
                  <dd className="text-[14px] leading-snug text-[var(--ink-mid)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mb-3">
            The one thing a chart like this cannot show honestly is certainty.
            Brahmi's descent from Aramaic is probable, not proven, and has been
            argued about since 1856. Hangul's debt to the ʼPhags-pa script is
            real but partial. The line styles are there so that the argument
            stays visible rather than being flattened into a clean diagram.
          </p>
          <p className="mb-3 text-[14px] text-[var(--ink-faint)]">
            Keyboard: <span style={{ fontFamily: "var(--font-mono)" }}>/</span> to
            search, <span style={{ fontFamily: "var(--font-mono)" }}>?</span> for
            this note, <span style={{ fontFamily: "var(--font-mono)" }}>Esc</span>{" "}
            to close the leaf. Drag to pan, scroll to zoom.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border pt-3">
          <a
            href="https://lukesteuber.com"
            target="_blank"
            rel="noopener noreferrer"
            className="caption inline-flex items-center gap-1 hover:text-[var(--rubric)]">
            lukesteuber.com <ArrowUpRight size={11} />
          </a>
          <a
            href="https://dr.eamer.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="caption inline-flex items-center gap-1 hover:text-[var(--rubric)]">
            dr.eamer.dev <ArrowUpRight size={11} />
          </a>
          <span className="caption ml-auto text-[10px]">
            Sources per entry · Wikipedia and cited scholarship
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
