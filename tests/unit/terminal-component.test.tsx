import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Terminal } from "@/components/sections/terminal";
import type { TerminalContext } from "@/lib/terminal";

const ctx: TerminalContext = {
  name: "Dipesh Raj S",
  role: "Engineer",
  email: "me@example.com",
  githubUrl: "https://github.com/example",
  about: "I build things.",
  focus: ["Backend"],
  skills: [{ title: "Languages", skills: ["Python"] }],
  projects: [
    { name: "JailbreakOps", slug: "jailbreakops", description: "CTF", featured: true },
  ],
  links: [],
};

beforeEach(() => {
  // Reduced motion: the intro renders instantly instead of typing.
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(private cb: IntersectionObserverCallback) {}
      observe() {
        this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
      }
      disconnect() {}
    },
  );
});

describe("<Terminal />", () => {
  it("plays the intro, then accepts typed commands from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Terminal ctx={ctx} />);

    const input = await screen.findByLabelText(/type a command/i);
    expect(screen.getByRole("log")).toHaveTextContent("jailbreakops/");

    await user.type(input, "help{Enter}");
    expect(screen.getByRole("log")).toHaveTextContent("Available commands");

    await user.type(input, "clear{Enter}");
    expect(screen.getByRole("log")).toBeEmptyDOMElement();

    // history: ArrowUp recalls the previous command
    await user.keyboard("{ArrowUp}");
    expect(input).toHaveValue("clear");
  });
});
