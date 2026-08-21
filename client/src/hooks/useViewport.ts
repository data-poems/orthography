/**
 * Viewport class for the plate. Mobile is not a narrowed desktop: the margin
 * becomes a sheet, the leaf becomes a sheet, and the plate keeps the whole page.
 */
import { useEffect, useState } from "react";

export type Viewport = "phone" | "tablet" | "desktop";

function classify(w: number): Viewport {
  if (w < 700) return "phone";
  if (w < 1100) return "tablet";
  return "desktop";
}

export function useViewport(): Viewport {
  const [v, setV] = useState<Viewport>(() =>
    typeof window === "undefined" ? "desktop" : classify(window.innerWidth),
  );
  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setV(classify(window.innerWidth)));
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return v;
}

/** True when the primary input is coarse — used to size hit targets. */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
    const on = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return coarse;
}
