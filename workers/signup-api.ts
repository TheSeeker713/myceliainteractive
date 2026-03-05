export interface Env {
  liminal_sin_signups: D1Database;
  RESEND_API_KEY: string;
  ASSETS: Fetcher;
}

interface SignupBody {
  name: string;
  email: string;
  type: "judge" | "tester";
}

const CONFIRMATION_HTML = (name: string, type: "judge" | "tester") => `
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
          This message was sent to you because you requested access. You will not receive further unsolicited contact.
        </p>
      </div>
    </td></tr>
  </table>
</body>
</html>`;

async function sendConfirmation(
  email: string,
  name: string,
  type: "judge" | "tester",
  resendKey: string
): Promise<void> {
  const subject =
    type === "judge"
      ? "Clearance Authorized — Liminal Sin Judge Access"
      : "Signal Received — Liminal Sin Beta Access Request Logged";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Liminal Sin <access@myceliainteractive.com>",
      to: email,
      subject,
      html: CONFIRMATION_HTML(name, type),
    }),
  });
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

  // Send confirmation email (non-blocking — don't fail the signup on email error)
  try {
    await sendConfirmation(trimmedEmail, trimmedName, type, env.RESEND_API_KEY);
  } catch {
    // Email failure is non-fatal; signup is already persisted
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

    // Everything else: serve static assets
    return env.ASSETS.fetch(request);
  },
};

export default handler;
