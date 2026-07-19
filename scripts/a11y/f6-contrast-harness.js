/**
 * Browser-side harness for F6 glass/atmosphere contrast sampling.
 * Injected via CDP Runtime.evaluate — not imported by the app.
 */
(function installMyceliaF6ContrastHarness() {
  function srgbChannelToLinear(channel8) {
    const c = Math.min(255, Math.max(0, channel8)) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }

  function relativeLuminance({ r, g, b }) {
    const R = srgbChannelToLinear(r);
    const G = srgbChannelToLinear(g);
    const B = srgbChannelToLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  function contrastRatio(a, b) {
    const l1 = relativeLuminance(a);
    const l2 = relativeLuminance(b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function parseCssRgbColor(input) {
    const value = String(input || "").trim();
    if (!value || value === "transparent") return null;
    let m =
      /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(
        value,
      );
    if (m) {
      const a = m[4] === undefined ? 1 : Number(m[4]);
      if (!(a > 0)) return null;
      return {
        r: Math.round(Number(m[1])),
        g: Math.round(Number(m[2])),
        b: Math.round(Number(m[3])),
        a,
      };
    }
    m =
      /^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i.exec(
        value,
      );
    if (m) {
      let a = 1;
      if (m[4] !== undefined) {
        a = m[4].endsWith("%")
          ? Number(m[4].slice(0, -1)) / 100
          : Number(m[4]);
      }
      if (!(a > 0)) return null;
      return {
        r: Math.round(Number(m[1])),
        g: Math.round(Number(m[2])),
        b: Math.round(Number(m[3])),
        a,
      };
    }
    return null;
  }

  /** Resolve any CSS color (including oklab()) to sRGBA via canvas. */
  function cssColorToSrgba(cssColor) {
    const direct = parseCssRgbColor(cssColor);
    if (direct) return direct;
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = cssColor;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    const a = data[3] / 255;
    if (!(a > 0)) return null;
    // Un-premultiply if the browser stored premultiplied values.
    const inv = a < 1 ? 1 / a : 1;
    return {
      r: Math.min(255, Math.round(data[0] * inv)),
      g: Math.min(255, Math.round(data[1] * inv)),
      b: Math.min(255, Math.round(data[2] * inv)),
      a,
    };
  }

  function flattenSrgbaOver(fg, bg) {
    const a = Math.min(1, Math.max(0, fg.a));
    return {
      r: Math.round(fg.r * a + bg.r * (1 - a)),
      g: Math.round(fg.g * a + bg.g * (1 - a)),
      b: Math.round(fg.b * a + bg.b * (1 - a)),
    };
  }

  function isLargeText(fontSizePx, fontWeight) {
    const weight = Number.parseInt(fontWeight, 10);
    const bold =
      fontWeight === "bold" ||
      fontWeight === "bolder" ||
      (!Number.isNaN(weight) && weight >= 700);
    if (bold) return fontSizePx >= 18.66;
    return fontSizePx >= 24;
  }

  function evaluateAa(ratio, largeText) {
    const required = largeText ? 3 : 4.5;
    return {
      ratio: Number(ratio.toFixed(3)),
      largeText,
      passesAa: ratio + 1e-9 >= required,
      required,
      margin: Number((ratio - required).toFixed(3)),
    };
  }

  async function samplePngAverage(pngBase64, cssRect, dpr) {
    const blob = await fetch(`data:image/png;base64,${pngBase64}`).then((r) =>
      r.blob(),
    );
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(bitmap, 0, 0);

    const x0 = Math.max(0, Math.floor(cssRect.left * dpr));
    const y0 = Math.max(0, Math.floor(cssRect.top * dpr));
    const x1 = Math.min(bitmap.width - 1, Math.floor(cssRect.right * dpr));
    const y1 = Math.min(bitmap.height - 1, Math.floor(cssRect.bottom * dpr));
    const points = [
      [(x0 + x1) / 2, (y0 + y1) / 2],
      [x0 + (x1 - x0) * 0.25, y0 + (y1 - y0) * 0.35],
      [x0 + (x1 - x0) * 0.75, y0 + (y1 - y0) * 0.35],
      [x0 + (x1 - x0) * 0.35, y0 + (y1 - y0) * 0.7],
      [x0 + (x1 - x0) * 0.65, y0 + (y1 - y0) * 0.7],
    ];

    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (const [px, py] of points) {
      const x = Math.round(px);
      const y = Math.round(py);
      if (x < 0 || y < 0 || x >= bitmap.width || y >= bitmap.height) continue;
      const data = ctx.getImageData(x, y, 1, 1).data;
      r += data[0];
      g += data[1];
      b += data[2];
      n += 1;
    }
    bitmap.close();
    if (!n) return null;
    return {
      r: Math.round(r / n),
      g: Math.round(g / n),
      b: Math.round(b / n),
    };
  }

  window.__myceliaF6 = {
    contrastRatio,
    parseCssRgbColor,
    cssColorToSrgba,
    flattenSrgbaOver,
    isLargeText,
    evaluateAa,
    samplePngAverage,
    describeTarget(el) {
      if (!(el instanceof HTMLElement)) return null;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const fg = cssColorToSrgba(style.color);
      const fontSizePx = Number.parseFloat(style.fontSize);
      return {
        tag: el.tagName,
        text: (el.textContent || "").trim().slice(0, 48),
        color: style.color,
        fg,
        fontSizePx,
        fontWeight: style.fontWeight,
        largeText: isLargeText(fontSizePx, style.fontWeight),
        rect: {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        },
        dpr: window.devicePixelRatio || 1,
      };
    },
    hide(el) {
      if (!(el instanceof HTMLElement)) return;
      el.dataset.f6PrevVisibility = el.style.visibility;
      el.style.visibility = "hidden";
    },
    show(el) {
      if (!(el instanceof HTMLElement)) return;
      el.style.visibility = el.dataset.f6PrevVisibility || "";
      delete el.dataset.f6PrevVisibility;
    },
    resolveTargets(pane) {
      if (pane === "hero") {
        const heroes = [...document.querySelectorAll("[data-lg-hero]")];
        const h1 =
          document.querySelector("h1[data-lg-hero]") ||
          heroes.find((el) => el.tagName === "H1") ||
          null;
        const subtitle = heroes.find(
          (el) => el.tagName === "P" && /LLC/i.test(el.textContent || ""),
        );
        const body = heroes.find(
          (el) => el.tagName === "P" && (el.textContent || "").length > 40,
        );
        return {
          heroTitle: h1,
          heroLlc: subtitle || null,
          heroBody: body || null,
        };
      }
      if (pane === "about") {
        return {
          aboutKicker: document.querySelector(".liquid-glass-kicker, [data-lg-kicker]"),
          aboutTitle: document.querySelector(".liquid-glass-title"),
          aboutBody: document.querySelector(".liquid-glass-body"),
        };
      }
      return {};
    },
  };

  return "f6-harness-ready";
})();
