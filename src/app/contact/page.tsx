import type { Metadata } from "next";

import { siteConfig } from "@/data/site";
import { RuleDraw, SplitLines } from "@/components/anim";
import { ContactForm } from "@/components/ContactForm";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { EmailLink } from "@/components/EmailLink";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name} — ${siteConfig.role}. Email, socials and a short form. Based in ${siteConfig.location}.`,
};

const ELSEWHERE = [
  { label: "GitHub", href: siteConfig.socials.github },
  { label: "LinkedIn", href: siteConfig.socials.linkedin },
];

/** One meta row: label above value, closed by a hairline. */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-rule py-[clamp(1rem,1.8vw,1.4rem)]">
      <dt className="t-meta">{label}</dt>
      <dd className="mt-2.5">{children}</dd>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <section className="shell pt-[clamp(7.5rem,17vh,11rem)]">
        <p className="t-folio">(01) CONTACT</p>

        <SplitLines
          as="h1"
          className="t-display mt-[clamp(1.25rem,3vw,2.25rem)] optical-left"
        >
          Get in
          <br />
          touch
        </SplitLines>

        <div className="mt-[clamp(2rem,4vw,3.25rem)]">
          <RuleDraw immediate delay={0.4} />
        </div>
      </section>

      <section className="shell pt-[clamp(2.5rem,6vw,4.5rem)] pb-[clamp(4.5rem,11vw,9rem)]">
        <div className="grid-12 gap-y-[clamp(3.5rem,7vw,5.5rem)]">
          {/* Cols 1–6: the form. No card, no panel — just rules. */}
          <div className="col-span-4 md:col-span-6">
            <h2 className="t-folio">(02) MESSAGE</h2>
            <p className="t-body mt-4">
              A role, a contract, or a problem you are stuck on. Tell me what it
              is and what you have already tried.
            </p>

            <div className="mt-[clamp(2rem,4vw,3rem)]">
              <ContactForm />
            </div>
          </div>

          {/* Cols 8–12: the meta column. The asymmetry is the point. */}
          <div className="col-span-4 md:col-span-5 md:col-start-8">
            <h2 className="t-folio">(03) DETAILS</h2>

            <dl className="mt-6 border-t border-rule">
              <Row label="Email">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <EmailLink className="link-draw font-mono text-[0.9375rem] tracking-[-0.01em] break-words text-ink">
                    {siteConfig.email}
                  </EmailLink>
                  <CopyEmailButton value={siteConfig.email} />
                </div>
              </Row>

              <Row label="Based in">
                <p className="font-mono text-[0.9375rem] text-ink">
                  {siteConfig.location}
                </p>
              </Row>

              <Row label="Availability">
                <p className="flex items-center gap-2.5 font-mono text-[0.9375rem] text-ink">
                  <span className="dot-live shrink-0" aria-hidden="true" />
                  Available for new work
                </p>
              </Row>

              <Row label="Response time">
                <p className="font-mono text-[0.9375rem] text-ink">
                  Within two working days
                </p>
              </Row>

              <Row label="Elsewhere">
                <ul className="flex flex-col gap-2.5">
                  {ELSEWHERE.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="t-meta link-draw inline-flex items-baseline gap-1.5 text-ink-2 transition-colors duration-200 hover:text-ink"
                      >
                        <span>{item.label}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Row>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
