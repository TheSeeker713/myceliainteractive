/** Derive the Cloud Run HTTP origin from NEXT_PUBLIC_GAME_WS_URL (strips /game path). */
export function deriveGameHttpBase(): string {
  const wsUrl = process.env.NEXT_PUBLIC_GAME_WS_URL ?? "";
  if (!wsUrl) return "";

  return wsUrl
    .replace(/^wss:\/\//, "https://")
    .replace(/^ws:\/\//, "http://")
    .replace(/\/game\/?$/, "");
}
