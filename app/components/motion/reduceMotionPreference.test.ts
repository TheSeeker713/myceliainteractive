import { describe, expect, it } from "vitest";
import {
  LEGACY_PREVIEW_REDUCE_MOTION_KEY,
  MYCELIA_REDUCE_MOTION_KEY,
  readMyceliaReduceMotion,
  writeMyceliaReduceMotion,
} from "./reduceMotionPreference";

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
  };
}

describe("reduceMotionPreference", () => {
  it("defaults to full motion", () => {
    expect(readMyceliaReduceMotion(memoryStorage())).toBe(false);
  });

  it("reads the production key", () => {
    expect(
      readMyceliaReduceMotion(
        memoryStorage({ [MYCELIA_REDUCE_MOTION_KEY]: "1" }),
      ),
    ).toBe(true);
  });

  it("honors the legacy preview key", () => {
    expect(
      readMyceliaReduceMotion(
        memoryStorage({ [LEGACY_PREVIEW_REDUCE_MOTION_KEY]: "1" }),
      ),
    ).toBe(true);
  });

  it("writes both keys on opt-in and clears both on opt-out", () => {
    const storage = memoryStorage();
    writeMyceliaReduceMotion(storage, true);
    expect(storage.getItem(MYCELIA_REDUCE_MOTION_KEY)).toBe("1");
    expect(storage.getItem(LEGACY_PREVIEW_REDUCE_MOTION_KEY)).toBe("1");
    writeMyceliaReduceMotion(storage, false);
    expect(storage.getItem(MYCELIA_REDUCE_MOTION_KEY)).toBeNull();
    expect(storage.getItem(LEGACY_PREVIEW_REDUCE_MOTION_KEY)).toBeNull();
  });
});
