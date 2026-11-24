/**
 * Pure command interpreter for the interactive terminal section.
 * No DOM or React here, so it is trivially unit-testable.
 */

export type Tone = "default" | "muted" | "accent" | "error" | "success";

export interface OutputLine {
  text: string;
  tone?: Tone;
  href?: string;
}

export type CommandResult = { kind: "output"; lines: OutputLine[] } | { kind: "clear" };

export interface TerminalContext {
  name: string;
  role: string;
  email: string;
  githubUrl: string;
  about: string;
  focus: readonly string[];
  skills: readonly { title: string; skills: readonly string[] }[];
  projects: readonly {
    name: string;
    slug: string;
    description: string;
    featured?: boolean;
  }[];
  links: readonly { label: string; href: string }[];
}

export interface ParsedCommand {
  command: string;
  args: string[];
}

/** Commands listed by `help`, in display order. */
export const HELP_ENTRIES: readonly [string, string][] = [
  ["help", "list available commands"],
  ["about", "who I am, in one breath"],
  ["projects", "featured work (alias: ls projects/)"],
  ["skills", "what I work with (alias: cat skills.txt)"],
  ["contact", "ways to reach me"],
  ["whoami", "print the current user"],
  ["clear", "clear the screen"],
];

export function parseCommand(input: string): ParsedCommand {
  const parts = input.trim().split(/\s+/).filter(Boolean);
  const [command = "", ...args] = parts;
  return { command: command.toLowerCase(), args };
}

const out = (...lines: OutputLine[]): CommandResult => ({ kind: "output", lines });

function help(): CommandResult {
  const width = Math.max(...HELP_ENTRIES.map(([cmd]) => cmd.length)) + 2;
  return out(
    { text: "Available commands:", tone: "muted" },
    ...HELP_ENTRIES.map(([cmd, desc]) => ({ text: `  ${cmd.padEnd(width)}${desc}` })),
    { text: "Psst — there might be a sudo command worth trying.", tone: "muted" },
  );
}

function skills(ctx: TerminalContext): CommandResult {
  return out(
    ...ctx.skills.map((g) => ({ text: `${g.title.padEnd(16)}${g.skills.join(", ")}` })),
  );
}

function projects(ctx: TerminalContext): CommandResult {
  const featured = ctx.projects.filter((p) => p.featured);
  const list = featured.length > 0 ? featured : ctx.projects;
  return out(
    ...list.map((p) => ({
      text: `${p.slug}/`,
      tone: "accent" as const,
      href: `/projects/${p.slug}`,
    })),
    {
      text: `${ctx.projects.length} projects in total — scroll to “All projects” for the rest.`,
      tone: "muted",
    },
  );
}

function contact(ctx: TerminalContext): CommandResult {
  return out(
    { text: `email   ${ctx.email}`, href: `mailto:${ctx.email}` },
    ...ctx.links.map((l) => ({
      text: `${l.label.toLowerCase().padEnd(8)}${l.href}`,
      href: l.href,
    })),
  );
}

function sudo(args: string[]): CommandResult {
  const target = args.join(" ").toLowerCase();
  if (target === "hire-me" || target === "hire me") {
    return out(
      { text: "[sudo] password for recruiter: ********", tone: "muted" },
      { text: "Access granted.", tone: "success" },
      {
        text: "Scheduling interview… done. Summer 2027 SWE internship: ready when you are.",
      },
      { text: "Type `contact` to make it official.", tone: "accent" },
    );
  }
  if (!target) return out({ text: "usage: sudo <command>", tone: "muted" });
  return out({
    text: `visitor is not in the sudoers file. This incident will be reported. (try: sudo hire-me)`,
    tone: "error",
  });
}

export function runCommand(input: string, ctx: TerminalContext): CommandResult {
  const { command, args } = parseCommand(input);
  const rest = args.join(" ").toLowerCase();

  switch (command) {
    case "":
      return out();
    case "help":
    case "?":
      return help();
    case "about":
      return out(
        { text: `${ctx.name} — ${ctx.role}`, tone: "accent" },
        { text: ctx.about },
        { text: `Focus: ${ctx.focus.join(" · ")}`, tone: "muted" },
      );
    case "whoami":
      return out({ text: `${ctx.name.toLowerCase().replace(/\s+/g, "")} — ${ctx.role}` });
    case "skills":
      return skills(ctx);
    case "cat":
      if (rest === "skills.txt") return skills(ctx);
      if (!rest) return out({ text: "usage: cat <file>", tone: "muted" });
      return out({
        text: `cat: ${args.join(" ")}: No such file or directory`,
        tone: "error",
      });
    case "projects":
      return projects(ctx);
    case "ls":
      if (rest === "projects" || rest === "projects/") return projects(ctx);
      return out({ text: "projects/  skills.txt  resume.pdf" });
    case "contact":
      return contact(ctx);
    case "clear":
    case "cls":
      return { kind: "clear" };
    case "sudo":
      return sudo(args);
    case "echo":
      return out({ text: args.join(" ") });
    default:
      return out({
        text: `command not found: ${command}. Type \`help\` to see what's available.`,
        tone: "error",
      });
  }
}
