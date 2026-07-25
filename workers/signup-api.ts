import {
  escapeHtml,
  formatExpiryDate,
  generateSecureToken,
} from "./token";

export interface Env {
  liminal_sin_signups: D1Database;
  BREVO_API_KEY: string;
  ADMIN_TOKEN: string;
  ASSETS: Fetcher;
}

interface SignupBody {
  name: string;
  email: string;
  type: "access_request";
}

interface GrantBody {
  email: string;
  expiresInDays?: number;
}

interface RevokeBody {
  token: string;
}

const SITE_ORIGIN = "https://www.myceliainteractive.com";
const DEFAULT_EXPIRES_DAYS = 14;
const MAX_EXPIRES_DAYS = 30;
const RATE_LIMIT_PER_HOUR = 3;

const ACCESS_TOKENS_DDL = `CREATE TABLE IF NOT EXISTS access_tokens (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  used_at INTEGER,
  revoked INTEGER DEFAULT 0
)`;

const RATE_LIMITS_DDL = `CREATE TABLE IF NOT EXISTS signup_rate_limits (
  ip TEXT NOT NULL,
  hour_bucket TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip, hour_bucket)
)`;

async function ensureSignupsSchema(db: D1Database): Promise<void> {
  try {
    await db
      .prepare(
        "ALTER TABLE signups ADD COLUMN status TEXT DEFAULT 'pending'",
      )
      .run();
  } catch {
    // column may already exist
  }
  try {
    await db
      .prepare("ALTER TABLE signups ADD COLUMN access_token TEXT")
      .run();
  } catch {
    // column may already exist
  }
  await db
    .prepare("UPDATE signups SET status = 'pending' WHERE status IS NULL")
    .run();
}

async function ensureRateLimitsTable(db: D1Database): Promise<void> {
  await db.prepare(RATE_LIMITS_DDL).run();
}

async function checkSignupRateLimit(
  db: D1Database,
  ip: string,
): Promise<boolean> {
  await ensureRateLimitsTable(db);
  const hourBucket = new Date().toISOString().slice(0, 13);

  const row = await db
    .prepare(
      "SELECT count FROM signup_rate_limits WHERE ip = ? AND hour_bucket = ?",
    )
    .bind(ip, hourBucket)
    .first<{ count: number }>();

  if (row && row.count >= RATE_LIMIT_PER_HOUR) {
    return false;
  }

  if (row) {
    await db
      .prepare(
        "UPDATE signup_rate_limits SET count = count + 1 WHERE ip = ? AND hour_bucket = ?",
      )
      .bind(ip, hourBucket)
      .run();
  } else {
    await db
      .prepare(
        "INSERT INTO signup_rate_limits (ip, hour_bucket, count) VALUES (?, ?, 1)",
      )
      .bind(ip, hourBucket)
      .run();
  }

  return true;
}

function requireAdmin(request: Request, env: Env): boolean {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  return Boolean(token && token === env.ADMIN_TOKEN);
}

