// Minimal Cloudflare Workers type declarations for this project.
// Covers only the globals used by workers/signup-api.ts.
// If @cloudflare/workers-types is installed in the future, this file can be deleted.

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<{ success: boolean; error?: string }>;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

declare module "cloudflare:email" {
  export class EmailMessage {
    constructor(from: string, to: string, raw: ReadableStream);
  }
}

interface SendEmail {
  send(message: import("cloudflare:email").EmailMessage): Promise<void>;
}

interface ScheduledController {
  scheduledTime: number;
  cron: string;
  noRetry(): void;
}
