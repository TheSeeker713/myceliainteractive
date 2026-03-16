export interface Env {
  liminal_sin_signups: D1Database;
  BREVO_API_KEY: string;
  ADMIN_TOKEN: string;
  ASSETS: Fetcher;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AI: any;
}

interface SignupBody {
  name: string;
  email: string;
  type: "judge" | "tester";
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

const EMAIL1_HTML = (name: string, type: "judge" | "tester") => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08041a;font-family:'Courier New',monospace;color:#e9d5ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#0a0514;border:1px solid rgba(139,0,255,0.3);border-radius:12px;overflow:hidden;">
    <tr><td style="padding:32px 40px;">
      <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(192,132,252,0.5);margin:0 0 20px;">Liminal Sin — Signal Received</p>
      <h1 style="font-size:22px;font-weight:900;color:#e9d5ff;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">
        ${type === "judge" ? "Clearance Authorized" : "Application Received"}
      </h1>
      <p style="font-size:14px;color:rgba(196,181,253,0.7);line-height:1.7;margin:0 0 24px;">
        <strong style="color:#e9d5ff;">${name}</strong>,<br>
        Your access request has been logged in the system.
        ${
          type === "judge"
            ? "Direct entry credentials will be issued before the experience goes live."
            : "You are on the list. We will contact you when a slot opens. Do not expect conventional onboarding."
        }
      </p>
      <div style="border-top:1px solid rgba(139,0,255,0.2);padding-top:20px;margin-top:8px;">
        <p style="font-size:11px;color:rgba(139,92,246,0.7);letter-spacing:0.15em;margin:0;">
          LIMINAL SIN — MYCELIA INTERACTIVE — 2026<br>
          This message was sent because you requested access. You will not receive further unsolicited contact.
        </p>
      </div>
    </td></tr>
  </table>
</body>
</html>`;

const EMAIL2_HTML = (name: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08041a;font-family:'Courier New',monospace;color:#e9d5ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#0a0514;border:1px solid rgba(139,0,255,0.3);border-radius:12px;overflow:hidden;">
    <tr><td style="padding:32px 40px;">
      <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(192,132,252,0.5);margin:0 0 20px;">Liminal Sin — Access Granted</p>
      <h1 style="font-size:22px;font-weight:900;color:#e9d5ff;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">The Underground Is Open</h1>
      <p style="font-size:14px;color:rgba(196,181,253,0.7);line-height:1.7;margin:0 0 24px;">
        <strong style="color:#e9d5ff;">${name}</strong>,<br>
        The signal is live. Your access slot is now active.<br>
        Step into the Vegas Underground — if you still have the nerve.
      </p>
      <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
        <tr><td style="background:linear-gradient(135deg,#6b21a8,#7e22ce);border-radius:6px;padding:0;">
          <a href="https://myceliainteractive.com/ls" style="display:block;padding:14px 32px;font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#fff;text-decoration:none;">
            Enter the Underground →
          </a>
        </td></tr>
      </table>
      <div style="border-top:1px solid rgba(139,0,255,0.2);padding-top:20px;margin-top:8px;">
        <p style="font-size:11px;color:rgba(139,92,246,0.7);letter-spacing:0.15em;margin:0;">
          LIMINAL SIN — MYCELIA INTERACTIVE — 2026
        </p>
      </div>
    </td></tr>
  </table>
</body>
</html>`;

async function sendEmail1(
  env: Env,
  to: string,
  name: string,
  type: "judge" | "tester",
): Promise<void> {
  const subject =
    type === "judge"
      ? "Clearance Authorized — Liminal Sin Judge Access"
      : "Signal Received — Liminal Sin Beta Access Request Logged";
  await sendBrevo(env.BREVO_API_KEY, to, subject, EMAIL1_HTML(name, type));
}

async function sendEmail2(env: Env, to: string, name: string): Promise<void> {
  await sendBrevo(
    env.BREVO_API_KEY,
    to,
    "The Underground Is Open — Your Access Is Ready",
    EMAIL2_HTML(name),
  );
}

async function handleSignup(request: Request, env: Env): Promise<Response> {
  // Only accept JSON
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

  // Input validation
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    (type !== "judge" && type !== "tester")
  ) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const trimmedName = name.trim().slice(0, 120);
  const trimmedEmail = email.trim().toLowerCase().slice(0, 254);

