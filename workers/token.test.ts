import { describe, expect, it } from "vitest";
import {
  escapeHtml,
  formatExpiryDate,
  generateSecureToken,
} from "@/workers/token";

describe("generateSecureToken", () => {
  it("returns a 64-character hex string", () => {
    expect(generateSecureToken()).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generates unique values", () => {
    const a = generateSecureToken();
    const b = generateSecureToken();
    expect(a).not.toBe(b);
  });
});

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`Tom & "Jerry" <script>`)).toBe(
      "Tom &amp; &quot;Jerry&quot; &lt;script&gt;",
    );
  });
});

describe("formatExpiryDate", () => {
  it("formats UTC dates consistently", () => {
    expect(formatExpiryDate(Date.UTC(2026, 5, 18))).toBe(
      "Thursday, June 18, 2026",
    );
  });
});
