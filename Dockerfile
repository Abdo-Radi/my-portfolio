# syntax=docker/dockerfile:1

# Multi-stage build → minimal production image using Next.js standalone output
# (next.config.ts sets output: "standalone"). Target final image size < 200 MB.

# ---- deps: install ALL dependencies (dev deps are needed to build) ----
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ---- builder: compile the app ----
FROM node:26-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined at build time, so the real site URL must be
# present during `next build` for correct canonical/OG/sitemap links:
#   docker build --build-arg NEXT_PUBLIC_SITE_URL=https://yourdomain.com -t my-portfolio .
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- runner: tiny runtime layer ----
FROM node:26-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy ONLY the standalone server, static assets, and public files — the
# standalone output bundles just the runtime node_modules it traced, so the
# full dependency tree never lands in the final image.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Liveness probe against the health route (busybox wget ships with alpine).
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1

# server.js is emitted by the standalone build.
CMD ["node", "server.js"]
