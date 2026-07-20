import { describe, expect, it, vi } from "vitest";
import { callMobileSafe, runMobileSafe } from "./guardMobile";

describe("guardMobile", () => {
  it("runMobileSafe swallows thrown errors", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      runMobileSafe("test", () => {
        throw new Error("boom");
      }),
    ).not.toThrow();
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });

  it("callMobileSafe returns fallback on throw", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(
      callMobileSafe(
        "test",
        () => {
          throw new Error("boom");
        },
        "fallback",
      ),
    ).toBe("fallback");
    err.mockRestore();
  });

  it("callMobileSafe returns action result when safe", () => {
    expect(callMobileSafe("test", () => 42, 0)).toBe(42);
  });
});
