/**
 * WCAG 2.x relative luminance and contrast-ratio helpers (sRGB).
 * Used by F6 runtime glass/atmosphere contrast sampling.
 */

export type Srgb = { r: number; g: number; b: number };

export type Srgba = Srgb & { a: number };

/** Channel 0–255 → linear sRGB component. */
export function srgbChannelToLinear(channel8: number): number {
  const c = Math.min(255, Math.max(0, channel8)) / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance (0–1) per WCAG 2.x. */
export function relativeLuminance({ r, g, b }: Srgb): number {
  const R = srgbChannelToLinear(r);
  const G = srgbChannelToLinear(g);
  const B = srgbChannelToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Contrast ratio (≥1) between two sRGB colors. */
export function contrastRatio(a: Srgb, b: Srgb): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function parseCssRgbColor(input: string): Srgba | null {
  const value = input.trim();
  if (value === "transparent") return null;

  const rgb =
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(
      value,
    );
  if (rgb) {
    const alpha = rgb[4] === undefined ? 1 : Number(rgb[4]);
    if (!(alpha > 0)) return null;
    return {
      r: Math.round(Number(rgb[1])),
      g: Math.round(Number(rgb[2])),
      b: Math.round(Number(rgb[3])),
      a: alpha,
    };
  }

  // Modern CSS Color 4: rgb(R G B / A) or rgb(R G B)
  const modern =
    /^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i.exec(
      value,
    );
  if (modern) {
    let alpha = 1;
    if (modern[4] !== undefined) {
      alpha = modern[4].endsWith("%")
        ? Number(modern[4].slice(0, -1)) / 100
        : Number(modern[4]);
    }
    if (!(alpha > 0)) return null;
    return {
      r: Math.round(Number(modern[1])),
      g: Math.round(Number(modern[2])),
      b: Math.round(Number(modern[3])),
      a: alpha,
    };
  }

  return null;
}

/** Composite translucent foreground over an opaque background sample. */
export function flattenSrgbaOver(fg: Srgba, bg: Srgb): Srgb {
  const a = Math.min(1, Math.max(0, fg.a));
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
  };
}

/**
 * WCAG large text: ≥18pt (~24px) normal, or ≥14pt (~18.66px) bold.
 * `fontSizePx` from computed style; `fontWeight` numeric or keyword.
 */
export function isLargeText(fontSizePx: number, fontWeight: string): boolean {
  const weight = Number.parseInt(fontWeight, 10);
  const bold =
    fontWeight === "bold" ||
    fontWeight === "bolder" ||
    (!Number.isNaN(weight) && weight >= 700);
  if (bold) return fontSizePx >= 18.66;
  return fontSizePx >= 24;
}

export type AaVerdict = {
  ratio: number;
  largeText: boolean;
  passesAa: boolean;
  /** 4.5 for normal, 3 for large */
  required: number;
  margin: number;
};

export function evaluateAa(
  ratio: number,
  largeText: boolean,
): AaVerdict {
  const required = largeText ? 3 : 4.5;
  return {
    ratio,
    largeText,
    passesAa: ratio + 1e-9 >= required,
    required,
    margin: ratio - required,
  };
}
