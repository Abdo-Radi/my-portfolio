# Developer Portfolio

> A production-grade developer portfolio built on Next.js 16 with a fully automated, security-hardened CI/CD pipeline — running entirely on free tiers ($0/month).

**Live demo:** https://your-domain.vercel.app _(replace with your URL)_

![Portfolio screenshot](./public/screenshot.png)
<!-- Add a real screenshot at public/screenshot.png -->

<!-- Badges: build status is live; the rest are placeholders until services are wired (Codecov, first Lighthouse run). -->
[![CI](https://github.com/Abdo-Radi/my-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Abdo-Radi/my-portfolio/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-report-blue)](https://github.com/Abdo-Radi/my-portfolio/actions/workflows/ci.yml)
[![Lighthouse](https://img.shields.io/badge/lighthouse-90%2B%20target-success)](./lighthouserc.json)
[![Docker image](https://img.shields.io/badge/docker-58MB%20compressed%20%2F%20180MB-2496ED?logo=docker&logoColor=white)](./Dockerfile)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

---

## What makes this different

This isn't a starter template with a deploy button — every layer reflects a deliberate engineering decision:

- **Built against the _real_ toolchain, not tutorials.** Targets the installed **Next.js 16 + Tailwind CSS v4** (async APIs, `proxy.ts`, CSS-first `@theme` config via `@config`, Turbopack), reading the framework's own bundled docs rather than assuming Next 14 patterns that no longer apply.
- **The API is treated as an attack surface.** The contact endpoint enforces per-IP rate limiting (3/hour), strips HTML, logs only a salted IP hash (never message content), and returns generic errors — and all of it is covered by unit tests, not just hand-waving.
- **The pipeline is the product.** A gated GitHub Actions flow (quality → test → security → docker) precedes any deploy; the Docker image is a multi-stage build verified at **180 MB uncompressed / 58 MB compressed** (well under the 200 MB budget); every PR gets an isolated preview deploy.
- **Fail fast, everywhere.** Strict TypeScript, Zod-validated environment variables that crash the build on misconfiguration, and a Husky pre-commit gate (ESLint + Prettier on staged files) mean broken or unformatted code never reaches CI.

---

## Tech stack

| Tool | Purpose | Why I chose it |
| --- | --- | --- |
| **Next.js 16** (App Router) | Framework, routing, SSR/SSG, route handlers | RSC + file-based routing + first-class Vercel support; one framework for UI and API |
| **React 19** | UI runtime | Server Components reduce client JS; latest concurrent features |
| **TypeScript 5** (strict) | Type safety | Strict mode + `noUncheckedIndexedAccess` catch whole classes of bugs at compile time |
| **Tailwind CSS v4** | Styling | CSS-first `@theme` config, zero runtime, design tokens that drive light/dark via CSS variables |
| **shadcn/ui** (new-york) | Component primitives | Accessible, unstyled-by-default, owned in-repo (no black-box dependency) |
| **next-themes** | Light/dark/system theme | Persists to `localStorage`, no hydration flash |
| **Zod** | Validation (env + API input) | One schema library for request bodies and fail-fast env validation |
| **Vitest + Testing Library** | Unit/component tests | Vite-fast, ESM-native, jsdom + node environments per file |
| **ESLint + Prettier** | Linting + formatting | `typescript-eslint` flat config + Prettier with Tailwind class sorting |
| **Husky + lint-staged** | Pre-commit quality gate | Blocks commits that fail lint/format before they reach CI |
| **Docker** (multi-stage) | Containerization | Reproducible, portable runtime from Next.js standalone output |
| **GitHub Actions** | CI/CD | Free for public repos; pipeline-as-code lives next to the code |
| **Vercel** | Hosting + preview deploys | Zero-config Next.js hosting, instant per-PR previews, generous free tier |
| **Resend** | Transactional email (contact form) | Simple API, free tier; optional — the app runs without it |
| **Lighthouse CI** | Performance/quality budgets | Automated, regressions surface in CI instead of in production |

---

## Architecture

```
 ┌──────────┐    HTTPS     ┌────────────────────┐     ┌───────────────────────────┐
 │ Browser  │ ───────────▶ │  Vercel Edge / CDN │ ──▶ │  Next.js 16 (App Router)  │
 │ (client) │ ◀─────────── │  TLS · caching     │ ◀── │  React 19 RSC · SSG/SSR   │
 └──────────┘              └────────────────────┘     └─────────────┬─────────────┘
                                                                     │
                                              ┌──────────────────────┴──────────────────┐
                                              │              Route Handlers              │
                                              │   POST /api/contact   GET /api/health    │
                                              └──────────────────────┬───────────────────┘
                                                                     │ server-only (secrets via Zod-validated env)
                                                                     ▼
                                                        ┌──────────────────────┐
                                                        │   Resend (email API) │
                                                        └──────────────────────┘
```

The browser only ever talks to Vercel's edge. Pages are statically prerendered where possible (`/`, `/about`, `/projects`, `/contact`) and the two API routes run server-side on demand. Secrets never reach the client — they're read through a server-only, lazily-evaluated env module.

---

## CI/CD pipeline

```
 git push / pull request
        │
        ▼
 ┌──────────────────────────────── CI · ci.yml ────────────────────────────────┐
 │  quality ───────▶ test ────────▶ security ─────────▶ docker                  │
 │  type-check       vitest +        npm audit           build image            │
 │  lint             coverage        Lighthouse CI       run + curl /api/health │
 │  prettier         (artifact)                                                 │
 │  (cancels stale runs via concurrency groups; all action versions pinned)     │
 └───────────────────────────────────┬──────────────────────────────────────────┘
                                      │  push to main && CI green
                                      ▼
 ┌──────────────────────────────── CD · cd.yml ────────────────────────────────┐
 │  build-push ──────────────▶ deploy ─────────────▶ notify                     │
 │  Docker Hub                 Vercel production      commit status + job summary│
 │  tags: latest + git SHA                                                       │
 └───────────────────────────────────┬──────────────────────────────────────────┘
                                      ▼
                                  🌐  Live

 pull request ──▶ pr-preview.yml ──▶ Vercel preview ──▶ sticky PR comment + "Preview ready" label
```

---

## Security features

| Feature | What it protects against |
| --- | --- |
| Rate limiting — 3 requests/IP/hour, `429` + `Retry-After` | Spam flooding, brute force, and resource/quota exhaustion (DoS) of the endpoint and email quota |
| HTML stripping on all inputs | Stored/reflected **XSS** and HTML/script injection into the email client or any rendering surface |
| Privacy logging — timestamp + salted IP hash only | **PII leakage** and de-anonymization if logs are exposed |
| Generic error responses (no stack traces) | **Information disclosure** that aids reconnaissance |
| Security headers — CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy | Clickjacking, MIME sniffing, mixed content, referrer leakage |
| Zod-validated environment variables | Misconfiguration and silent runtime failures (build fails fast on bad/missing required vars) |
| Non-root Docker user + minimal image | Container breakout blast radius and supply-chain surface |
| Husky pre-commit gate (ESLint + Prettier) | Shipping un-linted code and any insecure pattern ESLint flags |
| Dependabot (npm, Actions, Docker) | Known vulnerabilities in transitive and base-image dependencies |

---

## Lighthouse scores

CI-enforced minimum targets (see [`lighthouserc.json`](./lighthouserc.json)). Replace with your measured scores after the first run.

| Performance | Accessibility | Best Practices | SEO |
| :---: | :---: | :---: | :---: |
| ≥ 80 | ≥ 90 | ≥ 90 | ≥ 90 |

> Lighthouse CI runs on every push against a production build and uploads a shareable report to temporary public storage.

---

## Getting started

### Prerequisites

- **Node.js 20** (pinned in [`.nvmrc`](./.nvmrc)) and npm
- **Docker** (optional — only for the containerized run)

### Install

```bash
git clone https://github.com/Abdo-Radi/my-portfolio.git
cd my-portfolio
npm ci
```

### Environment setup

All variables are optional for local dev (the app runs with safe defaults):

```bash
cp .env.example .env.local
# then edit values as needed — see .env.example for every variable
```

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build-time | Absolute URL for canonical links, sitemap, and OG metadata |
| `RESEND_API_KEY` | server | Enables real contact-email delivery (logs only if unset) |
| `CONTACT_FROM_EMAIL` | server | Verified Resend "from" address |
| `IP_HASH_SALT` | server | Salt for one-way IP hashing in logs |

### Run locally

```bash
npm run dev          # http://localhost:3000
```

### Run with Docker

```bash
# via compose (build arg + optional .env loaded automatically)
docker compose up --build

# or manually — bake the production URL at build time
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.com -t my-portfolio .
docker run --rm -p 3000:3000 my-portfolio
```

### Useful scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier write / check |
| `npm test` / `test:coverage` | Vitest (with coverage) |

---

## Project structure

```
my-portfolio/
├── .github/
│   ├── workflows/          # CI (ci.yml), CD (cd.yml), PR previews (pr-preview.yml)
│   └── dependabot.yml      # Automated dependency updates (npm, Actions, Docker)
├── .husky/                 # Git hooks — pre-commit runs lint-staged
├── public/                 # Static assets (resume.pdf, project images, screenshot)
├── src/
│   ├── app/                # App Router: pages, layouts, API routes, SEO files
│   │   ├── api/            #   route handlers: contact (hardened) + health check
│   │   ├── about/ projects/ contact/   # individual pages (server components)
│   │   ├── opengraph-image.tsx, sitemap.ts, robots.ts   # generated SEO metadata
│   │   └── layout.tsx, page.tsx, globals.css, error/loading/not-found
│   ├── components/         # UI components (PascalCase) + ui/ (shadcn primitives)
│   ├── data/               # Typed content: site config, projects, skills, experience
│   └── lib/                # utils (cn) + env (Zod-validated, client/server split)
├── Dockerfile              # Multi-stage build (deps → builder → runner)
├── docker-compose.yml      # Local production-parity run
├── lighthouserc.json       # Lighthouse CI budgets
├── components.json         # shadcn/ui config
├── next.config.ts          # Standalone output, image config, security headers
├── tailwind.config.ts      # Tailwind v4 theme (loaded via @config in globals.css)
├── vitest.config.ts        # Test runner + coverage config
└── .env.example            # Documented environment variables (no secrets)
```

---

## What I would add next

- **E2E tests with Playwright** — cover the real user flows (submit the contact form, toggle theme, filter projects) across browsers, gating merges in CI alongside the existing unit tests.
- **A dedicated staging environment** — a `develop` → staging deploy mirroring production, so changes are smoke-tested against real infra before promotion to `main`.
- **Dependabot auto-merge** — Dependabot is already configured ✅; the next step is auto-merging green patch/minor updates to cut maintenance toil.
- **Feature flags** — a lightweight flag layer (e.g., environment-driven or a service like Vercel Flags) to ship work-in-progress behind toggles and run safe rollouts.

---

## License

Released under the **MIT License**. _(Add a `LICENSE` file to make the badge resolve.)_
