/**
 * @vitest-environment node
 */
// Runs in the Node environment (not jsdom): the route calls serverEnv(), which
// throws when `window` is defined, and this matches real server execution.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/contact/route";

function post(body: unknown, ip = "198.51.100.1") {
  return POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const valid = {
  name: "Alice",
  email: "alice@example.com",
  message: "Hello, this is a genuine message.",
};

let logSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  // Suppress (and capture) route logging.
  logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/contact", () => {
  it("accepts a valid submission", async () => {
    const res = await post(valid, "198.51.100.10");
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it("rejects invalid JSON with a generic error", async () => {
    const res = await post("not-json", "198.51.100.11");
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid request." });
  });

  it("rejects a missing name", async () => {
    const res = await post({ ...valid, name: "" }, "198.51.100.12");
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/name is required/i);
  });

  it("rejects an invalid email", async () => {
    const res = await post(
      { ...valid, email: "not-an-email" },
      "198.51.100.13",
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/valid email/i);
  });

  it("rejects an email containing HTML characters", async () => {
    const res = await post(
      { ...valid, email: "<x>@evil.com" },
      "198.51.100.14",
    );
    expect(res.status).toBe(400);
  });

  it("rejects an over-long message", async () => {
    const res = await post(
      { ...valid, message: "a".repeat(5001) },
      "198.51.100.15",
    );
    expect(res.status).toBe(400);
  });

  it("accepts a message containing HTML (tags are stripped, text kept)", async () => {
    const res = await post(
      { ...valid, message: "<script>alert(1)</script>Hello world" },
      "198.51.100.16",
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it("rejects an HTML-only message that is empty after stripping", async () => {
    const res = await post({ ...valid, message: "<b></b>" }, "198.51.100.17");
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid input." });
  });

  it("rate-limits after 3 requests from the same IP (429 + Retry-After)", async () => {
    const ip = "203.0.113.50";
    expect((await post(valid, ip)).status).toBe(200);
    expect((await post(valid, ip)).status).toBe(200);
    expect((await post(valid, ip)).status).toBe(200);

    const fourth = await post(valid, ip);
    expect(fourth.status).toBe(429);
    expect(Number(fourth.headers.get("retry-after"))).toBeGreaterThan(0);
    await expect(fourth.json()).resolves.toEqual({
      error: "Too many requests. Please try again later.",
    });
  });

  it("logs only a timestamp and hashed IP — never message content", async () => {
    const secret = "TOP-SECRET-do-not-log-12345";
    await post(
      { name: "Bob", email: "bob@secret.example", message: secret },
      "198.51.100.20",
    );

    expect(logSpy).toHaveBeenCalledWith(
      "[contact] received",
      expect.objectContaining({
        at: expect.any(String),
        ip: expect.any(String),
      }),
    );

    const serialized = JSON.stringify(logSpy.mock.calls);
    expect(serialized).not.toContain(secret);
    expect(serialized).not.toContain("bob@secret.example");
  });
});
