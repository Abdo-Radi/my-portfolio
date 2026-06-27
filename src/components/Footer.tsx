import { Github, Linkedin, Mail, Twitter } from "lucide-react";

import { siteConfig } from "@/data/site";

const links = [
  { href: siteConfig.socials.github, label: "GitHub", Icon: Github },
  { href: siteConfig.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: siteConfig.socials.twitter, label: "Twitter", Icon: Twitter },
  { href: `mailto:${siteConfig.email}`, label: "Email", Icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Built with
          Next.js & Tailwind.
        </p>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
