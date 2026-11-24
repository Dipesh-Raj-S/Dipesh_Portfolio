"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  runCommand,
  type OutputLine,
  type TerminalContext,
  type Tone,
} from "@/lib/terminal";
import { cn } from "@/lib/utils";

type Entry =
  | { id: number; kind: "cmd"; text: string }
  | { id: number; kind: "out"; line: OutputLine };

const INTRO = ["whoami", "cat skills.txt", "ls projects/"] as const;
const TYPE_MS = 55;
const PAUSE_MS = 550;
const PROMPT = "visitor@dipesh.dev:~$";

const toneClass: Record<Tone, string> = {
  default: "text-foreground/90",
  muted: "text-muted-foreground",
  accent: "text-primary",
  error: "text-[#a3412c] dark:text-[#e39a86]",
  success: "text-secondary",
};

export function Terminal({ ctx }: { ctx: TerminalContext }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [typing, setTyping] = useState("");
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const introStarted = useRef(false);
  const cancelIntro = useRef<() => void>(() => {});

  const execute = useCallback(
    (command: string) => {
      const result = runCommand(command, ctx);
      if (result.kind === "clear") {
        setEntries([]);
        return;
      }
      setEntries((prev) => [
        ...prev,
        { id: nextId.current++, kind: "cmd", text: command },
        ...result.lines.map((line) => ({
          id: nextId.current++,
          kind: "out" as const,
          line,
        })),
      ]);
    },
    [ctx],
  );

  const finishIntro = useCallback(() => {
    if (ready) return;
    introStarted.current = true;
    cancelIntro.current();
    setTyping("");
    setEntries([]);
    INTRO.forEach((cmd) => execute(cmd));
    setReady(true);
  }, [execute, ready]);

  // Play the intro once the terminal scrolls into view.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let cancelled = false;
    cancelIntro.current = () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };

    const play = () => {
      if (introStarted.current) return;
      introStarted.current = true;
      if (reduce) {
        INTRO.forEach((cmd) => execute(cmd));
        setReady(true);
        return;
      }
      let delay = 300;
      INTRO.forEach((cmd, i) => {
        for (let c = 1; c <= cmd.length; c++) {
          timers.push(
            window.setTimeout(() => !cancelled && setTyping(cmd.slice(0, c)), delay),
          );
          delay += TYPE_MS;
        }
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setTyping("");
            execute(cmd);
            if (i === INTRO.length - 1) setReady(true);
          }, delay + 120),
        );
        delay += PAUSE_MS + 120;
      });
    };

    const observer = new IntersectionObserver(
      (items) => {
        if (items.some((i) => i.isIntersecting)) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      cancelIntro.current();
    };
  }, [execute]);

  // Keep the newest output in view without scrolling the page.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, typing]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const command = input.trim();
    setInput("");
    setHistoryIndex(null);
    if (!command) {
      setEntries((prev) => [...prev, { id: nextId.current++, kind: "cmd", text: "" }]);
      return;
    }
    setHistory((h) => [...h, command]);
    execute(command);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" && history.length > 0) {
      e.preventDefault();
      const index =
        historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setInput(history[index] ?? "");
    } else if (e.key === "ArrowDown" && historyIndex !== null) {
      e.preventDefault();
      const index = historyIndex + 1;
      if (index >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(index);
        setInput(history[index] ?? "");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  }

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-40px_rgba(0,0,0,0.5)] transition-shadow focus-within:border-primary/60 focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_22%,transparent)]"
      onClick={() => {
        finishIntro();
        inputRef.current?.focus();
      }}
    >
      <div className="flex items-center gap-2 border-b border-border bg-background-2 px-4 py-3">
        <span className="size-3 rounded-full bg-[#d9826b]/80" aria-hidden="true" />
        <span className="size-3 rounded-full bg-primary/80" aria-hidden="true" />
        <span className="size-3 rounded-full bg-secondary/80" aria-hidden="true" />
        <p className="ml-3 font-mono text-xs text-muted-foreground">
          dipesh@night-desk — zsh
        </p>
      </div>

      <div
        ref={scrollRef}
        className="h-[340px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-6 sm:px-5"
      >
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {entries.map((entry) =>
            entry.kind === "cmd" ? (
              <p key={entry.id} className="break-words whitespace-pre-wrap">
                <span className="text-secondary">{PROMPT}</span>{" "}
                <span className="text-foreground">{entry.text}</span>
              </p>
            ) : (
              <OutputRow key={entry.id} line={entry.line} />
            ),
          )}
        </div>

        {ready ? (
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <label htmlFor="terminal-input" className="shrink-0 text-secondary">
              {PROMPT}
              <span className="sr-only"> Type a command, for example help</span>
            </label>
            <input
              ref={inputRef}
              id="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              placeholder="type help"
              className="min-w-0 flex-1 bg-transparent text-foreground caret-primary outline-none placeholder:text-muted-foreground/70 focus-visible:outline-none"
            />
          </form>
        ) : (
          <p aria-hidden="true">
            <span className="text-secondary">{PROMPT}</span> <span>{typing}</span>
            <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-primary motion-safe:animate-pulse" />
          </p>
        )}
      </div>

      {!ready ? (
        <div className="border-t border-border px-4 py-2 text-right">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finishIntro();
              window.setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            skip intro →
          </button>
        </div>
      ) : null}
    </div>
  );
}

function OutputRow({ line }: { line: OutputLine }) {
  const className = cn(
    "break-words whitespace-pre-wrap",
    toneClass[line.tone ?? "default"],
  );
  if (!line.href) return <p className={className}>{line.text}</p>;
  const external = /^https?:/.test(line.href);
  return (
    <p className={className}>
      <a
        href={line.href}
        className="underline decoration-border underline-offset-4 hover:decoration-primary"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={(e) => e.stopPropagation()}
      >
        {line.text}
      </a>
    </p>
  );
}
