import { RuleDraw } from "@/components/anim";
import { cn } from "@/lib/utils";

/**
 * (03) — three blocks, drawn from the highlights in `src/data/experience.ts`.
 *
 * The columns are stepped rather than aligned: three identical blocks on a
 * shared baseline is the look this design exists to avoid. Each one opens with
 * its own hairline, so the rules land at three heights and the section reads as
 * typeset rather than templated.
 */
const blocks = [
  {
    folio: "(A)",
    title: "Fintech",
    offset: "",
    body: "Payment software is where I learned to be careful. At XPI I owned the management console behind a platform serving 5,000+ professional clients, cutting load times 30% through JavaScript refactoring and tighter DOM handling, and integrating secure transaction APIs alongside the backend team.",
  },
  {
    folio: "(B)",
    title: "AI & Automation",
    offset: "md:mt-[clamp(1.5rem,4vw,3.5rem)]",
    body: "I put language models to work in software that already exists: Gemini and OpenAI APIs behind real endpoints, LangChain and RAG for retrieval that returns context instead of a confident guess, and n8n agent workflows that remove the steps nobody should repeat by hand.",
  },
  {
    folio: "(C)",
    title: "Backend",
    offset: "md:mt-[clamp(3rem,8vw,7rem)]",
    body: "Java and Spring Boot on one side, Node and Express on the other. MongoDB index optimisation took API response times down 60%, and authentication is JWT with Bcrypt hashing and role-based access control — built in, not bolted on.",
  },
  {
    folio: "(D)",
    title: "Mobile",
    offset: "md:mt-[clamp(4.5rem,12vw,10.5rem)]",
    body: "The same product, on a phone. React Native with Expo and EAS builds iOS and Android from one codebase in the language the rest of the stack already speaks, so the API is reused rather than rewritten and the screens are the only thing built twice.",
  },
] as const;

export function Capabilities() {
  return (
    <section className="section" aria-labelledby="capabilities-label">
      <div className="shell">
        <div className="flex items-baseline justify-between gap-6 pb-[clamp(2.5rem,6vw,5rem)]">
          <h2 id="capabilities-label" className="t-meta">
            (03) CAPABILITIES
          </h2>
          <p className="t-meta">A / B / C / D</p>
        </div>

        <div className="grid-12 gap-y-14 md:gap-y-0">
          {blocks.map((block) => (
            <div
              key={block.folio}
              className={cn("col-span-4 md:col-span-3", block.offset)}
            >
              <RuleDraw />
              <p className="t-folio pt-5">{block.folio}</p>
              <h3 className="t-title pt-3">{block.title}</h3>
              <p className="t-body pt-5">{block.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
