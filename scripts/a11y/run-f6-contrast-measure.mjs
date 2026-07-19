/**
 * F6 runtime contrast sampler.
 * Uses local Playwright + Chromium in .playwright-browsers when available.
 *
 * Usage: node scripts/a11y/run-f6-contrast-measure.mjs [baseUrl]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

process.env.PLAYWRIGHT_BROWSERS_PATH = join(root, ".playwright-browsers");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright not available.");
  process.exit(1);
}

const baseUrl = process.argv[2] || "http://localhost:3000";
const viewportArg = process.argv[3] || "1280x800";
const [vpW, vpH] = viewportArg.split("x").map((n) => Number(n));
const harness = readFileSync(join(__dirname, "f6-contrast-harness.js"), "utf8");
const FRAME_DELAYS_MS = [0, 700, 1400, 2100, 2800];
const TARGET_KEYS = {
  hero: ["heroTitle", "heroLlc", "heroBody"],
  about: ["aboutKicker", "aboutTitle", "aboutBody"],
};

const chromePath = join(
  root,
  ".playwright-browsers/chromium-1228/chrome-win64/chrome.exe",
);

async function measureTarget(page, key, handle) {
  const meta = await page.evaluate(
    (el) => window.__myceliaF6.describeTarget(el),
    handle,
  );
  if (!meta?.fg || !meta.rect?.width) {
    return { key, error: "missing-target-or-color", meta };
  }

  await page.evaluate((el) => window.__myceliaF6.hide(el), handle);
  await page.waitForTimeout(50);
  const png = await page.screenshot({ type: "png", fullPage: false });
  const bg = await page.evaluate(
    async ({ b64, rect, dpr }) =>
      window.__myceliaF6.samplePngAverage(b64, rect, dpr),
    { b64: png.toString("base64"), rect: meta.rect, dpr: meta.dpr },
  );
  await page.evaluate((el) => window.__myceliaF6.show(el), handle);

  if (!bg) return { key, error: "bg-sample-failed", meta };

  const flat = await page.evaluate(
    ({ fg, bg: background }) =>
      window.__myceliaF6.flattenSrgbaOver(fg, background),
    { fg: meta.fg, bg },
  );
  const ratio = await page.evaluate(
    ({ a, b }) => window.__myceliaF6.contrastRatio(a, b),
    { a: flat, b: bg },
  );
  const verdict = await page.evaluate(
    ({ ratio: r, largeText }) => window.__myceliaF6.evaluateAa(r, largeText),
    { ratio, largeText: meta.largeText },
  );

  return {
    key,
    text: meta.text,
    cssColor: meta.color,
    fg: meta.fg,
    bg,
    flattenedFg: flat,
    fontSizePx: Number(meta.fontSizePx.toFixed(2)),
    fontWeight: meta.fontWeight,
    ...verdict,
  };
}

async function measurePane(page, pane) {
  const present = await page.evaluate((paneName) => {
    const map = window.__myceliaF6.resolveTargets(paneName);
    return Object.fromEntries(
      Object.entries(map).map(([k, el]) => [k, Boolean(el)]),
    );
  }, pane);

  const results = [];
  for (const key of TARGET_KEYS[pane]) {
    if (!present[key]) {
      results.push({ key, error: "not-found" });
      continue;
    }
    const handle = await page.evaluateHandle(
      ({ paneName, targetKey }) =>
        window.__myceliaF6.resolveTargets(paneName)[targetKey],
      { paneName: pane, targetKey: key },
    );
    const element = handle.asElement();
    if (!element) {
      results.push({ key, error: "handle-failed" });
      await handle.dispose();
      continue;
    }
    results.push(await measureTarget(page, key, element));
    await handle.dispose();
  }
  return results;
}

async function pressPaneKey(page, key) {
  await page.evaluate((k) => {
    document.getElementById("main-content")?.focus();
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: k,
        bubbles: true,
        cancelable: true,
      }),
    );
  }, key);
  await page.waitForTimeout(1650);
}

async function prepareMode(page, mode) {
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  if (mode === "high-contrast") {
    await page.evaluate(() => {
      localStorage.setItem("mycelia:high-contrast", "1");
      localStorage.removeItem("mycelia:reduce-motion");
      localStorage.removeItem("mycelia:pause-atmosphere");
    });
  } else {
    await page.evaluate(() => {
      localStorage.removeItem("mycelia:high-contrast");
      localStorage.removeItem("mycelia:reduce-motion");
      localStorage.removeItem("mycelia:pause-atmosphere");
    });
  }
  // Reload so useAccessibilityUiPrefs hydrates from storage.
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.evaluate(harness);
  await page.evaluate((wantHigh) => {
    document.documentElement.dataset.contrast = wantHigh ? "high" : "normal";
    document.documentElement.dataset.pauseAtmosphere = "0";
  }, mode === "high-contrast");
  await page.waitForTimeout(200);
}

async function runMode(page, mode) {
  await prepareMode(page, mode);
  const byFrame = [];

  // One continuous page session so the WebGL atmosphere keeps evolving.
  const t0 = Date.now();
  for (const delay of FRAME_DELAYS_MS) {
    const waitMore = delay - (Date.now() - t0);
    if (waitMore > 0) await page.waitForTimeout(waitMore);

    const contrastAttr = await page.evaluate(
      () => document.documentElement.dataset.contrast || "normal",
    );
    const heading = await page.evaluate(
      () => document.querySelector("h1,h2")?.textContent?.trim() || "",
    );
    // Ensure we're on hero before hero samples.
    if (!/Mycelia Interactive/i.test(heading)) {
      await pressPaneKey(page, "ArrowUp");
      // Keep pressing up until hero or cap.
      for (let i = 0; i < 6; i++) {
        const h = await page.evaluate(
          () => document.querySelector("h1,h2")?.textContent?.trim() || "",
        );
        if (/Mycelia Interactive/i.test(h)) break;
        await pressPaneKey(page, "ArrowUp");
      }
    }

    const hero = await measurePane(page, "hero");
    await pressPaneKey(page, "ArrowDown");
    const about = await measurePane(page, "about");
    await pressPaneKey(page, "ArrowUp");

    byFrame.push({
      delayMs: delay,
      elapsedMs: Date.now() - t0,
      contrastAttr,
      hero,
      about,
    });
  }

  return byFrame;
}

function summarize(frames) {
  const rows = [];
  for (const frame of frames) {
    for (const pane of ["hero", "about"]) {
      for (const sample of frame[pane]) {
        if (sample.error) {
          rows.push({
            pane,
            key: sample.key,
            delayMs: frame.delayMs,
            error: sample.error,
          });
          continue;
        }
        rows.push({
          pane,
          key: sample.key,
          delayMs: frame.delayMs,
          text: sample.text,
          ratio: sample.ratio,
          required: sample.required,
          passesAa: sample.passesAa,
          margin: sample.margin,
          largeText: sample.largeText,
          fg: sample.fg,
          bg: sample.bg,
          flattenedFg: sample.flattenedFg,
          cssColor: sample.cssColor,
          fontSizePx: sample.fontSizePx,
        });
      }
    }
  }

  const byKey = {};
  for (const row of rows) {
    if (row.error) continue;
    const id = `${row.pane}.${row.key}`;
    (byKey[id] ||= []).push(row);
  }

  const aggregates = Object.fromEntries(
    Object.entries(byKey).map(([id, list]) => {
      const ratios = list.map((r) => r.ratio);
      const min = Math.min(...ratios);
      const max = Math.max(...ratios);
      const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
      const worst = list.reduce((a, b) => (a.ratio <= b.ratio ? a : b));
      return [
        id,
        {
          samples: list.length,
          minRatio: Number(min.toFixed(3)),
          maxRatio: Number(max.toFixed(3)),
          avgRatio: Number(avg.toFixed(3)),
          allPassAa: list.every((r) => r.passesAa),
          worstPass: worst.passesAa,
          worstMargin: worst.margin,
          required: worst.required,
          largeText: worst.largeText,
          worstDelayMs: worst.delayMs,
          worstBg: worst.bg,
          worstFg: worst.flattenedFg,
          cssColor: worst.cssColor,
          fontSizePx: worst.fontSizePx,
        },
      ];
    }),
  );

  return { rows, aggregates };
}

if (!existsSync(chromePath)) {
  console.error("Chromium not found at", chromePath);
  process.exit(1);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: chromePath,
});
const page = await browser.newPage({
  viewport: { width: vpW || 1280, height: vpH || 800 },
  deviceScaleFactor: 1,
});

try {
  const normalFrames = await runMode(page, "normal");
  const highFrames = await runMode(page, "high-contrast");

  const report = {
    measuredAt: new Date().toISOString(),
    baseUrl,
    viewport: {
      width: vpW || 1280,
      height: vpH || 800,
      deviceScaleFactor: 1,
    },
    method:
      "Hide text → PNG screenshot → average 5 pixels under glyph box → flatten CSS fg (with alpha) over sampled bg → WCAG 2 contrast ratio",
    frameDelaysMs: FRAME_DELAYS_MS,
    thresholds: { normalText: 4.5, largeText: 3.0 },
    normal: summarize(normalFrames),
    highContrast: summarize(highFrames),
    raw: { normalFrames, highFrames },
  };

  mkdirSync(__dirname, { recursive: true });
  const suffix = `${report.viewport.width}x${report.viewport.height}`;
  const outPath = join(__dirname, `f6-contrast-results-${suffix}.json`);
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  // Also write/overwrite the canonical desktop results path when measuring 1280x800.
  if (suffix === "1280x800") {
    writeFileSync(
      join(__dirname, "f6-contrast-results.json"),
      JSON.stringify(report, null, 2),
    );
  }
  console.log(`Wrote ${outPath}`);
  console.log(
    JSON.stringify(
      {
        viewport: report.viewport,
        normal: report.normal.aggregates,
        highContrast: report.highContrast.aggregates,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
