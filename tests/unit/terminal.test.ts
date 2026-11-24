import { describe, expect, it } from "vitest";
import {
  HELP_ENTRIES,
  parseCommand,
  runCommand,
  type TerminalContext,
} from "@/lib/terminal";

const ctx: TerminalContext = {
  name: "Dipesh Raj S",
  role: "Backend & Application Security Engineer",
  email: "me@example.com",
  githubUrl: "https://github.com/example",
  about: "I build things.",
  focus: ["Backend", "AppSec"],
  skills: [
    { title: "Languages", skills: ["Python", "C/C++"] },
    { title: "Databases", skills: ["PostgreSQL", "Redis"] },
  ],
  projects: [
    { name: "JailbreakOps", slug: "jailbreakops", description: "CTF", featured: true },
    { name: "Port Scanner", slug: "python-port-scanner", description: "scanner" },
  ],
  links: [{ label: "GitHub", href: "https://github.com/example" }],
};

function text(input: string): string[] {
  const result = runCommand(input, ctx);
  if (result.kind !== "output") throw new Error(`expected output for ${input}`);
  return result.lines.map((l) => l.text);
}

describe("parseCommand", () => {
  it("lower-cases the command, keeps args and collapses whitespace", () => {
    expect(parseCommand("  CAT   skills.txt ")).toEqual({
      command: "cat",
      args: ["skills.txt"],
    });
  });

  it("handles empty input", () => {
    expect(parseCommand("   ")).toEqual({ command: "", args: [] });
  });
});

describe("runCommand", () => {
  it("help lists every documented command", () => {
    const out = text("help").join("\n");
    for (const [cmd] of HELP_ENTRIES) expect(out).toContain(cmd);
  });

  it("whoami prints the user and role", () => {
    expect(text("whoami")[0]).toBe(
      "dipeshrajs — Backend & Application Security Engineer",
    );
  });

  it("skills and `cat skills.txt` print the same thing", () => {
    expect(text("cat skills.txt")).toEqual(text("skills"));
    expect(text("skills")[0]).toContain("Python, C/C++");
  });

  it("`ls projects/` lists featured projects as links to case studies", () => {
    const result = runCommand("ls projects/", ctx);
    expect(result.kind).toBe("output");
    if (result.kind !== "output") return;
    expect(result.lines[0]).toMatchObject({
      text: "jailbreakops/",
      href: "/projects/jailbreakops",
    });
    expect(result.lines.at(-1)?.text).toContain("2 projects");
  });

  it("contact includes a mailto link and profile links", () => {
    const result = runCommand("contact", ctx);
    if (result.kind !== "output") throw new Error();
    expect(result.lines[0]?.href).toBe("mailto:me@example.com");
    expect(result.lines.some((l) => l.href === "https://github.com/example")).toBe(true);
  });

  it("clear returns a clear instruction", () => {
    expect(runCommand("clear", ctx)).toEqual({ kind: "clear" });
  });

  it("sudo hire-me is an easter egg; other sudo is denied", () => {
    expect(text("sudo hire-me").join(" ")).toContain("Access granted");
    const denied = runCommand("sudo rm -rf /", ctx);
    if (denied.kind !== "output") throw new Error();
    expect(denied.lines[0]).toMatchObject({ tone: "error" });
  });

  it("unknown commands suggest help", () => {
    expect(text("hack the planet")[0]).toBe(
      "command not found: hack. Type `help` to see what's available.",
    );
  });

  it("missing files error like a shell", () => {
    expect(text("cat secrets.env")[0]).toContain("No such file or directory");
  });

  it("empty input produces no output", () => {
    expect(text("")).toEqual([]);
  });
});
