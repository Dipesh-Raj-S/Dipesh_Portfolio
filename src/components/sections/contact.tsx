import { Code2, Flag, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand";
import { CopyEmail } from "@/components/sections/copy-email";
import { Section } from "@/components/sections/section";
import { site } from "@/data/site";

export function Contact() {
  const profiles = [
    { label: "GitHub", href: site.github.url, Icon: GitHubIcon },
    { label: "LinkedIn", href: site.links.linkedin, Icon: LinkedInIcon },
    { label: "LeetCode", href: site.links.leetcode, Icon: Code2 },
    { label: "TryHackMe", href: site.links.tryhackme, Icon: Flag },
  ].filter((p): p is typeof p & { href: string } => !!p.href);

  return (
    <Section
      id="contact"
      eyebrow="08 · contact"
      title="Let's build something — or break it."
      intro="I'm looking for Software Engineering internships for Summer 2027. The fastest way to reach me is email."
    >
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 lamp-glow"
        />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              Email
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 inline-flex items-center gap-2 text-xl font-medium break-all text-foreground decoration-primary underline-offset-4 hover:underline sm:text-2xl"
            >
              <Mail className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {site.email}
            </a>
            <div className="mt-4">
              <CopyEmail email={site.email} />
            </div>
          </div>

          <ul aria-label="Profiles" className="flex flex-wrap gap-3">
            {profiles.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background-2 px-4 py-2.5 text-sm transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
