import { Figure } from "@/components/Figure";
import { Reveal, SplitLines } from "@/components/anim";
import { siteConfig } from "@/data/site";

/**
 * (01) — the person.
 *
 * A single full-length plate against a first-person statement, deliberately
 * off-balance: the photograph holds five columns on the left, the text six on
 * the right, and the two meet on a shared baseline. This is the section that
 * makes the site read as one person's portfolio rather than a studio's.
 */
export function Profile() {
  return (
    <section className="section shell" aria-labelledby="profile-label">
      <div className="flex items-baseline justify-between gap-6">
        <h2 id="profile-label" className="t-meta">
          (01) PROFILE
        </h2>
        <p className="t-meta">{siteConfig.location}</p>
      </div>

      <div className="grid-12 mt-[clamp(2.5rem,6vw,4.5rem)] items-end">
        <Figure
          src="/photos/full-length.jpg"
          alt={`${siteConfig.name}, full length`}
          index="Fig. 01"
          caption={siteConfig.name}
          sizes="(min-width: 768px) 38vw, 88vw"
          revealColor
          className="col-span-4 max-w-[20rem] md:col-span-5 md:max-w-none"
        />

        <div className="col-span-4 mt-14 md:col-span-6 md:col-start-7 md:mt-0">
          <SplitLines as="h3" onScroll className="t-headline">
            I&rsquo;m
            <br />
            Abdellah.
          </SplitLines>

          <Reveal stagger={0.08} className="mt-9 space-y-5 md:mt-11">
            <p className="t-body">
              A full-stack developer in {siteConfig.location}, with a background
              in fintech. At XPI I designed and optimised the payment management
              interface behind 5,000+ professional clients — the kind of
              software where being careless is expensive.
            </p>
            <p className="t-body">
              I build enterprise applications with Java, Spring Boot and the
              MERN stack, and I&rsquo;m now spending most of my time bridging
              that to AI: Gemini and OpenAI behind real endpoints, RAG for
              retrieval that returns context instead of a confident guess, and
              n8n workflows that remove the steps nobody should repeat by hand.
            </p>
          </Reveal>

          <div className="grid-12 mt-[clamp(2.5rem,5vw,3.5rem)] gap-y-7 border-t border-rule pt-6">
            <div className="col-span-2 md:col-span-4">
              <p className="t-meta">BASED IN</p>
              <p className="t-meta mt-2.5 text-ink-2">{siteConfig.location}</p>
            </div>
            <div className="col-span-2 md:col-span-4">
              <p className="t-meta">AVAILABILITY</p>
              <p className="t-meta mt-2.5 flex items-center gap-2.5 text-ink-2">
                <span className="dot-live shrink-0" aria-hidden="true" />
                OPEN — SENIOR ROLES
              </p>
            </div>
            <div className="col-span-2 md:col-span-4">
              <p className="t-meta">FOCUS</p>
              <p className="t-meta mt-2.5 text-ink-2">
                AI-INTEGRATED WEB PRODUCTS
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
