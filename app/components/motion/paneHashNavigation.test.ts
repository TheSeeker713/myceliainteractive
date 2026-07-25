import { describe, expect, it } from "vitest";
import {
  isSamePathStageNavHref,
  paneIndexFromHash,
} from "./paneHashNavigation";

describe("paneIndexFromHash", () => {
  const ids = [undefined, undefined, "projects", undefined] as const;

  it("maps empty hash to hero index 0", () => {
    expect(paneIndexFromHash("", ids)).toBe(0);
    expect(paneIndexFromHash("#", ids)).toBe(0);
  });

  it("maps a known pane id to its index", () => {
    expect(paneIndexFromHash("#projects", ids)).toBe(2);
    expect(paneIndexFromHash("projects", ids)).toBe(2);
  });

  it("ignores unknown hashes", () => {
    expect(paneIndexFromHash("#nope", ids)).toBeNull();
  });
});

describe("isSamePathStageNavHref", () => {
  const origin = "https://www.myceliainteractive.com";

  it("accepts same-path hash and home links", () => {
    expect(isSamePathStageNavHref("/#projects", origin, "/")).toEqual({
      hash: "#projects",
    });
    expect(isSamePathStageNavHref("/", origin, "/")).toEqual({ hash: "" });
    expect(
      isSamePathStageNavHref(
        "https://www.myceliainteractive.com/#projects",
        origin,
        "/",
      ),
    ).toEqual({ hash: "#projects" });
  });

  it("rejects cross-path and external links", () => {
    expect(isSamePathStageNavHref("/ls", origin, "/")).toBeNull();
    expect(isSamePathStageNavHref("/#projects", origin, "/ls")).toBeNull();
    expect(
      isSamePathStageNavHref("https://www.thes33k3r.com", origin, "/"),
    ).toBeNull();
  });
});