async function sendBrevo(
  apiKey: string,
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Liminal Sin", email: "access@myceliainteractive.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error ${res.status}: ${text}`);
  }
}

const EMAIL1_HTML = (name: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fafaf8;font-family:system-ui,sans-serif;color:#171717;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:12px;">
    <tr><td style="padding:32px 40px;">
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#5c5c5c;margin:0 0 20px;">Liminal Sin — Access Request Received</p>
      <h1 style="font-size:22px;font-weight:600;color:#171717;margin:0 0 16px;">Thank you, ${escapeHtml(name)}</h1>
      <p style="font-size:14px;color:#5c5c5c;line-height:1.7;margin:0 0 24px;">
        Your prototype access request has been received. If approved, you will receive a private play link within 24 hours.
      </p>
      <p style="font-size:12px;color:#5c5c5c;margin:0;">
        Mycelia Interactive LLC · This message was sent because you requested access.
      </p>
    </td></tr>
  </table>
</body>
</html>`;

const EMAIL2_HTML = (
  name: string,
  playUrl: string,
  expiryLabel: string,
) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08041a;font-family:'Courier New',monospace;color:#e9d5ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#0a0514;border:1px solid rgba(139,0,255,0.3);border-radius:12px;overflow:hidden;">
    <tr><td style="padding:32px 40px;">
      <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(192,132,252,0.5);margin:0 0 20px;">Liminal Sin — Access Granted</p>
      <h1 style="font-size:22px;font-weight:900;color:#e9d5ff;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">The Underground Is Open</h1>
      <p style="font-size:14px;color:rgba(196,181,253,0.7);line-height:1.7;margin:0 0 16px;">
        <strong style="color:#e9d5ff;">${escapeHtml(name)}</strong>,<br>
        Your private play link is ready. This link expires on ${escapeHtml(expiryLabel)} (UTC).
      </p>
      <p style="font-size:13px;color:rgba(196,181,253,0.6);line-height:1.6;margin:0 0 24px;">
        Desktop browsers recommended. Mobile play is not supported.
      </p>
      <table cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        <tr><td style="background:linear-gradient(135deg,#6b21a8,#7e22ce);border-radius:6px;padding:0;">
          <a href="${playUrl}" style="display:block;padding:14px 32px;font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#fff;text-decoration:none;">
            Enter the Underground →
          </a>
        </td></tr>
      </table>
      <p style="font-size:12px;color:rgba(196,181,253,0.55);line-height:1.6;margin:0 0 24px;">
        Privacy policy: <a href="${SITE_ORIGIN}/ls/privacy" style="color:#c4b5fd;">${SITE_ORIGIN}/ls/privacy</a>
      </p>
      <div style="border-top:1px solid rgba(139,0,255,0.2);padding-top:20px;margin-top:8px;">
        <p style="font-size:11px;color:rgba(139,92,246,0.7);letter-spacing:0.15em;margin:0;">
          LIMINAL SIN — MYCELIA INTERACTIVE — 2026
        </p>
      </div>
    </td></tr>
  </table>
</body>
</html>`;

async function sendEmail1(env: Env, to: string, name: string): Promise<void> {
  await sendBrevo(
    env.BREVO_API_KEY,
    to,
    "Access Request Received — Liminal Sin Prototype",
    EMAIL1_HTML(name),
  );
}

async function sendEmail2(
  env: Env,
  to: string,
  name: string,
  playUrl: string,
  expiresAtMs: number,
): Promise<void> {
  await sendBrevo(
    env.BREVO_API_KEY,
    to,
    "The Underground Is Open — Your Access Is Ready",
    EMAIL2_HTML(name, playUrl, formatExpiryDate(expiresAtMs)),
  );
}

async function handleSignup(request: Request, env: Env): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json(
      { error: "Expected application/json" },
      { status: 415 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, type } = body as Partial<SignupBody>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    type !== "access_request"
  ) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const trimmedName = name.trim().slice(0, 120);
  const trimmedEmail = email.trim().toLowerCase().slice(0, 254);

  if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  if (trimmedName.length === 0) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const clientIp =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown";

  await ensureSignupsSchema(env.liminal_sin_signups);

  const allowed = await checkSignupRateLimit(
    env.liminal_sin_signups,
    clientIp.slice(0, 64),
  );
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    await env.liminal_sin_signups
      .prepare(
        "INSERT INTO signups (name, email, type, created_at, status) VALUES (?, ?, ?, ?, 'pending')",
      )
      .bind(trimmedName, trimmedEmail, type, new Date().toISOString())
      .run();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("UNIQUE") || msg.includes("unique")) {
      return Response.json(
        { error: "This email is already registered." },
        { status: 409 },
      );
    }
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  try {
    await sendEmail1(env, trimmedEmail, trimmedName);
    await env.liminal_sin_signups
      .prepare("UPDATE signups SET email1_sent = 1 WHERE email = ?")
      .bind(trimmedEmail)
      .run();
  } catch (err) {
    console.error("[Email1 failed]", String(err));
  }

  return Response.json({ ok: true }, { status: 201 });
}

async function ensureAccessTokensTable(db: D1Database): Promise<void> {
  await db.prepare(ACCESS_TOKENS_DDL).run();
}

async function issueAccessGrant(
  env: Env,
  email: string,
  expiresInDays: number,
): Promise<{ expiresAt: number } | { error: string; status: number }> {
  await ensureSignupsSchema(env.liminal_sin_signups);
  await ensureAccessTokensTable(env.liminal_sin_signups);

  const signup = await env.liminal_sin_signups
    .prepare("SELECT name, email, status FROM signups WHERE email = ?")
    .bind(email)
    .first<{ name: string; email: string; status: string | null }>();

  if (!signup) {
    return { error: "Signup not found for this email.", status: 404 };
  }

  if (signup.status === "approved") {
    return { error: "Access already granted for this email.", status: 409 };
  }

  const token = generateSecureToken();
  const now = Date.now();
  const expiresAt = now + expiresInDays * 24 * 60 * 60 * 1000;
  const playUrl = `${SITE_ORIGIN}/ls/play?access=${encodeURIComponent(token)}`;

  await env.liminal_sin_signups
    .prepare(
      `INSERT INTO access_tokens (token, email, name, expires_at, created_at, revoked)
       VALUES (?, ?, ?, ?, ?, 0)`,
    )
    .bind(token, email, signup.name, expiresAt, now)
    .run();

  await env.liminal_sin_signups
    .prepare(
      "UPDATE signups SET status = 'approved', access_token = ? WHERE email = ?",
    )
    .bind(token, email)
    .run();

  try {
    await sendEmail2(env, email, signup.name, playUrl, expiresAt);
    await env.liminal_sin_signups
      .prepare("UPDATE signups SET email2_sent = 1 WHERE email = ?")
      .bind(email)
      .run();
  } catch (err) {
    console.error("[Email2 failed]", String(err));
    await env.liminal_sin_signups
      .prepare("UPDATE signups SET email2_sent = 0 WHERE email = ?")
      .bind(email)
      .run();
  }

  return { expiresAt };
}

async function handleAccessGrant(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!requireAdmin(request, env)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, expiresInDays } = body as Partial<GrantBody>;

  if (typeof email !== "string") {
    return Response.json({ error: "email is required" }, { status: 400 });
  }

  const trimmedEmail = email.trim().toLowerCase().slice(0, 254);
  if (!trimmedEmail.includes("@")) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const days =
    typeof expiresInDays === "number" && Number.isFinite(expiresInDays)
      ? Math.min(Math.max(1, Math.floor(expiresInDays)), MAX_EXPIRES_DAYS)
      : DEFAULT_EXPIRES_DAYS;

  const result = await issueAccessGrant(env, trimmedEmail, days);

  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json({ ok: true, expiresAt: result.expiresAt });
}

async function handleAccessRevoke(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!requireAdmin(request, env)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { token } = body as Partial<RevokeBody>;

  if (typeof token !== "string" || token.trim().length === 0) {
    return Response.json({ error: "token is required" }, { status: 400 });
  }

  await ensureAccessTokensTable(env.liminal_sin_signups);

  const existing = await env.liminal_sin_signups
    .prepare("SELECT token FROM access_tokens WHERE token = ? AND revoked = 0")
    .bind(token.trim().slice(0, 128))
    .first<{ token: string }>();

  if (!existing) {
    return Response.json({ error: "Token not found" }, { status: 404 });
  }

  await env.liminal_sin_signups
    .prepare("UPDATE access_tokens SET revoked = 1 WHERE token = ?")
    .bind(token.trim().slice(0, 128))
    .run();

  return Response.json({ ok: true });
}

async function handleSetGameLive(): Promise<Response> {
  return Response.json(
    {
      error: "Deprecated",
      message:
        "Use POST /api/access/grant with Authorization: Bearer <ADMIN_TOKEN> to approve individual signups.",
    },
    { status: 410 },
  );
}

async function handleLogError(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const sessionId = String(body.sessionId ?? "unknown").slice(0, 128);
    const errorType = String(body.errorType ?? "client_error").slice(0, 64);
    const message = String(body.message ?? "").slice(0, 1000);
    const severity = String(body.severity ?? "recoverable").slice(0, 32);
    const url = String(body.url ?? "").slice(0, 256);
    const stack = String(body.stack ?? "").slice(0, 2000);

    await env.liminal_sin_signups
      .prepare(
        `CREATE TABLE IF NOT EXISTS client_error_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT NOT NULL,
          error_type TEXT NOT NULL,
          message TEXT NOT NULL,
          severity TEXT NOT NULL,
          url TEXT,
          stack TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
      )
      .run();

    await env.liminal_sin_signups
      .prepare(
        `INSERT INTO client_error_logs (session_id, error_type, message, severity, url, stack)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(sessionId, errorType, message, severity, url, stack)
      .run();
  } catch {
    // Never cascade
  }
  return Response.json({ ok: true });
}

async function handleValidateAccess(
  request: Request,
  env: Env,
): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get("access")?.trim() ?? "";

  if (!token || token.length > 128) {
    return Response.json(
      { valid: false, reason: "not_found" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  await ensureAccessTokensTable(env.liminal_sin_signups);

  const row = await env.liminal_sin_signups
    .prepare(
      "SELECT token, expires_at, revoked FROM access_tokens WHERE token = ?",
    )
    .bind(token)
    .first<{ token: string; expires_at: number; revoked: number }>();

  if (!row) {
    return Response.json(
      { valid: false, reason: "not_found" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  if (row.revoked === 1) {
    return Response.json(
      { valid: false, reason: "revoked" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  if (Date.now() > row.expires_at) {
    return Response.json(
      { valid: false, reason: "expired" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  await env.liminal_sin_signups
    .prepare(
      "UPDATE access_tokens SET used_at = ? WHERE token = ? AND used_at IS NULL",
    )
    .bind(Date.now(), token)
    .run();

  return Response.json(
    { valid: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}

async function retryFailedAccessEmails(env: Env): Promise<void> {
  await ensureSignupsSchema(env.liminal_sin_signups);

  const { results } = await env.liminal_sin_signups
    .prepare(
      `SELECT name, email, access_token FROM signups
       WHERE status = 'approved' AND email2_sent = 0 AND access_token IS NOT NULL`,
    )
    .all<{ name: string; email: string; access_token: string }>();

  for (const row of results) {
    const tokenRow = await env.liminal_sin_signups
      .prepare(
        "SELECT expires_at FROM access_tokens WHERE token = ? AND revoked = 0",
      )
      .bind(row.access_token)
      .first<{ expires_at: number }>();

    if (!tokenRow || Date.now() > tokenRow.expires_at) {
      continue;
    }

    const playUrl = `${SITE_ORIGIN}/ls/play?access=${encodeURIComponent(row.access_token)}`;

    try {
      await sendEmail2(
        env,
        row.email,
        row.name,
        playUrl,
        tokenRow.expires_at,
      );
      await env.liminal_sin_signups
        .prepare("UPDATE signups SET email2_sent = 1 WHERE email = ?")
        .bind(row.email)
        .run();
    } catch {
      // Retry on next cron tick
    }
  }
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.hostname === "myceliainteractive.com") {
    url.hostname = "www.myceliainteractive.com";
    return Response.redirect(url.toString(), 301);
  }

  if (url.pathname === "/api/signup" && request.method === "POST") {
    return handleSignup(request, env);
  }
  if (url.pathname === "/api/signup") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (url.pathname === "/api/access/grant" && request.method === "POST") {
    return handleAccessGrant(request, env);
  }
  if (url.pathname === "/api/access/grant") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (url.pathname === "/api/access/revoke" && request.method === "POST") {
    return handleAccessRevoke(request, env);
  }
  if (url.pathname === "/api/access/revoke") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (url.pathname === "/api/set-game-live" && request.method === "POST") {
    return handleSetGameLive();
  }
  if (url.pathname === "/api/set-game-live") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (url.pathname === "/api/log-error" && request.method === "POST") {
    return handleLogError(request, env);
  }
  if (url.pathname === "/api/log-error") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (url.pathname === "/api/access/validate" && request.method === "GET") {
    return handleValidateAccess(request, env);
  }
  if (url.pathname === "/api/access/validate") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  return env.ASSETS.fetch(request);
}

// Security headers applied uniformly to every response leaving this Worker.
//
// CSP and Cross-Origin-Embedder-Policy/Cross-Origin-Opener-Policy are
// intentionally NOT set here. This site embeds a Gemini Live WebSocket
// connection, loads game media from a GCS-hosted bucket, and runs a
// third-party game client whose full set of required origins (script,
// connect, media, frame) has not yet been enumerated through live testing.
// A CSP or COEP/COOP added without that testing would likely break the
// Gemini Live session, GCS media loading, or the game client silently in
// production. Revisit once those origins have been confirmed against a
// live test pass.
function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains",
  );
  headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), autoplay=(self)",
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await handleRequest(request, env);
    return withSecurityHeaders(response);
  },

  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    await retryFailedAccessEmails(env);
  },
};

export default handler;