  // Basic email format check
  if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  if (trimmedName.length === 0) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    // Write to D1
    await env.liminal_sin_signups
      .prepare(
        "INSERT INTO signups (name, email, type, created_at) VALUES (?, ?, ?, ?)",
      )
      .bind(trimmedName, trimmedEmail, type, new Date().toISOString())
      .run();
  } catch (err) {
    // Unique constraint or other DB error
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("UNIQUE") || msg.includes("unique")) {
      return Response.json(
        { error: "This email is already registered." },
        { status: 409 },
      );
    }
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  // Send Email 1 — non-blocking; signup is already persisted
  try {
    await sendEmail1(env, trimmedEmail, trimmedName, type);
    await env.liminal_sin_signups
      .prepare("UPDATE signups SET email1_sent = 1 WHERE email = ?")
      .bind(trimmedEmail)
      .run();
  } catch (err) {
    console.error("[Email1 failed]", String(err));
  }

  return Response.json({ ok: true }, { status: 201 });
}

async function handleSetGameLive(
  request: Request,
  env: Env,
): Promise<Response> {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token || token !== env.ADMIN_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  await env.liminal_sin_signups
    .prepare("UPDATE settings SET value = '1' WHERE key = 'game_live'")
    .run();
  return Response.json({
    ok: true,
    message: "Game is now live. Email 2 will deliver on the next cron tick.",
  });
}

// Token restriction constants
const MAX_SEEDS = 12;

const FPV_PROMPTS = [
  "Photorealistic FPV view through smart glasses, walking down the Vegas Underground Boring Tunnel, creepy, dimly lit, liminal space, glowing neon signs in the distance, highly detailed 8k",
  "Photorealistic FPV view through smart glasses, exploring an abandoned underground waterpark, dry cracked slides, rusted metal, eerie shadows, liminal space, hyper-realistic",
  "Photorealistic FPV view through smart glasses, a surreal blending of a Las Vegas tunnel and an abandoned dirty waterpark, illogical architecture, dreamcore horror, highly detailed",
];

async function handleAiImage(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  // Cap generation variations to protect AI limits
  const seedParam = url.searchParams.get("seed") || "0";
  const rawSeed = parseInt(seedParam, 10);
  const safeSeed = isNaN(rawSeed) ? 0 : rawSeed % MAX_SEEDS;

  // Try to return from cache first via explicitly fetched cache if environment supports it, but here we can just rely on standard HTTP caching for the edge by returning standard headers. The worker environment type doesn't have caches.default natively without extra types.
  // Instead, since Cloudflare automatically caches based on Cache-Control for GET requests via standard zones, we just need to return the correct headers.

  // Rotate prompts based on the seed
  const prompt = FPV_PROMPTS[safeSeed % FPV_PROMPTS.length];

  try {
    const aiResponse = await env.AI.run(
      "@cf/black-forest-labs/flux-1-schnell",
      {
        prompt,
        // Pass the seed to ensure deterministic output for the same safeSeed
        seed: safeSeed * 1000, // Arbitrary multiplier to space out seeds
      },
    );

    // Cloudflare AI text-to-image returns a JSON object with a base64 encoded string in `image`
    const binaryString = atob(aiResponse.image);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const response = new Response(bytes, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache heavily
      },
    });

    return response;
  } catch (err) {
    console.error("AI Generation Error:", err);
    return Response.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}

