import { afterEach, describe, expect, it } from "vitest";
import { deriveGameHttpBase } from "@/app/ls/game/deriveGameHttpBase";

describe("deriveGameHttpBase", () => {
  const original = process.env.NEXT_PUBLIC_GAME_WS_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_GAME_WS_URL;
    } else {
      process.env.NEXT_PUBLIC_GAME_WS_URL = original;
    }
  });

  it("returns empty string when env is unset", () => {
    delete process.env.NEXT_PUBLIC_GAME_WS_URL;
    expect(deriveGameHttpBase()).toBe("");
  });

  it("converts wss to https and strips /game suffix", () => {
    process.env.NEXT_PUBLIC_GAME_WS_URL =
      "wss://liminal-sin-server.example.run.app/game";
    expect(deriveGameHttpBase()).toBe(
      "https://liminal-sin-server.example.run.app",
    );
  });

  it("converts ws to http", () => {
    process.env.NEXT_PUBLIC_GAME_WS_URL = "ws://localhost:8080/game";
    expect(deriveGameHttpBase()).toBe("http://localhost:8080");
  });
});
