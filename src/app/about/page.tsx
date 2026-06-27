import type { Metadata } from "next";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";

import { siteConfig } from "@/data/site";
import { skills } from "@/data/skills";
import { experience } from "@/data/experience";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — background, skills, and experience.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:py-20">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About me
        </h1>
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" />
          Based in {siteConfig.location}
        </p>
      </header>

      {/* Bio */}
      <section className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 text-muted-foreground md:col-span-2">
          <p>
            I&apos;m a {siteConfig.role.toLowerCase()} who enjoys turning
            ambiguous problems into reliable, well-tested software. My focus is
            building performant web applications and the automated pipelines
            that ship them safely.
          </p>
          <p>
            I care about developer experience as much as user experience: typed
            APIs, fast feedback loops, and infrastructure that&apos;s boring in
            the best way. When I&apos;m not coding, I&apos;m usually reading
            about distributed systems or contributing to open source.
          </p>
        </div>
        <dl className="space-y-4 rounded-xl border bg-card/60 p-6 text-sm backdrop-blur">
          <div>
            <dt className="text-muted-foreground">Experience</dt>
            <dd className="text-2xl font-bold">4+ years</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Projects shipped</dt>
            <dd className="text-2xl font-bold">20+</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Open to</dt>
            <dd className="font-medium">Full-time &amp; freelance</dd>
          </div>
        </dl>
      </section>

      {/* Skills */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Skills</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((group) => (
            <Card key={group.category} className="bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">{group.category}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Experience timeline */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
        <ol className="relative space-y-10 border-l pl-8">
          {experience.map((item) => {
            const Icon = item.kind === "education" ? GraduationCap : Briefcase;
            return (
              <li
                key={`${item.organization}-${item.role}`}
                className="relative"
              >
                <span className="absolute -left-[2.45rem] flex size-7 items-center justify-center rounded-full border bg-background text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold">{item.role}</h3>
                  <Badge variant="secondary">{item.organization}</Badge>
                </div>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {item.period}
                </p>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