async function handleLogError(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    // Sanitize and cap string lengths to prevent injection/bloat
    const sessionId = String(body.sessionId ?? "unknown").slice(0, 128);
    const errorType = String(body.errorType ?? "client_error").slice(0, 64);
    const message = String(body.message ?? "").slice(0, 1000);
    const severity = String(body.severity ?? "recoverable").slice(0, 32);
    const url = String(body.url ?? "").slice(0, 256);
    const stack = String(body.stack ?? "").slice(0, 2000);

    // Self-initialising table — no migration infrastructure needed
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
    // Never cascade — log failure must not break the game session
  }
  return Response.json({ ok: true });
}

// ── Comments ──────────────────────────────────────────────────────────

const COMMENTS_TABLE_DDL = `CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`;

async function ensureCommentsTable(db: D1Database): Promise<void> {
  await db.prepare(COMMENTS_TABLE_DDL).run();
}

async function handleGetComments(env: Env): Promise<Response> {
  await ensureCommentsTable(env.liminal_sin_signups);
  const { results } = await env.liminal_sin_signups
    .prepare(
      "SELECT id, text, created_at FROM comments ORDER BY created_at DESC LIMIT 200",
    )
    .all<{ id: number; text: string; created_at: string }>();
  return Response.json({ comments: results }, {
    headers: { "Cache-Control": "no-cache" },
  });
}

async function handlePostComment(
  request: Request,
  env: Env,
): Promise<Response> {
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

  const { text } = body as Partial<{ text: string }>;
  if (typeof text !== "string" || text.trim().length === 0) {
    return Response.json({ error: "Text is required" }, { status: 400 });
  }

  const trimmed = text.trim().slice(0, 2000);

  await ensureCommentsTable(env.liminal_sin_signups);
  const result = await env.liminal_sin_signups
    .prepare("INSERT INTO comments (text) VALUES (?)")
    .bind(trimmed)
    .run();

  if (!result.success) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Intercept POST /api/signup only
    if (url.pathname === "/api/signup" && request.method === "POST") {
      return handleSignup(request, env);
    }

    // Block non-POST to the API route
    if (url.pathname === "/api/signup") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    // Admin: set game live
    if (url.pathname === "/api/set-game-live" && request.method === "POST") {
      return handleSetGameLive(request, env);
    }
    if (url.pathname === "/api/set-game-live") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    // AI Image Endpoint
    if (url.pathname === "/api/ai/image" && request.method === "GET") {
      return handleAiImage(request, env);
    }
    if (url.pathname === "/api/ai/image") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    // Client error logging
    if (url.pathname === "/api/log-error" && request.method === "POST") {
      return handleLogError(request, env);
    }
    if (url.pathname === "/api/log-error") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    // Comments
    if (url.pathname === "/api/comments" && request.method === "GET") {
      return handleGetComments(env);
    }
    if (url.pathname === "/api/comments" && request.method === "POST") {
      return handlePostComment(request, env);
    }
    if (url.pathname === "/api/comments") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    // Everything else: serve static assets
    return env.ASSETS.fetch(request);
  },

  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    // Check if game is live before doing any work
    const setting = await env.liminal_sin_signups
      .prepare("SELECT value FROM settings WHERE key = 'game_live'")
      .first<{ value: string }>();

    if (!setting || setting.value !== "1") return;

    // Find all users who received Email 1 but not yet Email 2
    const { results } = await env.liminal_sin_signups
      .prepare(
        "SELECT name, email FROM signups WHERE email1_sent = 1 AND email2_sent = 0",
      )
      .all<{ name: string; email: string }>();

    for (const row of results) {
      try {
        await sendEmail2(env, row.email, row.name);
        await env.liminal_sin_signups
          .prepare("UPDATE signups SET email2_sent = 1 WHERE email = ?")
          .bind(row.email)
          .run();
      } catch {
        // Leave email2_sent = 0 so the next cron tick retries
      }
    }
  },
};

export default handler;
