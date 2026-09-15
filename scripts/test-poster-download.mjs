/**
 * End-to-end acceptance test for the client-only poster download.
 * Uses the system Chromium binary through playwright-core; keeps the generated
 * PDF under /tmp so it can never become a deployed asset.
 */
import { chromium } from "playwright-core";
import { statSync, readFileSync, unlinkSync } from "node:fs";

const output = "/tmp/tree-of-writing-plate-ii-test.pdf";
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
  page.on("console", (message) => messages.push(`console ${message.type()}: ${message.text()}`));
  page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));
  await page.goto(`${ATLAS_URL}/specimens`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Download poster PDF" }).waitFor();
  const downloadPromise = page.waitForEvent("download", { timeout: 120_000 });
  await page.getByRole("button", { name: "Download poster PDF" }).click();
  let download;
  try {
    download = await downloadPromise;
  } catch (error) {
    throw new Error(`${error.message}\n${messages.join("\n")}`);
  }
  await download.saveAs(output);
  const bytes = statSync(output).size;
  const header = readFileSync(output).subarray(0, 5).toString("ascii");
  if (header !== "%PDF-" || bytes < 50_000) {
    throw new Error(`Invalid PDF: header=${header} bytes=${bytes}`);
  }
  console.log(`PASS: ${download.suggestedFilename()} — ${bytes.toLocaleString()} bytes — ${header}`);
  unlinkSync(output);
} finally {
  await browser.close();
}
