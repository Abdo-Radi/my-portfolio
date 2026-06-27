import { z } from "zod";

import { siteConfig } from "@/data/site";
import { serverEnv } from "@/lib/env";

// Route Handlers are not cached by default; this one runs at request time.
// See node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

// Version-proof email check (Zod v3/v4 differ on the `.email()` API).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(200)
    .regex(EMAIL_RE, "A valid email is required."),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(5000, "Message must be 5000 characters or fewer."),
});

// Strip control characters (NUL through US, and DEL) that could enable header
// or log injection, while preserving tab, newline, and carriage return so
// multi-line messages survive. Built from an escaped string so no literal
// control bytes appear in this source file.
const CONTROL_CHARS = new RegExp(
  "[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]",
  "g",
);

/** Remove control characters that could enable header/log injection. */
function stripControl(value: string): string {
  return value.replace(CONTROL_CHARS, "");
}

/* -------------------------------------------------------------------------- */
/* Rate limiting                                                              */
/* -------------------------------------------------------------------------- */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

// In-memory fixed-window limiter. Good enough for a single instance; on
// serverless/multi-instance hosting it's best-effort (each instance has its own
// map). For durable limits, back this with Upstash Redis (free tier).
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 10_000) {
    for (const [key, entry] of hits) {
      if (now > entry.resetAt) hits.delete(key);
    }
  }

  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (entry.count >= MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true, retryAfter: 0 };
}

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

/* -------------------------------------------------------------------------- */
/* Handler                                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return Response.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    return Response.json({ error: message }, { status: 400 });
  }

  const name = stripControl(parsed.data.name);
  const email = parsed.data.email.toLowerCase();
  const message = stripControl(parsed.data.message);

  // Optional: deliver via Resend if an API key is configured. Falls back to
  // logging so the form works out of the box with zero setup.
  const env = serverEnv();
  const apiKey = env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
          to: siteConfig.email,
          reply_to: email,
          subject: `Portfolio contact from ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        console.error("Resend delivery failed:", res.status, detail);
        return Response.json(
          { error: "Failed to deliver message. Please email me directly." },
          { status: 502 },
        );
      }
    } catch (error) {
      console.error("Resend request error:", error);
      return Response.json(
        { error: "Failed to deliver message. Please email me directly." },
        { status: 502 },
      );
    }
  } else {
    // Development / unconfigured fallback.
    console.log("[contact] New message:", { name, email, message });
  }

  return Response.json({ ok: true }, { status: 200 });
}
