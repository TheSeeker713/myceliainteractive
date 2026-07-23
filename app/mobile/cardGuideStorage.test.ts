import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  MOBILE_CARD_GUIDE_STORAGE_KEY,
  hasSeenMobileCardGuide,
  markMobileCardGuideSeen,
} from "./cardGuideStorage";

describe("cardGuideStorage", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    });
  });

  it("defaults to unseen and marks seen", () => {
    expect(hasSeenMobileCardGuide()).toBe(false);
    markMobileCardGuideSeen();
    expect(store.get(MOBILE_CARD_GUIDE_STORAGE_KEY)).toBe("1");
    expect(hasSeenMobileCardGuide()).toBe(true);
  });

  it("returns false when sessionStorage throws", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    });
    expect(hasSeenMobileCardGuide()).toBe(false);
    expect(() => markMobileCardGuideSeen()).not.toThrow();
  });
});
