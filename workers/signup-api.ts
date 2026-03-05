import { EmailMessage } from "cloudflare:email";

export interface Env {
  liminal_sin_signups: D1Database;
  SEND_EMAIL: SendEmail;
  ADMIN_TOKEN: string;
  ASSETS: Fetcher;
}

interface SignupBody {
  name: string;
  email: string;
  type: "judge" | "tester";
}

// Build RFC-5322 MIME message as a ReadableStream (required by cloudflare:email runtime)
function buildMimeStream(from: string, to: string, subject: string, html: string): ReadableStream {
  const raw = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    html,
  ].join("\r\n");
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(raw));
      controller.close();
    },
  });
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
        ${type === "judge"
          ? "Direct entry credentials will be issued before the experience goes live."
          : "You are on the list. We will contact you when a slot opens. Do not expect conventional onboarding."}
      </p>
      <div style="border-top:1px solid rgba(139,0,255,0.2);padding-top:20px;margin-top:8px;">
        <p style="font-size:11px;color:rgba(139,92,246,0.35);letter-spacing:0.15em;margin:0;">
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
        <p style="font-size:11px;color:rgba(139,92,246,0.35);letter-spacing:0.15em;margin:0;">
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
  type: "judge" | "tester"
): Promise<void> {
  const subject =
    type === "judge"
      ? "Clearance Authorized — Liminal Sin Judge Access"
      : "Signal Received — Liminal Sin Beta Access Request Logged";
  const stream = buildMimeStream("Liminal Sin <access@myceliainteractive.com>", to, subject, EMAIL1_HTML(name, type));
  const message = new EmailMessage("access@myceliainteractive.com", to, stream);
  await env.SEND_EMAIL.send(message);
}

async function sendEmail2(env: Env, to: string, name: string): Promise<void> {
  const stream = buildMimeStream(
    "Liminal Sin <access@myceliainteractive.com>",
    to,
    "The Underground Is Open — Your Access Is Ready",
    EMAIL2_HTML(name)
  );
  const message = new EmailMessage("access@myceliainteractive.com", to, stream);
  await env.SEND_EMAIL.send(message);
}

async function handleSignup(request: Request, env: Env): Promise<Response> {
  // Only accept JSON
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json({ error: "Expected application/json" }, { status: 415 });
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
        "INSERT INTO signups (name, email, type, created_at) VALUES (?, ?, ?, ?)"
      )
      .bind(trimmedName, trimmedEmail, type, new Date().toISOString())
      .run();
  } catch (err) {
    // Unique constraint or other DB error
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("UNIQUE") || msg.includes("unique")) {
      return Response.json(
        { error: "This email is already registered." },
        { status: 409 }
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
  } catch {
    // Email failure is non-fatal
  }

  return Response.json({ ok: true }, { status: 201 });
}

async function handleSetGameLive(request: Request, env: Env): Promise<Response> {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token || token !== env.ADMIN_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  await env.liminal_sin_signups
    .prepare("UPDATE settings SET value = '1' WHERE key = 'game_live'")
    .run();
  return Response.json({ ok: true, message: "Game is now live. Email 2 will deliver on the next cron tick." });
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
      .prepare("SELECT name, email FROM signups WHERE email1_sent = 1 AND email2_sent = 0")
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
