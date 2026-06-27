import { z } from "zod";

/**
 * Validated, typed environment variables. Importing this module parses
 * `process.env` and throws immediately (failing the build / boot) when a
 * required variable is missing or invalid.
 *
 * - `clientEnv` holds only `NEXT_PUBLIC_*` values and is safe to import
 *   anywhere (including client components).
 * - `serverEnv` holds secrets and must only be imported from server code; it
 *   guards against accidental client usage.
 */

/** Version-proof URL check (Zod v3/v4 differ on `.url()`). */
const urlString = z.string().refine((value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}, "Must be a valid URL");

/**
 * Treat empty / whitespace-only values as "not set". Docker, docker-compose
 * (`${VAR:-}`), `.env` files, and CI commonly inject empty strings, which would
 * otherwise fail validation instead of falling back to a default / optional.
 */
function emptyToUndefined<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    schema,
  );
}

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
}

/* -------------------------------------------------------------------------- */
/* Client environment (exposed to the browser)                                */
/* -------------------------------------------------------------------------- */

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: emptyToUndefined(
    urlString.default("http://localhost:3000"),
  ),
});

// NOTE: reference each NEXT_PUBLIC_* var explicitly so Next.js can statically
// inline it into the client bundle.
const clientResult = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!clientResult.success) {
  throw new Error(
    `Invalid client environment variables:\n${formatIssues(clientResult.error)}`,
  );
}

export const clientEnv = clientResult.data;

/* -------------------------------------------------------------------------- */
/* Server environment (secrets — never import into client code)               */
/* -------------------------------------------------------------------------- */

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  // To make the build fail fast when a secret is missing, drop `.optional()`
  // (and any default) here — e.g. `RESEND_API_KEY: z.string().min(1)`.
  RESEND_API_KEY: emptyToUndefined(z.string().min(1).optional()),
  CONTACT_FROM_EMAIL: emptyToUndefined(z.string().min(1).optional()),
});

type ServerEnv = z.infer<typeof serverSchema>;
let cachedServerEnv: ServerEnv | undefined;

/**
 * Lazily parse and return the server-only env. Lazy (not eager) so that merely
 * importing this module from a file that is also reachable by client code never
 * evaluates server secrets in the browser. Throws if invalid, or if called on
 * the client.
 */
export function serverEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error(
      "serverEnv() was called in client-side code. Use clientEnv instead.",
    );
  }
  if (cachedServerEnv) return cachedServerEnv;
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      `Invalid server environment variables:\n${formatIssues(result.error)}`,
    );
  }
  cachedServerEnv = result.data;
  return cachedServerEnv;
}
