/**
 * Acceptance test for Plate IV’s interaction contract. A route is a source-aware
 * annotation, and a dense origin cluster must expand through map zoom rather
 * than behave like a dead aggregate marker.
 */
import { chromium } from "playwright-core";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-gpu"],
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const messages = [];
  page.on("pageerror", (error) => messages.push(error.message));
  await page.goto("http://localhost:3000/origins", { waitUntil: "networkidle" });

  const route = page.getByRole("button", { name: /Mediterranean alphabet corridor/i });
  await route.waitFor();
  await route.evaluate((element) =>
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
  );
  await page.getByText("Mediterranean alphabet corridor", { exact: true }).last().waitFor();

  const cluster = page.getByRole("button", { name: /historical script origins.*separate/i }).first();
  await cluster.waitFor();
  const mapLayer = page.locator("svg > g").last();
  const before = await mapLayer.getAttribute("transform");
  await cluster.click({ force: true });
  await page.waitForTimeout(650);
  const after = await mapLayer.getAttribute("transform");

  if (!after || after === before) throw new Error("Cluster activation did not change the map transform.");
  if (messages.length) throw new Error(messages.join("\n"));
  console.log("PASS: route annotation opens and a dense cluster expands through zoom.");
} finally {
  await browser.close();
}
