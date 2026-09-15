import tangutFontUrl from "@/assets/fonts/tangut.woff2?url";
import oldUyghurFontUrl from "@/assets/fonts/olduyghur.woff2?url";

/**
 * Render Plate II into a single downloadable PDF broadside.
 *
 * The export stays entirely in the browser. html2canvas rasterises the already
 * loaded webfonts, which is important here: a traditional PDF text layer would
 * need to embed well over one hundred specialist fonts and would lose many
 * historic-script specimens. The result is a single, high-resolution specimen
 * plate that preserves exactly what the reader sees.
 */
export async function downloadPosterPdf(element: HTMLElement) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  /**
   * html2canvas 1.4 predates OKLCH and parses every rule in a cloned live
   * stylesheet, even rules irrelevant to the sheet. Instead of cloning the app,
   * we build a purpose-made RGB broadside in an off-screen same-origin iframe.
   * That is also better editorially: it captures the 148 specimens cleanly,
   * without controls, navigation, or a partly scrolled detail leaf.
   */
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;left:-20000px;top:0;width:1500px;height:100px;border:0;visibility:hidden;";
  document.body.appendChild(frame);

  try {
    const doc = frame.contentDocument;
    if (!doc) throw new Error("The browser could not create the poster document.");
    doc.open();
    doc.write("<!doctype html><html><head><meta charset=\"utf-8\"></head><body></body></html>");
    doc.close();

    // Carry the atlas's loaded webfont families (Google Fonts) into the isolated
    // broadside. Only font stylesheets: the production build also links the app's
    // own CSS, whose OKLCH tokens html2canvas cannot parse. In `vite dev` that
    // sheet is an inline <style>, which is why this only ever failed in production.
    for (const original of Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))) {
      if (!original.href || !/fonts\.googleapis\.com/.test(original.href)) continue;
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = original.href;
      doc.head.appendChild(link);
    }

    const style = doc.createElement("style");
    style.textContent = `
      @font-face { font-family:"Noto Serif Tangut"; src:url("${tangutFontUrl}") format("woff2"); }
      @font-face { font-family:"Noto Serif Old Uyghur"; src:url("${oldUyghurFontUrl}") format("woff2"); }
      * { box-sizing:border-box; }
      html, body { margin:0; width:1500px; background:#f4ede2; color:#493a31; }
      body { padding:54px; font-family:"EB Garamond", Georgia, serif; }
      .head { border-bottom:2px solid #493a31; padding-bottom:24px; margin-bottom:26px; }
      .kicker, .group-head, .meta, .footer { font-family:"JetBrains Mono", monospace; letter-spacing:.14em; text-transform:uppercase; }
      .kicker { font-size:13px; color:#a23c31; }
      h1 { margin:8px 0 9px; font-family:"Cormorant Garamond", Georgia, serif; font-size:57px; line-height:.94; font-weight:600; }
      .sub { max-width:880px; color:#705a49; font-size:22px; line-height:1.36; }
      section { margin-top:30px; break-inside:avoid; }
      .group-head { display:flex; align-items:center; gap:10px; padding-bottom:9px; border-bottom:1px solid #cbb99a; font-size:14px; }
      .dot { width:10px; height:10px; border-radius:50%; flex:none; }
      .rule { flex:1; height:1px; background:#cbb99a; }
      .count { color:#9b8972; }
      .grid { display:grid; grid-template-columns:repeat(6, 1fr); border-left:1px solid #cbb99a; border-top:1px solid #cbb99a; }
      .cell { min-height:164px; display:flex; flex-direction:column; justify-content:space-between; gap:14px; padding:16px; border-right:1px solid #cbb99a; border-bottom:1px solid #cbb99a; }
      .glyph { flex:1; display:flex; align-items:center; overflow:hidden; font-size:32px; line-height:1.28; color:#493a31; word-break:break-word; }
      .name { font-family:"Cormorant Garamond", Georgia, serif; font-size:20px; line-height:1.06; }
      .meta { margin-top:5px; color:#9b8972; font-size:10px; line-height:1.25; }
      .footer { margin-top:36px; padding-top:14px; border-top:2px solid #493a31; color:#705a49; font-size:11px; }
    `;
    doc.head.appendChild(style);

    const sourceSections = Array.from(element.querySelectorAll<HTMLElement>("section")).filter((section) =>
      Boolean(section.querySelector("ul.border-l > li > button")),
    );
    const broadside = doc.createElement("article");
    const head = doc.createElement("header");
    head.className = "head";
    head.innerHTML = `<div class="kicker">The Tree of Writing · Plate II · specimen sheet</div><h1>Every script,<br><span style="color:#a23c31">writing its own name</span></h1><div class="sub">148 documented specimens, arranged by descent. Every example is an autonym where one survives; otherwise an attested word or canonical letter run is marked as such.</div>`;
    broadside.appendChild(head);

    for (const source of sourceSections) {
      const title = source.querySelector("h2")?.textContent?.trim() ?? "Writing systems";
      const count = source.querySelector(".caption")?.textContent?.trim() ?? "";
      const dot = source.querySelector<HTMLElement>(".rounded-full");
      const marker = dot ? getComputedStyle(dot).backgroundColor : "#a23c31";
      const section = doc.createElement("section");
      section.innerHTML = `<div class="group-head"><span class="dot" style="background:${marker}"></span><span>${title}</span><span class="rule"></span><span class="count">${count}</span></div>`;
      const grid = doc.createElement("div");
      grid.className = "grid";

      for (const button of Array.from(source.querySelectorAll<HTMLButtonElement>("ul.border-l > li > button"))) {
        const parts = Array.from(button.children) as HTMLElement[];
        const glyphPart = parts[1];
        const apparatus = parts[2];
        if (!glyphPart || !apparatus) continue;
        const specimen = glyphPart.textContent?.trim() ?? "";
        const name = apparatus.querySelector("span")?.textContent?.trim() ?? "";
        const meta = apparatus.querySelector(".caption-tight")?.textContent?.trim() ?? "";
        const font = getComputedStyle(glyphPart).fontFamily;
        const cell = doc.createElement("div");
        cell.className = "cell";
        const glyph = doc.createElement("div");
        glyph.className = "glyph";
        glyph.textContent = specimen;
        glyph.style.fontFamily = font;
        const caption = doc.createElement("div");
        caption.innerHTML = `<div class="name"></div><div class="meta"></div>`;
        (caption.querySelector(".name") as HTMLElement).textContent = name;
        (caption.querySelector(".meta") as HTMLElement).textContent = meta;
        cell.append(glyph, caption);
        grid.appendChild(cell);
      }
      section.appendChild(grid);
      broadside.appendChild(section);
    }

    const footer = doc.createElement("footer");
    footer.className = "footer";
    footer.textContent = "The Tree of Writing · 148 specimens · generated from the interactive atlas";
    broadside.appendChild(footer);
    doc.body.appendChild(broadside);

    await doc.fonts?.ready;
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    const rect = broadside.getBoundingClientRect();
    frame.style.height = `${Math.ceil(rect.height + 20)}px`;
    const pixels = Math.max(1, rect.width * rect.height);
    const scale = Math.min(1.2, Math.max(0.55, Math.sqrt(18_000_000 / pixels)));
    const canvas = await html2canvas(broadside, {
      backgroundColor: "#f4ede2",
      scale,
      useCORS: true,
      logging: false,
      windowWidth: 1500,
    });

    // PDF implementations cap a page at 200 inches (5,080 mm). Fit the full
    // sheet inside that ceiling and call it a broadside rather than silently
    // cropping it or breaking its continuous ruled rhythm into arbitrary pages.
    const ratio = canvas.height / canvas.width;
    const pageWidth = Math.min(500, 4_800 / ratio);
    const pageHeight = pageWidth * ratio;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pageWidth, pageHeight],
      compress: true,
    });
    pdf.setProperties({
      title: "The Tree of Writing — Plate II: Specimen Sheet",
      subject: "148 documented writing-system specimens",
      author: "The Tree of Writing",
    });
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
    pdf.save("tree-of-writing-plate-ii-specimens.pdf");
  } finally {
    frame.remove();
  }
}
