import { describe, expect, it } from "vitest";
import {
  MOBILE_VIEWPORT_MEDIA_QUERY,
  matchesMobileViewport,
} from "./mobileViewport";

describe("mobileViewport", () => {
  it("uses the approved 767px max-width media query", () => {
    expect(MOBILE_VIEWPORT_MEDIA_QUERY).toBe("(max-width: 767px)");
  });

  it("reports matches from a MediaQueryList-like object", () => {
    expect(matchesMobileViewport({ matches: true })).toBe(true);
    expect(matchesMobileViewport({ matches: false })).toBe(false);
    expect(matchesMobileViewport(null)).toBe(false);
    expect(matchesMobileViewport(undefined)).toBe(false);
  });
});
