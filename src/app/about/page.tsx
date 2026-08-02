import type { Metadata } from "next";
import Link from "next/link";

import { Counter, Magnetic, RuleDraw, SplitLines } from "@/components/anim";
import { ExperienceTable } from "@/components/about/ExperienceTable";
import { Figure } from "@/components/Figure";
import { StackTable } from "@/components/about/StackTable";
import { experience } from "@/data/experience";
import { siteConfig } from "@/data/site";
import { skills } from "@/data/skills";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.name} — ${siteConfig.role} in ${siteConfig.location}. Roles, dates, stack, and how this site is built.`,
};

/** First four-digit year in a period string such as "2021 — 2023". */
function startYear(period: string): number {
  const match = /\d{4}/.exec(period);
  return match ? Number.parseInt(match[0], 10) : Number.NaN;
}

const currentYear = new Date().getFullYear();

const allStarts = experience
  .map((item) => startYear(item.period))
  .filter(Number.isFinite);
const workStarts = experience
  .filter((item) => item.kind === "work")
  .map((item) => startYear(item.period))
  .filter(Number.isFinite);

/** First year on the record at all — the degree, in practice. */
const recordStart = allStarts.length > 0 ? Math.min(...allStarts) : currentYear;
/** First year of paid work. */
const careerStart =
  workStarts.length > 0 ? Math.min(...workStarts) : recordStart;
const yearsShipping = Math.max(currentYear - careerStart, 0);

const stackCount = skills.reduce(
  (total, group) => total + group.items.length,
  0,
);

const [firstName = siteConfig.name, ...restOfName] = siteConfig.name.split(" ");
const lastName = restOfName.join(" ");

/** Section folio: the number in ink, the editorial label in metadata grey. */
function Folio({
  id,
  n,
  label,
  className,
}: {
  id: string;
  n: string;
  label: string;
  className?: string;
}) {
  return (
    <h2 id={id} className={cn("t-meta flex items-baseline gap-3", className)}>
      <span className="text-ink">({n})</span>
      <span>{label}</span>
    </h2>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* ---------------------------------------------------- (01) PROFILE */}
      <section
        aria-label="Profile"
        className="shell pt-[clamp(7rem,14vh,10rem)]"
      >
        <div className="grid-12 gap-y-3">
          <p className="t-meta col-span-4 flex items-baseline gap-3 md:col-span-6">
            <span className="text-ink">(01)</span>
            <span>Profile</span>
          </p>
          <p className="t-meta col-span-4 flex items-center gap-3 md:col-span-6 md:justify-end">
            <span>{siteConfig.location}</span>
            <span
              aria-hidden="true"
              className="h-px w-6 shrink-0 bg-rule-strong"
            />
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="dot-live shrink-0" />
              Available for work
            </span>
          </p>
        </div>

        <SplitLines
          as="h1"
          className="t-display mt-[clamp(2rem,5vw,3.25rem)] optical-left"
          delay={0.12}
        >
          {firstName}
          {lastName ? (
            <>
              <br />
              {lastName}
            </>
          ) : null}
        </SplitLines>

        <RuleDraw
          immediate
          delay={0.4}
          className="mt-[clamp(1.75rem,4vw,3rem)]"
        />

        <div className="grid-12 mt-[clamp(2.5rem,6vw,4.5rem)] pb-[clamp(4.5rem,10vw,9rem)]">
          <div className="col-span-4 md:col-span-5">
            <Figure
              src="/photos/portrait.jpg"
              alt={`${siteConfig.name}, ${siteConfig.role}`}
              index="Fig. 01"
              caption={`${siteConfig.name} — ${siteConfig.location}`}
              sizes="(min-width: 768px) 40vw, 88vw"
              priority
              className="max-w-[22rem] md:max-w-none"
            />
          </div>

          <div className="col-span-4 mt-12 md:col-span-6 md:col-start-7 md:mt-0">
            <SplitLines as="p" className="t-lead text-ink" onScroll>
              I build web products end to end — interface, API, and the pipeline
              that ships them.
            </SplitLines>

            <div className="mt-8 space-y-5 md:mt-10">
              <p className="t-body">
                Since 2023 I&rsquo;ve led customer-facing development at
                Birdman. The work I&rsquo;m most useful at is the unglamorous
                kind: production deploys went from 25 minutes to under 4 on a
                containerized GitHub Actions pipeline, and moving the marketing
                stack to the Next.js App Router took Lighthouse performance from
                68 to 98.
              </p>
              <p className="t-body">
                Before that I freelanced for two years and shipped 12+
                production apps across e-commerce, SaaS, and content — enough
                repetition to standardize a Next.js and Tailwind starter that
                halved kickoff time. A computer science degree, 2017 to 2021,
                sits under all of it.
              </p>
              <p className="t-body">
                Now I mentor three engineers and keep the team on trunk-based
                development with automated quality gates. Technically I care
                about correctness you can test, budgets you can enforce in CI,
                and interfaces that still work from the keyboard. TypeScript
                strict, everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- (02) EXPERIENCE */}
      <section aria-labelledby="experience-folio" className="section shell">
        <div className="grid-12 gap-y-3">
          <Folio
            id="experience-folio"
            n="02"
            label="Experience"
            className="col-span-4 md:col-span-6"
          />
          <p className="t-meta col-span-4 md:col-span-6 md:text-right">
            {recordStart} — {currentYear}
          </p>
        </div>

        <div className="grid-12 mt-[clamp(2rem,4vw,3rem)] items-end">
          <p className="t-meta col-span-4 md:col-span-5">
            Reverse chronological
          </p>
          <div className="col-span-4 mt-8 md:col-span-3 md:col-start-10 md:mt-0 md:text-right">
            <span className="block font-mono text-[clamp(2rem,4vw,3.25rem)] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
              <Counter to={yearsShipping} pad={2} />
            </span>
            <span className="t-meta mt-3 block">
              Years shipping production work
            </span>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)]">
          <ExperienceTable items={experience} />
        </div>

        {/* Deliberately small and set against a pull-out: at any larger size a
            documentary phone frame stops reading as a document and starts
            reading as a snapshot. */}
        <div className="grid-12 mt-[clamp(3rem,6vw,5rem)] items-end gap-y-12">
          <p className="t-lead col-span-4 md:col-span-6">
            Three engineers mentored, and a team moved onto trunk-based
            development with automated quality gates.
          </p>

          <Figure
            src="/photos/speaking.jpg"
            alt={`${siteConfig.name} presenting at a podium`}
            index="Fig. 02"
            caption={`Speaking — ${siteConfig.location}`}
            sizes="(min-width: 768px) 22vw, 55vw"
            className="col-span-2 max-w-[14rem] md:col-span-3 md:col-start-10 md:max-w-none"
          />
        </div>
      </section>

      {/* ------------------------------------------------------ (03) STACK */}
      <section aria-labelledby="stack-folio" className="section shell">
        <div className="grid-12 gap-y-3">
          <Folio
            id="stack-folio"
            n="03"
            label="Stack"
            className="col-span-4 md:col-span-6"
          />
          <p className="t-meta col-span-4 md:col-span-6 md:text-right">
            {skills.length} groups / {stackCount} entries
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)]">
          <StackTable />
        </div>
      </section>

      {/* --------------------------------------------------- (04) COLOPHON */}
      <section aria-labelledby="colophon-folio" className="section shell">
        <div className="grid-12">
          <Folio
            id="colophon-folio"
            n="04"
            label="Colophon"
            className="col-span-4 md:col-span-3"
          />

          <div className="col-span-4 mt-8 md:col-span-6 md:col-start-5 md:mt-0">
            <p className="t-body">
              Next.js 16 on the App Router, TypeScript, Tailwind v4, GSAP for
              motion, Vitest for tests. It builds into a container and ships
              through GitHub Actions. Typeset in Archivo and IBM Plex Mono on a
              twelve-column grid.
            </p>
          </div>

          <div className="col-span-4 mt-10 flex flex-col items-start gap-5 md:col-span-2 md:col-start-11 md:mt-0 md:items-end">
            <Magnetic>
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="t-meta link-draw text-ink"
              >
                Resume{" "}
                <span aria-hidden="true" className="text-signal">
                  ↗
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Magnetic>

            <Link href="/contact" className="t-meta link-draw text-ink">
              Contact <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
