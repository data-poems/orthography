/**
 * Acceptance test for Plate IV’s interaction contract. A route is a source-aware
 * annotation, and a dense origin cluster must expand through map zoom rather
 * than behave like a dead aggregate marker.
 */
import { chromium } from "playwright-core";

// ATLAS_URL is the origin plus base path the app is served from, without a
// trailing slash (dev: http://localhost:3000; preview: http://127.0.0.1:4173/writing).
const ATLAS_URL = (process.env.ATLAS_URL ?? "http://localhost:3000").replace(/\/$/, "");
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-gpu"],
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const messages = [];
  page.on("pageerror", (error) => messages.push(error.message));
  await page.goto(`${ATLAS_URL}/origins`, { waitUntil: "networkidle" });

  const route = page.getByRole("button", { name: /Mediterranean alphabet corridor/i });
  await route.waitFor();
  await route.evaluate((element) =>
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
  );
  await page.getByText("Mediterranean alphabet corridor", { exact: true }).last().waitFor();

  const proposal = page.getByRole("button", { name: /Aramaic–Brahmi proposal/i });
  await proposal.evaluate((element) =>
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
  );
  await page.getByText("Aramaic–Brahmi proposal", { exact: true }).last().waitFor();
  await page.getByRole("button", { name: "Proposed" }).click();
  await page.waitForTimeout(80);
  if (await proposal.count()) throw new Error("The proposed route remained visible after filtering.");
  if (await page.getByText("Aramaic–Brahmi proposal", { exact: true }).count()) {
    throw new Error("The filtered route annotation remained open.");
  }

  const cluster = page.getByRole("button", { name: /historical script origins.*separate/i }).first();
  await cluster.waitFor();
  const mapLayer = page.locator("svg > g").last();
  const before = await mapLayer.getAttribute("transform");
  await cluster.click({ force: true });
  await page.waitForTimeout(650);
  const after = await mapLayer.getAttribute("transform");

  if (!after || after === before) throw new Error("Cluster activation did not change the map transform.");
  if (messages.length) throw new Error(messages.join("\n"));
  console.log("PASS: route filtering clears an ineligible annotation and a dense cluster expands through zoom.");
} finally {
  await browser.close();
}
