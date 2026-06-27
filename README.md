# Developer Portfolio

A production-ready developer portfolio with a full CI/CD pipeline — all on free tiers ($0/month).

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Vercel · GitHub Actions · Docker

> **Note:** This project targets **Next.js 16** (installed in the repo), which has breaking changes vs. Next 14 — async `params`, `proxy.ts`, Turbopack default, and Tailwind v4's CSS-first config. Framework docs are bundled at `node_modules/next/dist/docs/`.

## Features

- ⚡ Next.js 16 App Router with React 19 Server Components
- 🎨 Tailwind CSS v4 + shadcn/ui (new-york), light/dark/system theme via `next-themes`
- 📇 Section-based single page: hero, about, skills, projects, experience, contact
- 📨 Working contact form (`/api/contact`) — logs by default, optional Resend email
- 🔍 SEO: generated `sitemap.xml`, `robots.txt`, dynamic Open Graph image, rich metadata
- 🧪 Vitest + React Testing Library unit tests
- 🐳 Multi-stage Dockerfile using Next.js standalone output
- 🤖 GitHub Actions CI (lint → typecheck → test → build → docker) and CD to Vercel
- 🔄 Dependabot for npm, GitHub Actions, and Docker updates

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

### Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server                 |
| `npm run build`     | Production build                     |
| `npm start`         | Run the production build             |
| `npm run lint`      | ESLint                               |
| `npm run typecheck` | `tsc --noEmit`                       |
| `npm test`          | Run unit tests (Vitest)              |
| `npm run test:watch`| Watch-mode tests                     |

## Personalize

Edit the typed content in `src/data/`:

- `site.ts` — name, role, tagline, email, socials, resume URL
- `projects.ts` — project cards
- `skills.ts` — skill groups
- `experience.ts` — work & education timeline

Replace `public/resume.pdf` and the placeholder images in `public/projects/`.

## Environment variables

Copy `.env.example` to `.env.local`. All are optional for local dev:

- `NEXT_PUBLIC_SITE_URL` — absolute URL for metadata/sitemap/OG
- `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` — enable real email delivery for the contact form

## Docker

```bash
docker compose up --build      # http://localhost:3000
# or
docker build -t my-portfolio .
docker run -p 3000:3000 my-portfolio
```

The image uses Next.js `output: "standalone"` (set in `next.config.ts`) for a small runtime layer and runs as a non-root user.

## CI/CD

- **CI** (`.github/workflows/ci.yml`) runs on every push/PR to `main`: lint, typecheck, tests, `next build`, and a Docker image build (cached via GitHub Actions cache).
- **CD** (`.github/workflows/deploy.yml`) deploys to Vercel via the Vercel CLI **only after CI succeeds** on `main`.

### Deploy setup (one-time)

1. Create a project on [Vercel](https://vercel.com) (free Hobby tier) and link it: `npx vercel link`.
2. In GitHub repo **Settings → Secrets and variables → Actions**, add:
   - `VERCEL_TOKEN` — from Vercel account settings
   - `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` — found in `.vercel/project.json` after linking
3. Push to `main`. CI runs, then CD deploys to production.

> Prefer zero-config? You can instead connect the repo to Vercel's Git integration and delete `deploy.yml`.

## Project structure

```
src/
├── app/            # routes, layout, API, SEO files, error/loading/not-found
├── components/
│   ├── ui/         # shadcn/ui primitives
│   ├── layout/     # navbar, footer, theme toggle
│   └── sections/   # page sections
├── data/           # typed content (edit this)
└── lib/            # utils (cn)
```
