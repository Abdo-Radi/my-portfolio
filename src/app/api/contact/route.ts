import { createHash } from "node:crypto";

import { z } from "zod";

import { siteConfig } from "@/data/site";
import { serverEnv } from "@/lib/env";

// Route Handlers run at request time in the Node.js runtime (not cached).
// See node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

// Version-proof email check (Zod v3/v4 differ on `.email()`). Also rejects
// HTML/quote chars so markup can't ride in via the email field.
const EMAIL_RE = /^[^\s@<>"'`]+@[^\s@<>"'`]+\.[^\s@<>"'`]+$/;

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

/* -------------------------------------------------------------------------- */
/* Sanitization                                                               */
/* -------------------------------------------------------------------------- */

// Control characters (excluding tab/newline/CR), built from an escaped string
// so no literal control bytes appear in this source file.
const CONTROL_CHARS = new RegExp(
  "[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]",
  "g",
);

/** Remove HTML tags and stray angle brackets to neutralize markup/script. */
function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/[<>]/g, "");
}

/** Strip HTML, then control characters, then trim. */
function sanitize(value: string): string {
  return stripHtml(value).replace(CONTROL_CHARS, "").trim();
}

/* -------------------------------------------------------------------------- */
/* Rate limiting                                                              */
/* -------------------------------------------------------------------------- */

const WINDOW_MS = 60 * 60 * 1000; // 60 minutes
const MAX_REQUESTS = 3;

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

/** One-way, salted hash of the IP for privacy-preserving logs (no raw IPs). */
function hashIp(ip: string, salt: string | undefined): string {
  return createHash("sha256")
    .update(`${salt ?? ""}:${ip}`)
    .digest("hex")
    .slice(0, 16);
}

/* -------------------------------------------------------------------------- */
/* Handler                                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const limit = rateLimit(ip);
  if (!limit.ok) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  try {
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input.";
      return Response.json({ error: message }, { status: 400 });
    }

    const name = sanitize(parsed.data.name);
    const email = sanitize(parsed.data.email).toLowerCase();
    const message = sanitize(parsed.data.message);

    // Inputs can become empty after stripping HTML/control chars.
    if (!name || !message) {
      return Response.json({ error: "Invalid input." }, { status: 400 });
    }

    const env = serverEnv();

    // Deliver via Resend if configured. The message is sent, never logged.
    if (env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
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
        // Log the upstream status only — never message content.
        console.error("[contact] delivery failed", { status: res.status });
        return Response.json(
          {
            error:
              "Unable to send your message right now. Please try again later.",
          },
          { status: 502 },
        );
      }
    }

    // Privacy-preserving log: timestamp + hashed IP only. Never name/email/message.
    console.log("[contact] received", {
      at: new Date().toISOString(),
      ip: hashIp(ip, env.IP_HASH_SALT),
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch {
    // Generic message only — no stack traces or internal details reach the client.
    console.error("[contact] unexpected error");
    return Response.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
